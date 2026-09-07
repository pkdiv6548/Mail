import React, { useState } from 'react';
import {
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  Trash2,
  AlertOctagon,
  Mail,
  Tag,
  Plus,
  Settings,
  HardDrive,
  ShoppingBag,
  Calendar,
  Layers,
  ChevronRight,
  X,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { FolderId, UserAccount } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFolder: FolderId;
  activeLabel?: string;
  onSelectFolder: (folder: FolderId) => void;
  onSelectLabel: (label: string) => void;
  onOpenSettings: () => void;
  onOpenAiAssistant: () => void;
  counts: Record<string, number>;
  customLabels: string[];
  onAddLabel: (label: string) => void;
  currentAccount: UserAccount;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeFolder,
  activeLabel,
  onSelectFolder,
  onSelectLabel,
  onOpenSettings,
  onOpenAiAssistant,
  counts,
  customLabels,
  onAddLabel,
  currentAccount
}) => {
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');

  const handleCreateLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabelName.trim()) {
      onAddLabel(newLabelName.trim());
      setNewLabelName('');
      setIsAddingLabel(false);
    }
  };

  const formatCount = (count?: number) => {
    if (!count) return null;
    if (count > 99) return '99+';
    return count.toString();
  };

  const mainNavItems: Array<{
    id: FolderId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    countKey?: string;
    highlight?: boolean;
  }> = [
    { id: 'all-inboxes', label: 'All inboxes', icon: Layers },
    { id: 'inbox', label: 'Inbox', icon: Inbox, countKey: 'inbox', highlight: true },
    { id: 'unread', label: 'Unread', icon: Mail, countKey: 'unread' }
  ];

  const standardLabels: Array<{
    id: FolderId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    countKey?: string;
  }> = [
    { id: 'starred', label: 'Starred', icon: Star, countKey: 'starred' },
    { id: 'snoozed', label: 'Snoozed', icon: Clock },
    { id: 'important', label: 'Important', icon: Bookmark, countKey: 'important' },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag, countKey: 'purchases' },
    { id: 'sent', label: 'Sent', icon: Send, countKey: 'sent' },
    { id: 'scheduled', label: 'Scheduled', icon: Calendar },
    { id: 'outbox', label: 'Outbox', icon: ChevronRight },
    { id: 'drafts', label: 'Drafts', icon: FileText, countKey: 'drafts' },
    { id: 'all-mail', label: 'All Mail', icon: Mail, countKey: 'allMail' },
    { id: 'spam', label: 'Spam', icon: AlertOctagon, countKey: 'spam' },
    { id: 'trash', label: 'Trash', icon: Trash2, countKey: 'trash' }
  ];

  return (
    <>
      {/* Backdrop for Mobile */}
      <div
        id="drawer-backdrop"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/65 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer Container (Slide-in on mobile, permanent/collapsible on desktop) */}
      <aside
        id="navigation-drawer"
        aria-label="Sidebar Navigation"
        className={`fixed md:sticky top-0 left-0 z-40 h-full w-[280px] sm:w-[300px] flex-shrink-0 bg-[#16181e] text-[#e2e2e6] border-r border-white/5 flex flex-col transition-transform duration-300 ease-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                MailFlow
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  M3
                </span>
              </span>
              <span className="text-[11px] text-[#90939d] truncate max-w-[150px]">
                {currentAccount.email}
              </span>
            </div>
          </div>
          <button
            id="btn-close-drawer"
            onClick={onClose}
            aria-label="Close navigation"
            className="md:hidden p-1.5 rounded-full text-[#90939d] hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-sm select-none">
          {/* Main Folders */}
          <div className="space-y-0.5 mb-3">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeFolder === item.id && !activeLabel;
              const count = item.countKey ? formatCount(counts[item.countKey]) : null;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    onSelectFolder(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-[#2b354d] text-[#8ab4f8] font-semibold'
                      : 'text-[#c4c6cf] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#8ab4f8]' : 'text-[#90939d]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {count && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isSelected
                          ? 'bg-[#8ab4f8] text-[#111318]'
                          : 'bg-white/10 text-[#c4c6cf]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-white/5 mx-2 my-2" />

          {/* AI Quick Sparkle Action */}
          <button
            id="nav-ai-assistant"
            onClick={() => {
              onOpenAiAssistant();
              onClose();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium text-cyan-300 hover:bg-cyan-500/10 transition group mb-2"
          >
            <div className="flex items-center gap-3.5">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>AI Email Assistant</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
              Smart
            </span>
          </button>

          {/* All Labels Header */}
          <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#8e919a]">
            All Labels
          </div>

          {/* Standard Labels */}
          <div className="space-y-0.5">
            {standardLabels.map((item) => {
              const Icon = item.icon;
              const isSelected = activeFolder === item.id && !activeLabel;
              const count = item.countKey ? formatCount(counts[item.countKey]) : null;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    onSelectFolder(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-[#2b354d] text-[#8ab4f8] font-semibold'
                      : 'text-[#c4c6cf] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#8ab4f8]' : 'text-[#8e919a]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {count && (
                    <span className="text-xs text-[#90939d] font-normal">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-white/5 mx-2 my-2" />

          {/* Custom Labels Section */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8e919a]">
              Custom Labels
            </span>
            <button
              id="btn-toggle-add-label"
              onClick={() => setIsAddingLabel(!isAddingLabel)}
              aria-label="Add custom label"
              className="p-1 text-[#8e919a] hover:text-white rounded hover:bg-white/10 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inline Add Label Form */}
          {isAddingLabel && (
            <form onSubmit={handleCreateLabel} className="px-2 py-1 mb-2">
              <div className="flex items-center gap-1 bg-[#202229] rounded-lg p-1 border border-white/10">
                <input
                  id="input-new-label-name"
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Label name..."
                  autoFocus
                  className="w-full bg-transparent px-2 py-1 text-xs text-white placeholder-[#8e919a] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-[#8ab4f8] text-[#111318] text-xs font-bold rounded hover:bg-[#adc8ff] transition"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Custom Labels List */}
          <div className="space-y-0.5">
            {customLabels.map((lbl) => {
              const isSelected = activeLabel === lbl;
              return (
                <button
                  key={lbl}
                  id={`nav-custom-label-${lbl.toLowerCase()}`}
                  onClick={() => {
                    onSelectLabel(lbl);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-[#2b354d] text-[#8ab4f8] font-semibold'
                      : 'text-[#c4c6cf] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Tag className={`w-4 h-4 ${isSelected ? 'text-[#8ab4f8]' : 'text-[#8e919a]'}`} />
                    <span>{lbl}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Settings & Storage Info */}
        <div className="p-3 border-t border-white/5 space-y-2 bg-[#14161b]">
          {/* Storage Meter */}
          <div className="px-3 py-1.5 rounded-lg bg-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#90939d]">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3 h-3" />
                Storage
              </span>
              <span>{currentAccount.storageUsed} of {currentAccount.storageLimit}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                style={{ width: `${currentAccount.storagePercentage}%` }}
              />
            </div>
          </div>

          <button
            id="btn-drawer-settings"
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#c4c6cf] hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <Settings className="w-4 h-4 text-[#8e919a]" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};
