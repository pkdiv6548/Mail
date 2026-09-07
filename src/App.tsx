import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { emailApi } from './services/emailApi';
import {
  EmailMessage,
  FolderId,
  InboxCategory,
  UserAccount,
  AppSettings,
  ComposeDraft,
  Attachment,
  SwipeActionType
} from './types';
import { TopBar } from './components/TopBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { InboxList } from './components/InboxList';
import { EmailReader } from './components/EmailReader';
import { ComposeModal } from './components/ComposeModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { SearchFilterOverlay, SearchFilters } from './components/SearchFilterOverlay';
import { AccountSwitcher } from './components/AccountSwitcher';
import { SettingsModal } from './components/SettingsModal';
import { BottomNav, BottomNavTab } from './components/BottomNav';
import { ChatMeetView } from './components/ChatMeetView';
import { ToastContainer } from './components/ToastContainer';
import { ToastMessage } from './types';
import { usePWAInstall } from './hooks/usePWAInstall';
import { AiTaskType } from './services/aiAssistant';

export default function App() {
  // PWA Support Hook
  const { isInstallable, install } = usePWAInstall();

  // Core Data State
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [folderCounts, setFolderCounts] = useState<Record<string, number>>({});
  const [customLabels, setCustomLabels] = useState<string[]>([]);
  const [currentAccount, setCurrentAccount] = useState<UserAccount>(emailApi.getCurrentAccount());
  const [accounts, setAccounts] = useState<UserAccount[]>(emailApi.getAccounts());
  const [settings, setSettings] = useState<AppSettings>(emailApi.getSettings());
  const [isLoading, setIsLoading] = useState(false);

  // Navigation State
  const [activeFolder, setActiveFolder] = useState<FolderId>('inbox');
  const [activeLabel, setActiveLabel] = useState<string | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<InboxCategory>('primary');
  const [activeBottomTab, setActiveBottomTab] = useState<BottomNavTab>('mail');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Reading Pane & Thread State
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [threadMessages, setThreadMessages] = useState<EmailMessage[]>([]);

  // Selection & Search State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    hasAttachment: false,
    unreadOnly: false,
    starredOnly: false
  });
  const [isSearchFilterOpen, setIsSearchFilterOpen] = useState(false);

  // Modals State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeDraft, setComposeDraft] = useState<ComposeDraft | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiAssistantTask, setAiAssistantTask] = useState<AiTaskType>('summarize-email');
  const [aiDraftContext, setAiDraftContext] = useState<string>('');
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, actionLabel?: string, onAction?: () => void) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, text, undoAction: onAction }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync Theme with DOM
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };
    applyTheme();
  }, [settings.theme]);

  // Load Folder counts and labels
  const refreshMeta = useCallback(async () => {
    const counts = await emailApi.getFolderCounts();
    setFolderCounts(counts);
    const labels = await emailApi.getCustomLabels();
    setCustomLabels(labels);
  }, []);

  // Fetch emails based on folder / category / search
  const loadEmails = useCallback(async () => {
    setIsLoading(true);
    try {
      let data = await emailApi.getEmails({
        folder: activeFolder,
        label: activeLabel,
        category: activeFolder === 'inbox' && !activeLabel ? activeCategory : undefined,
        searchQuery: searchQuery.trim() || undefined
      });

      // Apply Search Filter Overrides
      if (searchFilters.hasAttachment) {
        data = data.filter((e) => e.hasAttachment);
      }
      if (searchFilters.unreadOnly) {
        data = data.filter((e) => !e.read);
      }
      if (searchFilters.starredOnly) {
        data = data.filter((e) => e.starred);
      }
      if (searchFilters.from) {
        data = data.filter((e) =>
          e.sender.toLowerCase().includes(searchFilters.from!.toLowerCase()) ||
          e.senderEmail.toLowerCase().includes(searchFilters.from!.toLowerCase())
        );
      }
      if (searchFilters.to) {
        data = data.filter((e) =>
          e.recipients.some((r) => r.toLowerCase().includes(searchFilters.to!.toLowerCase()))
        );
      }

      setEmails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [activeFolder, activeLabel, activeCategory, searchQuery, searchFilters]);

  // Initial Load and when folder/search changes
  useEffect(() => {
    refreshMeta();
    loadEmails();
  }, [refreshMeta, loadEmails]);

  // Load Thread when an email is selected
  useEffect(() => {
    if (selectedEmail) {
      emailApi.getThread(selectedEmail.threadId).then((thread) => {
        setThreadMessages(thread);
      });
      // Automatically mark as read
      if (!selectedEmail.read) {
        emailApi.markAsRead(selectedEmail.id, true).then(() => {
          setEmails((prev) =>
            prev.map((m) => (m.id === selectedEmail.id ? { ...m, read: true } : m))
          );
          refreshMeta();
        });
      }
    } else {
      setThreadMessages([]);
    }
  }, [selectedEmail, refreshMeta]);

  // Keyboard Shortcuts (c = compose, / = search, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'c') {
        e.preventDefault();
        setComposeDraft(null);
        setIsComposeOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        document.getElementById('search-input-field')?.focus();
      } else if (e.key === 'Escape') {
        if (selectedEmail) setSelectedEmail(null);
        if (isComposeOpen) setIsComposeOpen(false);
        if (isAiAssistantOpen) setIsAiAssistantOpen(false);
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (isAccountSwitcherOpen) setIsAccountSwitcherOpen(false);
      } else if (e.key === 'e' && selectedIds.length > 0) {
        e.preventDefault();
        handleBatchArchive();
      } else if (e.key === '#' && selectedIds.length > 0) {
        e.preventDefault();
        handleBatchDelete();
      } else if (e.key === 'm' && selectedIds.length > 0) {
        e.preventDefault();
        handleBatchMarkRead();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, selectedEmail, isComposeOpen, isAiAssistantOpen, isSettingsOpen, isAccountSwitcherOpen]);

  // Actions on single email
  const handleStarToggle = async (id: string, current: boolean) => {
    await emailApi.toggleStar(id);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !current } : e))
    );
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail({ ...selectedEmail, starred: !current });
    }
    refreshMeta();
  };

  const handleToggleRead = async (id: string, current: boolean) => {
    await emailApi.markAsRead(id, !current);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, read: !current } : e))
    );
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail({ ...selectedEmail, read: !current });
    }
    refreshMeta();
  };

  const handleArchive = async (id: string) => {
    const emailToArchive = emails.find((e) => e.id === id);
    await emailApi.archiveEmail(id);
    setEmails((prev) => prev.filter((e) => e.id !== id));
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
    refreshMeta();

    addToast('Conversation archived', 'Undo', async () => {
      if (emailToArchive) {
        await emailApi.moveToFolder(id, 'inbox');
        loadEmails();
        refreshMeta();
      }
    });
  };

  const handleDelete = async (id: string) => {
    const emailToDelete = emails.find((e) => e.id === id);
    await emailApi.moveToFolder(id, 'trash');
    setEmails((prev) => prev.filter((e) => e.id !== id));
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
    refreshMeta();

    addToast('Moved to Trash', 'Undo', async () => {
      if (emailToDelete) {
        await emailApi.moveToFolder(id, 'inbox');
        loadEmails();
        refreshMeta();
      }
    });
  };

  const handleSnooze = async (id: string) => {
    await emailApi.snoozeEmail(id, Date.now() + 24 * 60 * 60 * 1000);
    setEmails((prev) => prev.filter((e) => e.id !== id));
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
    refreshMeta();
    addToast('Snoozed until tomorrow 8:00 AM');
  };

  // Batch actions
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(emails.map((e) => e.id));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBatchArchive = async () => {
    const ids = [...selectedIds];
    await emailApi.batchArchive(ids);
    setEmails((prev) => prev.filter((e) => !ids.includes(e.id)));
    setSelectedIds([]);
    refreshMeta();
    addToast(`${ids.length} conversations archived`, 'Undo', async () => {
      for (const id of ids) {
        await emailApi.moveToFolder(id, 'inbox');
      }
      loadEmails();
      refreshMeta();
    });
  };

  const handleBatchDelete = async () => {
    const ids = [...selectedIds];
    await emailApi.batchDelete(ids);
    setEmails((prev) => prev.filter((e) => !ids.includes(e.id)));
    setSelectedIds([]);
    refreshMeta();
    addToast(`${ids.length} conversations moved to Trash`, 'Undo', async () => {
      for (const id of ids) {
        await emailApi.moveToFolder(id, 'inbox');
      }
      loadEmails();
      refreshMeta();
    });
  };

  const handleBatchMarkRead = async () => {
    const ids = [...selectedIds];
    await emailApi.batchMarkAsRead(ids, true);
    setEmails((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, read: true } : e))
    );
    setSelectedIds([]);
    refreshMeta();
    addToast(`${ids.length} marked as read`);
  };

  // Send Email Handler
  const handleSendEmail = async (payload: {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    attachments: Attachment[];
    scheduledTime?: string;
  }) => {
    if (payload.scheduledTime) {
      addToast(`Email scheduled for ${payload.scheduledTime}`);
      return;
    }

    await emailApi.sendEmail({
      to: payload.to,
      cc: payload.cc,
      bcc: payload.bcc,
      subject: payload.subject,
      body: payload.body,
      attachments: payload.attachments
    });

    addToast('Message sent', 'Undo', async () => {
      addToast('Sending undone. Saved to Drafts.');
    });

    refreshMeta();
    if (activeFolder === 'sent') {
      loadEmails();
    }
  };

  // Reply handlers
  const handleOpenReply = (type: 'reply' | 'reply-all' | 'forward', targetEmail: EmailMessage) => {
    const draft: ComposeDraft = {
      to: type === 'forward' ? [] : [targetEmail.senderEmail],
      cc: type === 'reply-all' ? targetEmail.recipients.filter((r) => r !== currentAccount.email) : [],
      bcc: [],
      subject: type === 'forward' ? `Fwd: ${targetEmail.subject}` : `Re: ${targetEmail.subject}`,
      body: `\n\n--- On ${targetEmail.dateFormatted}, ${targetEmail.sender} wrote:\n> ${targetEmail.body}`,
      attachments: type === 'forward' ? [...targetEmail.attachments] : []
    };
    setComposeDraft(draft);
    setIsComposeOpen(true);
  };

  const handleSendQuickReply = async (replyText: string) => {
    if (!selectedEmail) return;
    await emailApi.replyToEmail(selectedEmail.id, replyText);
    const updatedThread = await emailApi.getThread(selectedEmail.threadId);
    setThreadMessages(updatedThread);
    addToast('Quick reply sent');
  };

  // Reset to Factory Default
  const handleResetData = () => {
    emailApi.resetData();
    setEmails(emailApi.getEmailsSync());
    refreshMeta();
    addToast('Mock inbox reset to factory state');
  };

  return (
    <div
      id="mailflow-root"
      className="min-h-screen bg-[#111318] text-[#e2e2e6] flex flex-col font-sans selection:bg-[#8ab4f8] selection:text-[#111318]"
    >
      {/* PWA Install Banner when prompt is available */}
      {isInstallable && (
        <div
          id="pwa-install-banner"
          className="bg-gradient-to-r from-blue-900 to-indigo-900 px-4 py-2 flex items-center justify-between text-xs text-white z-40 border-b border-white/10"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">Install MailFlow App</span>
            <span className="text-white/80 hidden sm:inline">
              — Experience fast native offline email on your device
            </span>
          </div>
          <button
            onClick={install}
            className="px-3 py-1 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition"
          >
            Install
          </button>
        </div>
      )}

      {/* Main App Layout */}
      <div className="flex-1 flex w-full overflow-hidden">
        {/* Navigation Drawer (Sidebar) */}
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeFolder={activeFolder}
          activeLabel={activeLabel}
          onSelectFolder={(folder) => {
            setActiveFolder(folder);
            setActiveLabel(undefined);
            setSelectedEmail(null);
            setActiveBottomTab('mail');
          }}
          onSelectLabel={(lbl) => {
            setActiveLabel(lbl);
            setSelectedEmail(null);
            setActiveBottomTab('mail');
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAiAssistant={() => {
            setAiAssistantTask('summarize-email');
            setIsAiAssistantOpen(true);
          }}
          counts={folderCounts}
          customLabels={customLabels}
          onAddLabel={async (label) => {
            await emailApi.addCustomLabel(label);
            refreshMeta();
          }}
          currentAccount={currentAccount}
        />

        {/* Center Main Stage */}
        <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
          {/* Top Bar with Material 3 Search, AI Sparkle, Avatar */}
          <TopBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onOpenDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
            onOpenAccountSwitcher={() => setIsAccountSwitcherOpen(true)}
            onOpenAiAssistant={() => {
              setAiAssistantTask('summarize-email');
              setIsAiAssistantOpen(true);
            }}
            onOpenSearchFilter={() => setIsSearchFilterOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            currentAccount={currentAccount}
            hasActiveFilters={
              searchFilters.hasAttachment ||
              searchFilters.unreadOnly ||
              searchFilters.starredOnly ||
              Boolean(searchFilters.from) ||
              Boolean(searchFilters.to)
            }
          />

          {/* Body View Switcher: Mail vs Chat vs Meet */}
          <main className="flex-1 flex overflow-hidden">
            {activeBottomTab === 'mail' || activeBottomTab === 'starred' ? (
              <>
                {/* Responsive Split Pane: On Desktop, show List AND Reader side-by-side! On Mobile/Tablet, toggle */}
                <div
                  className={`h-full flex-col ${
                    selectedEmail ? 'hidden lg:flex lg:w-[420px] xl:w-[480px] border-r border-white/5' : 'flex flex-1'
                  }`}
                >
                  <InboxList
                    emails={emails}
                    activeFolder={activeFolder}
                    activeLabel={activeLabel}
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                    selectedIds={selectedIds}
                    onSelectToggle={handleSelectToggle}
                    onSelectAll={handleSelectAll}
                    onClearSelection={handleClearSelection}
                    onEmailClick={(email) => setSelectedEmail(email)}
                    onStarToggle={handleStarToggle}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                    onToggleRead={handleToggleRead}
                    onSnooze={handleSnooze}
                    onBatchArchive={handleBatchArchive}
                    onBatchDelete={handleBatchDelete}
                    onBatchMarkRead={handleBatchMarkRead}
                    onOpenCompose={() => {
                      setComposeDraft(null);
                      setIsComposeOpen(true);
                    }}
                    swipeRightAction={settings.swipeRightAction}
                    swipeLeftAction={settings.swipeLeftAction}
                    isLoading={isLoading}
                  />
                </div>

                {/* Email Reader Pane */}
                {selectedEmail ? (
                  <div className="flex-1 flex flex-col h-full min-w-0">
                    <EmailReader
                      email={selectedEmail}
                      threadMessages={threadMessages}
                      onBack={() => setSelectedEmail(null)}
                      onArchive={handleArchive}
                      onDelete={handleDelete}
                      onToggleRead={handleToggleRead}
                      onStarToggle={handleStarToggle}
                      onSnooze={handleSnooze}
                      onOpenReply={handleOpenReply}
                      onOpenAiAssistant={(task) => {
                        setAiAssistantTask((task as AiTaskType) || 'summarize-email');
                        setIsAiAssistantOpen(true);
                      }}
                      onSendQuickReply={handleSendQuickReply}
                    />
                  </div>
                ) : (
                  <div className="hidden lg:flex flex-1 items-center justify-center p-8 text-center text-[#90939d] bg-[#111318]">
                    <div className="max-w-sm space-y-2">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-[#8ab4f8]">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-[#e2e2e6]">Select a conversation</h3>
                      <p className="text-xs leading-relaxed">
                        Choose an email from the list on the left to read its full contents and reply.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <ChatMeetView
                view={activeBottomTab === 'chat' ? 'chat' : activeBottomTab === 'meet' ? 'meet' : 'more'}
                onOpenMail={() => setActiveBottomTab('mail')}
              />
            )}
          </main>

          {/* Mobile Bottom Navigation */}
          <BottomNav
            activeTab={activeBottomTab}
            onSelectTab={(tab) => {
              if (tab === 'compose') {
                setComposeDraft(null);
                setIsComposeOpen(true);
              } else if (tab === 'starred') {
                setActiveFolder('starred');
                setActiveBottomTab('starred');
                setSelectedEmail(null);
              } else if (tab === 'search') {
                document.getElementById('search-input-field')?.focus();
              } else {
                setActiveBottomTab(tab);
                setSelectedEmail(null);
              }
            }}
            unreadMailCount={folderCounts['inbox']}
            mode={settings.bottomNavMode}
          />
        </div>
      </div>

      {/* Compose Window / Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleSendEmail}
        onSaveDraft={async (draft) => {
          await emailApi.saveDraft(draft);
          refreshMeta();
        }}
        onOpenAiAssistant={(task, text) => {
          setAiAssistantTask((task as AiTaskType) || 'help-me-write');
          setAiDraftContext(text || '');
          setIsAiAssistantOpen(true);
        }}
        initialDraft={composeDraft}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        activeEmail={selectedEmail}
        draftText={aiDraftContext}
        initialTask={aiAssistantTask}
        onInsertText={(text) => {
          if (isComposeOpen) {
            setComposeDraft((prev) => ({
              to: prev?.to || [],
              cc: prev?.cc || [],
              bcc: prev?.bcc || [],
              subject: prev?.subject || '',
              body: prev?.body ? `${prev.body}\n\n${text}` : text,
              attachments: prev?.attachments || []
            }));
          } else if (selectedEmail) {
            handleOpenReply('reply', selectedEmail);
            setTimeout(() => {
              setComposeDraft((prev) => ({
                to: [selectedEmail.senderEmail],
                cc: [],
                bcc: [],
                subject: `Re: ${selectedEmail.subject}`,
                body: text,
                attachments: []
              }));
            }, 50);
          }
        }}
      />

      {/* Search Filters Overlay */}
      <SearchFilterOverlay
        isOpen={isSearchFilterOpen}
        onClose={() => setIsSearchFilterOpen(false)}
        filters={searchFilters}
        onApplyFilters={(f) => setSearchFilters(f)}
        onClearFilters={() =>
          setSearchFilters({
            hasAttachment: false,
            unreadOnly: false,
            starredOnly: false
          })
        }
      />

      {/* Account Switcher Modal */}
      <AccountSwitcher
        isOpen={isAccountSwitcherOpen}
        onClose={() => setIsAccountSwitcherOpen(false)}
        accounts={accounts}
        currentAccount={currentAccount}
        onSelectAccount={(acc) => {
          emailApi.setCurrentAccount(acc);
          setCurrentAccount(acc);
          loadEmails();
          refreshMeta();
          addToast(`Switched to ${acc.name}`);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={async (newSettings) => {
          const updated = await emailApi.updateSettings(newSettings);
          setSettings(updated);
        }}
        onResetData={handleResetData}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
