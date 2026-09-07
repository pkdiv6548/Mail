import { EmailMessage, FolderId, InboxCategory, Attachment, UserAccount, AppSettings } from '../types';
import { initialMockEmails, mockAccounts } from '../data/mockEmails';

const STORAGE_KEY = 'mailflow_emails_v1';
const LABELS_KEY = 'mailflow_custom_labels_v1';
const SETTINGS_KEY = 'mailflow_settings_v1';
const ACCOUNT_KEY = 'mailflow_active_account_v1';

const DEFAULT_LABELS = ['Work', 'Personal', 'Projects', 'Finance', 'Shopping', 'Travel'];

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  inboxType: 'default',
  swipeRightAction: 'archive',
  swipeLeftAction: 'delete',
  signature: 'Sent from MailFlow for Android',
  autoReplyEnabled: false,
  autoReplyText: 'Thank you for reaching out. I am currently out of office and will respond as soon as possible.',
  confirmBeforeDelete: false,
  confirmBeforeSend: false,
  aiSmartReplyEnabled: true,
  bottomNavMode: 'workspace'
};

function loadStoredEmails(): EmailMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached emails from localStorage', e);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockEmails));
  } catch {
    // Ignore quota errors in restricted envs
  }
  return initialMockEmails;
}

function saveStoredEmails(emails: EmailMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  } catch (e) {
    console.warn('Failed to save emails to localStorage', e);
  }
}

/**
 * MailFlow API Service Abstraction
 * Fully modular and designed for drop-in replacement with Gmail REST API,
 * Firebase Firestore, or custom backend endpoints.
 */
class EmailApiService {
  private cache: EmailMessage[] = loadStoredEmails();
  private accounts: UserAccount[] = [...mockAccounts];
  private currentAccount: UserAccount = mockAccounts[0];
  private settings: AppSettings = DEFAULT_SETTINGS;
  private customLabels: string[] = DEFAULT_LABELS;

  constructor() {
    this.loadSettings();
    this.loadLabels();
    this.loadActiveAccount();
  }

