import React from 'react';
import {
  Inbox,
  Users,
  Tag,
  Info,
  MessageSquare,
  CheckSquare,
  Square,
  Archive,
  Trash2,
  MailOpen,
  Clock,
  Sparkles,
  Edit3
} from 'lucide-react';
import { EmailMessage, InboxCategory, FolderId, SwipeActionType } from '../types';
import { EmailCard } from './EmailCard';

interface InboxListProps {
  emails: EmailMessage[];
  activeFolder: FolderId;
  activeLabel?: string;
  activeCategory: InboxCategory;
  onSelectCategory: (cat: InboxCategory) => void;
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onEmailClick: (email: EmailMessage) => void;
  onStarToggle: (id: string, current: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleRead: (id: string, current: boolean) => void;
  onSnooze: (id: string) => void;
  onBatchArchive: () => void;
  onBatchDelete: () => void;
  onBatchMarkRead: () => void;
  onOpenCompose: () => void;
  swipeRightAction: SwipeActionType;
  swipeLeftAction: SwipeActionType;
  isLoading?: boolean;
}

export const InboxList: React.FC<InboxListProps> = ({
  emails,
  activeFolder,
  activeLabel,
  activeCategory,
  onSelectCategory,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onClearSelection,
  onEmailClick,
  onStarToggle,
  onArchive,
  onDelete,
  onToggleRead,
  onSnooze,
  onBatchArchive,
  onBatchDelete,
  onBatchMarkRead,
  onOpenCompose,
  swipeRightAction,
  swipeLeftAction,
  isLoading
}) => {
  const categories: Array<{ id: InboxCategory; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'primary', label: 'Primary', icon: Inbox },
    { id: 'promotions', label: 'Promotions', icon: Tag },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'updates', label: 'Updates', icon: Info },
    { id: 'forums', label: 'Forums', icon: MessageSquare }
  ];

  const getFolderTitle = () => {
    if (activeLabel) return activeLabel;
    switch (activeFolder) {
      case 'inbox': return 'Inbox';
      case 'all-inboxes': return 'All Inboxes';
      case 'unread': return 'Unread';
      case 'starred': return 'Starred';
      case 'snoozed': return 'Snoozed';
      case 'important': return 'Important';
      case 'purchases': return 'Purchases';
      case 'sent': return 'Sent';
      case 'scheduled': return 'Scheduled';
      case 'outbox': return 'Outbox';
      case 'drafts': return 'Drafts';
      case 'all-mail': return 'All Mail';
      case 'spam': return 'Spam';
      case 'trash': return 'Trash';
      default: return 'Inbox';
    }
  };

  const isAllSelected = emails.length > 0 && selectedIds.length === emails.length;

  return (
    <div id="inbox-list-container" className="flex-1 flex flex-col h-full overflow-hidden bg-[#111318]">
      {/* Selection Action Bar (when emails are checked) OR Heading & Categories */}
      {selectedIds.length > 0 ? (
        <div
          id="bulk-selection-bar"
          className="flex items-center justify-between px-4 py-2.5 bg-[#202430] border-b border-white/10 text-white animate-in fade-in duration-150"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={isAllSelected ? onClearSelection : onSelectAll}
              className="p-1 rounded text-[#8ab4f8] hover:bg-white/10 transition"
              aria-label="Toggle all selection"
            >
              {isAllSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </button>
            <span className="text-sm font-semibold">{selectedIds.length} selected</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onBatchArchive}
              title="Archive selected"
              className="p-2 rounded-full hover:bg-white/10 text-[#c4c6cf] hover:text-white transition"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={onBatchDelete}
              title="Delete selected"
              className="p-2 rounded-full hover:bg-white/10 text-[#c4c6cf] hover:text-rose-400 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onBatchMarkRead}
              title="Mark selected as read"
              className="p-2 rounded-full hover:bg-white/10 text-[#c4c6cf] hover:text-[#8ab4f8] transition"
            >
              <MailOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 pt-3 pb-2">
          {/* Header Title */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold tracking-tight text-[#e2e2e6]">{getFolderTitle()}</h1>
            <span className="text-xs text-[#90939d]">{emails.length} conversations</span>
          </div>

          {/* Category Tabs (Primary, Promotions, Social, Updates, Forums) - only visible in Inbox */}
          {activeFolder === 'inbox' && !activeLabel && (
            <div
              id="inbox-categories-tabs"
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1"
            >
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    id={`category-tab-${cat.id}`}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#2b354d] text-[#8ab4f8] font-semibold border border-[#8ab4f8]/30 shadow-xs'
                        : 'bg-[#1a1c22] text-[#90939d] hover:bg-white/5 hover:text-[#c4c6cf] border border-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#8ab4f8]' : 'text-[#90939d]'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Email List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5 pb-24 md:pb-6">
        {isLoading ? (
          /* Skeleton Loader */
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : emails.length === 0 ? (
          /* Realistic Empty States */
          <div className="flex flex-col items-center justify-center h-64 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Inbox className="w-8 h-8 text-[#90939d]" />
            </div>
            <h3 className="text-base font-semibold text-[#e2e2e6] mb-1">No emails here</h3>
            <p className="text-xs text-[#90939d] max-w-xs leading-relaxed">
              Your {getFolderTitle().toLowerCase()} is clear. Enjoy the peace of an empty inbox or send a new message!
            </p>
          </div>
        ) : (
          emails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              isSelected={selectedIds.includes(email.id)}
              onSelectToggle={onSelectToggle}
              onClick={onEmailClick}
              onStarToggle={onStarToggle}
              onArchive={onArchive}
              onDelete={onDelete}
              onToggleRead={onToggleRead}
              onSnooze={onSnooze}
              swipeRightAction={swipeRightAction}
              swipeLeftAction={swipeLeftAction}
            />
          ))
        )}
      </div>

      {/* Mobile Floating Compose Button (Material 3 Style) */}
      <div className="md:hidden fixed bottom-20 right-4 z-20">
        <button
          id="btn-mobile-floating-compose"
          onClick={onOpenCompose}
          aria-label="Compose new email"
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#c2e7ff] text-[#001d35] font-semibold text-sm shadow-xl shadow-black/40 hover:bg-[#b2dcfa] active:scale-95 transition-all"
        >
          <Edit3 className="w-5 h-5 text-[#001d35]" />
          <span>Compose</span>
        </button>
      </div>
    </div>
  );
};
