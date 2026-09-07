export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'doc' | 'archive' | 'audio';
  url?: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  sender: string;
  senderEmail: string;
  avatar?: string;
  recipients: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  preview: string;
  body: string;
  timestamp: number; // Unix timestamp
  dateFormatted: string;
  read: boolean;
  starred: boolean;
  important: boolean;
  labels: string[];
  category: 'primary' | 'social' | 'promotions' | 'updates' | 'forums';
  attachments: Attachment[];
  hasAttachment: boolean;
  snoozed?: boolean;
  snoozedUntil?: number;
  scheduled?: boolean;
  scheduledFor?: number;
  spam?: boolean;
  trash?: boolean;
  archived?: boolean;
  draft?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  storageUsed: string;
  storageLimit: string;
  storagePercentage: number;
}

export type InboxCategory = 'primary' | 'social' | 'promotions' | 'updates' | 'forums';

export type FolderId = 
  | 'inbox' 
  | 'unread'
  | 'all-inboxes'
  | 'starred' 
  | 'snoozed' 
  | 'important' 
  | 'purchases'
  | 'sent' 
  | 'scheduled' 
  | 'outbox'
  | 'drafts' 
  | 'all-mail' 
  | 'spam' 
  | 'trash';

export type SwipeActionType = 'archive' | 'delete' | 'mark-read' | 'star' | 'snooze';

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  inboxType: 'default' | 'important-first' | 'unread-first' | 'starred-first';
  swipeRightAction: SwipeActionType;
  swipeLeftAction: SwipeActionType;
  signature: string;
  autoReplyEnabled: boolean;
  autoReplyText: string;
  confirmBeforeDelete: boolean;
  confirmBeforeSend: boolean;
  aiSmartReplyEnabled: boolean;
  bottomNavMode: 'workspace' | 'mail-only';
}

export interface ToastMessage {
  id: string;
  text: string;
  undoAction?: () => void;
  duration?: number;
}

export interface ComposeDraft {
  id?: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  attachments: Attachment[];
  scheduledTime?: string;
}