  private loadSettings(): void {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('Error loading settings', e);
    }
  }

  private loadLabels(): void {
    try {
      const raw = localStorage.getItem(LABELS_KEY);
      if (raw) {
        this.customLabels = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error loading labels', e);
    }
  }

  private loadActiveAccount(): void {
    try {
      const raw = localStorage.getItem(ACCOUNT_KEY);
      if (raw) {
        const found = this.accounts.find((a) => a.id === raw);
        if (found) this.currentAccount = found;
      }
    } catch (e) {
      console.warn('Error loading active account', e);
    }
  }

  public getCurrentAccount(): UserAccount {
    return this.currentAccount;
  }

  public setCurrentAccount(acc: UserAccount): void {
    this.currentAccount = acc;
    try {
      localStorage.setItem(ACCOUNT_KEY, acc.id);
    } catch {
      // ignore
    }
  }

  public getAccounts(): UserAccount[] {
    return this.accounts;
  }

  public getSettings(): AppSettings {
    return this.settings;
  }

  public async updateSettings(newSettings: Partial<AppSettings>): Promise<AppSettings> {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
    return this.settings;
  }

  public async getCustomLabels(): Promise<string[]> {
    return this.customLabels;
  }

  public async addCustomLabel(label: string): Promise<void> {
    if (!this.customLabels.includes(label)) {
      this.customLabels = [...this.customLabels, label];
      try {
        localStorage.setItem(LABELS_KEY, JSON.stringify(this.customLabels));
      } catch (e) {
        console.warn('Failed to save label', e);
      }
    }
  }

  public getEmailsSync(): EmailMessage[] {
    return [...this.cache];
  }

  public async getEmails(params?: {
    folder?: FolderId;
    category?: InboxCategory;
    label?: string;
    accountEmail?: string;
    searchQuery?: string;
  }): Promise<EmailMessage[]> {
    await new Promise((resolve) => setTimeout(resolve, 20));

    let list = [...this.cache];

    // Search query match if provided
    if (params?.searchQuery) {
      const q = params.searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.sender.toLowerCase().includes(q) ||
          m.senderEmail.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q) ||
          m.body.toLowerCase().includes(q)
      );
      return list.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Filter by folder
    const folder = params?.folder || 'inbox';

    if (folder === 'inbox') {
      list = list.filter((m) => !m.trash && !m.spam && !m.archived && !m.draft);
    } else if (folder === 'unread') {
      list = list.filter((m) => !m.read && !m.trash && !m.spam && !m.draft);
    } else if (folder === 'starred') {
      list = list.filter((m) => m.starred && !m.trash && !m.spam);
    } else if (folder === 'snoozed') {
      list = list.filter((m) => m.snoozed && !m.trash);
    } else if (folder === 'important') {
      list = list.filter((m) => m.important && !m.trash && !m.spam);
    } else if (folder === 'purchases') {
      list = list.filter((m) => m.labels.includes('Shopping') || m.labels.includes('Finance'));
    } else if (folder === 'sent') {
      list = list.filter((m) => m.senderEmail.includes('flowmail.io') && !m.draft && !m.trash);
    } else if (folder === 'scheduled') {
      list = list.filter((m) => m.scheduled && !m.trash);
    } else if (folder === 'outbox') {
      list = list.filter((m) => m.scheduled && !m.trash);
    } else if (folder === 'drafts') {
      list = list.filter((m) => m.draft && !m.trash);
    } else if (folder === 'all-mail') {
      list = list.filter((m) => !m.trash && !m.spam);
    } else if (folder === 'spam') {
      list = list.filter((m) => m.spam && !m.trash);
    } else if (folder === 'trash') {
      list = list.filter((m) => m.trash);
    } else if (folder === 'all-inboxes') {
      list = list.filter((m) => !m.trash && !m.spam && !m.archived && !m.draft);
    }

    // Filter by category if in inbox
    if (params?.category && folder === 'inbox') {
      list = list.filter((m) => m.category === params.category);
    }

    // Filter by custom label
    if (params?.label) {
      list = list.filter((m) => m.labels.includes(params.label!));
    }

    return list.sort((a, b) => b.timestamp - a.timestamp);
  }

  public async getEmail(id: string): Promise<EmailMessage | null> {
    await new Promise((resolve) => setTimeout(resolve, 20));
    return this.cache.find((m) => m.id === id) || null;
  }

  public async getThread(threadId: string): Promise<EmailMessage[]> {
    await new Promise((resolve) => setTimeout(resolve, 20));
    return this.cache
      .filter((m) => m.threadId === threadId && !m.trash)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  public async getThreadMessages(threadId: string): Promise<EmailMessage[]> {
    return this.getThread(threadId);
  }

  public async sendEmail(payload: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    attachments?: Attachment[];
    scheduledTime?: string;
  }): Promise<EmailMessage> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const isScheduled = !!payload.scheduledTime;
    const newMsg: EmailMessage = {
      id: 'sent-' + Date.now(),
      threadId: 'thread-' + Date.now(),
      sender: this.currentAccount.name,
      senderEmail: this.currentAccount.email,
      recipients: payload.to,
      cc: payload.cc,
      bcc: payload.bcc,
      subject: payload.subject || '(no subject)',
      preview: payload.body.replace(/<[^>]*>?/gm, '').slice(0, 100) || '(no preview)',
      body: payload.body,
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
      starred: false,
      important: false,
      labels: ['Sent'],
      category: 'primary',
      attachments: payload.attachments || [],
      hasAttachment: (payload.attachments || []).length > 0,
      scheduled: isScheduled,
      draft: false
    };

    this.cache.unshift(newMsg);
    saveStoredEmails(this.cache);
    return newMsg;
  }

  public async replyToEmail(emailId: string, replyText: string): Promise<EmailMessage> {
    const parent = this.cache.find((m) => m.id === emailId);
    const newMsg: EmailMessage = {
      id: 'reply-' + Date.now(),
      threadId: parent ? parent.threadId : 'thread-' + Date.now(),
      sender: this.currentAccount.name,
      senderEmail: this.currentAccount.email,
      recipients: parent ? [parent.senderEmail] : [],
      subject: parent ? `Re: ${parent.subject}` : 'Re: Conversation',
      preview: replyText.slice(0, 80),
      body: replyText,
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
      starred: false,
      important: false,
      labels: ['Sent'],
      category: 'primary',
      attachments: [],
      hasAttachment: false,
      draft: false
    };

    this.cache.push(newMsg);
    saveStoredEmails(this.cache);
    return newMsg;
  }

  public async saveDraft(payload: {
    id?: string;
    to: string[];
    subject: string;
    body: string;
    attachments?: Attachment[];
  }): Promise<EmailMessage> {
    const existingIndex = payload.id ? this.cache.findIndex((m) => m.id === payload.id) : -1;

    const draftMsg: EmailMessage = {
      id: payload.id || 'draft-' + Date.now(),
      threadId: 'draft-thread-' + Date.now(),
      sender: this.currentAccount.name,
      senderEmail: this.currentAccount.email,
      recipients: payload.to,
      subject: payload.subject ? `[Draft] ${payload.subject}` : '[Draft] (no subject)',
      preview: payload.body.slice(0, 80) || '(Empty draft)',
      body: payload.body,
      timestamp: Date.now(),
      dateFormatted: 'Draft',
      read: true,
      starred: false,
      important: false,
      labels: ['Drafts'],
      category: 'primary',
      attachments: payload.attachments || [],
      hasAttachment: (payload.attachments || []).length > 0,
      draft: true
    };

    if (existingIndex >= 0) {
      this.cache[existingIndex] = draftMsg;
    } else {
      this.cache.unshift(draftMsg);
    }
    saveStoredEmails(this.cache);
    return draftMsg;
  }

  public async deleteEmail(id: string): Promise<void> {
    const item = this.cache.find((m) => m.id === id);
    if (!item) return;

    if (item.trash) {
      this.cache = this.cache.filter((m) => m.id !== id);
    } else {
      item.trash = true;
    }
    saveStoredEmails(this.cache);
  }

  public async moveToFolder(id: string, folder: FolderId): Promise<void> {
    const item = this.cache.find((m) => m.id === id);
    if (!item) return;

    if (folder === 'inbox') {
      item.trash = false;
      item.archived = false;
      item.spam = false;
    } else if (folder === 'trash') {
      item.trash = true;
    } else if (folder === 'spam') {
      item.spam = true;
      item.trash = false;
    }
    saveStoredEmails(this.cache);
  }

  public async archiveEmail(id: string, archived = true): Promise<void> {
    const item = this.cache.find((m) => m.id === id);
    if (item) {
      item.archived = archived;
      saveStoredEmails(this.cache);
    }
  }

  public async batchArchive(ids: string[]): Promise<void> {
    this.cache.forEach((m) => {
      if (ids.includes(m.id)) m.archived = true;
    });
    saveStoredEmails(this.cache);
  }

  public async batchDelete(ids: string[]): Promise<void> {
    this.cache.forEach((m) => {
      if (ids.includes(m.id)) m.trash = true;
    });
    saveStoredEmails(this.cache);
  }

  public async batchMarkAsRead(ids: string[], read = true): Promise<void> {
    this.cache.forEach((m) => {
      if (ids.includes(m.id)) m.read = read;
    });
    saveStoredEmails(this.cache);
  }

  public async markAsRead(id: string, read = true): Promise<void> {
    const item = this.cache.find((m) => m.id === id);
    if (item) {
      item.read = read;
      saveStoredEmails(this.cache);
    }
  }

  public async toggleStar(id: string): Promise<void> {
    const item = this.cache.find((m) => m.id === id);
    if (item) {
      item.starred = !item.starred;
      saveStoredEmails(this.cache);
    }
  }

  public async snoozeEmail(id: string, untilTimestamp: number): Promise<void> {
    const item = this.cache.find((m) => m.id === id);
    if (item) {
      item.snoozed = true;
      item.snoozedUntil = untilTimestamp;
      saveStoredEmails(this.cache);
    }
  }

  public async getCounts(): Promise<Record<string, number>> {
    const unread = this.cache.filter((m) => !m.read && !m.trash && !m.spam && !m.draft).length;
    const inbox = this.cache.filter((m) => !m.trash && !m.spam && !m.archived && !m.draft).length;
    const starred = this.cache.filter((m) => m.starred && !m.trash && !m.spam).length;
    const drafts = this.cache.filter((m) => m.draft && !m.trash).length;
    const spam = this.cache.filter((m) => m.spam && !m.trash).length;
    const trash = this.cache.filter((m) => m.trash).length;
    const important = this.cache.filter((m) => m.important && !m.trash && !m.spam).length;
    const purchases = this.cache.filter((m) => m.labels.includes('Shopping') || m.labels.includes('Finance')).length;
    const sent = this.cache.filter((m) => m.senderEmail.includes('flowmail.io') && !m.draft).length;
    const allMail = this.cache.filter((m) => !m.trash && !m.spam).length;

    return {
      inbox,
      unread,
      starred,
      drafts,
      spam,
      trash,
      important,
      purchases,
      sent,
      allMail
    };
  }

  public async getFolderCounts(): Promise<Record<string, number>> {
    return this.getCounts();
  }

  public resetData(): void {
    this.cache = [...initialMockEmails];
    saveStoredEmails(this.cache);
  }

  public resetToDefaults(): void {
    this.resetData();
  }
}

export const emailApi = new EmailApiService();
