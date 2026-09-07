import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Monitor,
  MoveHorizontal,
  Mail,
  Shield,
  Sparkles,
  Keyboard,
  HardDrive,
  Sliders,
  Check
} from 'lucide-react';
import { AppSettings, SwipeActionType } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'appearance'
    | 'swipe'
    | 'inbox'
    | 'signature'
    | 'ai'
    | 'shortcuts'
    | 'privacy'
    | 'storage'
  >('appearance');

  const [signatureText, setSignatureText] = useState(settings.signature);
  const [autoReplyText, setAutoReplyText] = useState(settings.autoReplyText);

  if (!isOpen) return null;

  const tabs: Array<{ id: typeof activeTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'swipe', label: 'Swipe Actions', icon: MoveHorizontal },
    { id: 'inbox', label: 'Inbox Config', icon: Mail },
    { id: 'signature', label: 'Signature & Vacation', icon: Sliders },
    { id: 'ai', label: 'AI Features', icon: Sparkles },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'storage', label: 'Storage & Reset', icon: HardDrive }
  ];

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="settings-modal-dialog"
        className="bg-[#181a22] border border-white/10 rounded-3xl max-w-2xl w-full h-[580px] flex flex-col md:flex-row overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Settings Navigation Bar */}
        <aside className="w-full md:w-56 bg-[#13151b] p-3 border-r border-white/5 flex md:flex-col overflow-x-auto no-scrollbar flex-shrink-0 gap-1">
          <div className="hidden md:flex items-center justify-between px-3 py-2 mb-2">
            <h2 className="text-sm font-bold text-white tracking-wide">Settings</h2>
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#2b354d] text-[#8ab4f8] font-bold'
                    : 'text-[#90939d] hover:text-[#e2e2e6] hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Settings Content Area */}
        <div className="flex-1 flex flex-col h-full bg-[#181a22] min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <h3 className="text-sm font-bold text-white capitalize">{activeTab} Settings</h3>
            <button
              id="btn-close-settings"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#90939d] hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-[#c4c6cf]">
            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Theme</h4>
                  <p className="text-[#90939d] mb-3">
                    Choose how MailFlow looks to you. Select a dark theme for optimal OLED battery savings.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark' as const, label: 'Dark', icon: Moon },
                      { id: 'light' as const, label: 'Light', icon: Sun },
                      { id: 'system' as const, label: 'System', icon: Monitor }
                    ].map((t) => {
                      const Icon = t.icon;
                      const isChecked = settings.theme === t.id;

                      return (
                        <button
                          key={t.id}
                          id={`theme-select-${t.id}`}
                          onClick={() => onUpdateSettings({ theme: t.id })}
                          className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all ${
                            isChecked
                              ? 'bg-[#2b354d] border-[#8ab4f8] text-[#8ab4f8] font-bold shadow-md'
                              : 'bg-[#14151b] border-white/5 text-[#90939d] hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-sm font-bold text-white mb-1">Bottom Navigation Mode</h4>
                  <p className="text-[#90939d] mb-3">
                    Choose between Android Workspace tabs (Mail, Chat, Meet) or classic Email-focused tabs.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateSettings({ bottomNavMode: 'workspace' })}
                      className={`flex-1 p-3 rounded-xl border text-left ${
                        settings.bottomNavMode === 'workspace'
                          ? 'bg-[#2b354d] border-[#8ab4f8] text-white'
                          : 'bg-[#14151b] border-white/5 text-[#90939d]'
                      }`}
                    >
                      <span className="font-semibold block text-xs">Workspace Style</span>
                      <span className="text-[11px] text-[#8e919a]">Mail, Chat, Meet, More</span>
                    </button>
                    <button
                      onClick={() => onUpdateSettings({ bottomNavMode: 'mail-only' })}
                      className={`flex-1 p-3 rounded-xl border text-left ${
                        settings.bottomNavMode === 'mail-only'
                          ? 'bg-[#2b354d] border-[#8ab4f8] text-white'
                          : 'bg-[#14151b] border-white/5 text-[#90939d]'
                      }`}
                    >
                      <span className="font-semibold block text-xs">Email-Only Style</span>
                      <span className="text-[11px] text-[#8e919a]">Inbox, Starred, Compose, Search</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Swipe Actions */}
            {activeTab === 'swipe' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Mobile Swipe Actions</h4>
                  <p className="text-[#90939d] mb-3">
                    Configure gestures when swiping an email card to the left or right on mobile.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-white block mb-1.5">
                      Swipe Right Action
                    </label>
                    <select
                      value={settings.swipeRightAction}
                      onChange={(e) =>
                        onUpdateSettings({ swipeRightAction: e.target.value as SwipeActionType })
                      }
                      className="w-full bg-[#14151b] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#8ab4f8]"
                    >
                      <option value="archive">Archive conversation</option>
                      <option value="delete">Move to Trash</option>
                      <option value="star">Toggle Star</option>
                      <option value="mark-read">Mark as Read / Unread</option>
                      <option value="snooze">Snooze for 24h</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white block mb-1.5">
                      Swipe Left Action
                    </label>
                    <select
                      value={settings.swipeLeftAction}
                      onChange={(e) =>
                        onUpdateSettings({ swipeLeftAction: e.target.value as SwipeActionType })
                      }
                      className="w-full bg-[#14151b] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#8ab4f8]"
                    >
                      <option value="delete">Move to Trash</option>
                      <option value="archive">Archive conversation</option>
                      <option value="snooze">Snooze for 24h</option>
                      <option value="mark-read">Mark as Read / Unread</option>
                      <option value="star">Toggle Star</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Inbox Config */}
            {activeTab === 'inbox' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Inbox Sorting</h4>
                  <p className="text-[#90939d] mb-3">Choose the primary organization layout for your emails.</p>
                  <div className="space-y-2">
                    {[
                      { id: 'default' as const, label: 'Default (Tabs: Primary, Social, Promotions, Updates)' },
                      { id: 'important-first' as const, label: 'Important First' },
                      { id: 'unread-first' as const, label: 'Unread First' },
                      { id: 'starred-first' as const, label: 'Starred First' }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#14151b] border border-white/5 cursor-pointer hover:border-white/20 transition"
                      >
                        <input
                          type="radio"
                          name="inboxType"
                          checked={settings.inboxType === opt.id}
                          onChange={() => onUpdateSettings({ inboxType: opt.id })}
                          className="accent-[#8ab4f8] w-4 h-4"
                        />
                        <span className="text-white font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Signature & Vacation */}
            {activeTab === 'signature' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Email Signature</label>
                  <textarea
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    onBlur={() => onUpdateSettings({ signature: signatureText })}
                    rows={3}
                    className="w-full bg-[#14151b] border border-white/10 rounded-xl p-3 text-white placeholder-[#8e919a] focus:outline-none focus:border-[#8ab4f8]"
                    placeholder="Sent from MailFlow on Pixel"
                  />
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoReplyEnabled}
                      onChange={(e) => onUpdateSettings({ autoReplyEnabled: e.target.checked })}
                      className="accent-[#8ab4f8] w-4 h-4"
                    />
                    <span>Vacation Auto-Responder</span>
                  </label>
                  {settings.autoReplyEnabled && (
                    <textarea
                      value={autoReplyText}
                      onChange={(e) => setAutoReplyText(e.target.value)}
                      onBlur={() => onUpdateSettings({ autoReplyText })}
                      rows={3}
                      className="w-full bg-[#14151b] border border-white/10 rounded-xl p-3 text-white placeholder-[#8e919a] focus:outline-none focus:border-[#8ab4f8]"
                      placeholder="I am out of office until next week..."
                    />
                  )}
                </div>
              </div>
            )}

            {/* AI Features */}
            {activeTab === 'ai' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white mb-1">MailFlow AI Smart Features</h4>
                <p className="text-[#90939d]">
                  Enable automated thread summaries, suggested smart replies, and drafting tools powered by local intelligence or Google Gemini.
                </p>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#14151b] border border-white/5">
                  <div>
                    <span className="font-semibold text-white block">Smart Reply Chips</span>
                    <span className="text-[11px] text-[#8e919a]">Show 1-tap contextual reply pills in emails</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.aiSmartReplyEnabled}
                    onChange={(e) => onUpdateSettings({ aiSmartReplyEnabled: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </label>
              </div>
            )}

            {/* Keyboard Shortcuts */}
            {activeTab === 'shortcuts' && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white mb-1">Productivity Shortcuts</h4>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between p-2 rounded-lg bg-[#14151b]">
                    <span className="text-[#c4c6cf]">Compose new message</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">c</kbd>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#14151b]">
                    <span className="text-[#c4c6cf]">Search in emails</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">/</kbd>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#14151b]">
                    <span className="text-[#c4c6cf]">Archive selected</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">e</kbd>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#14151b]">
                    <span className="text-[#c4c6cf]">Delete to trash</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">#</kbd>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#14151b]">
                    <span className="text-[#c4c6cf]">Mark as read / unread</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">m</kbd>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#14151b]">
                    <span className="text-[#c4c6cf]">Star conversation</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">s</kbd>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white mb-1">Security & Privacy Controls</h4>
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#14151b] border border-white/5">
                  <div>
                    <span className="font-semibold text-white block">Ask before deleting</span>
                    <span className="text-[11px] text-[#8e919a]">Show confirmation prompt for bulk trash actions</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.confirmBeforeDelete}
                    onChange={(e) => onUpdateSettings({ confirmBeforeDelete: e.target.checked })}
                    className="accent-[#8ab4f8] w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#14151b] border border-white/5">
                  <div>
                    <span className="font-semibold text-white block">Ask before sending</span>
                    <span className="text-[11px] text-[#8e919a]">Verify recipients on external messages</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.confirmBeforeSend}
                    onChange={(e) => onUpdateSettings({ confirmBeforeSend: e.target.checked })}
                    className="accent-[#8ab4f8] w-4 h-4"
                  />
                </label>
              </div>
            )}

            {/* Storage & Reset */}
            {activeTab === 'storage' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Local Mock Data & Cache</h4>
                  <p className="text-[#90939d] mb-3">
                    MailFlow stores cached emails in your browser's local storage for offline operation. You can reset to the original sample inbox at any time.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Reset all inbox data to factory defaults?')) {
                        onResetData();
                        onClose();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 font-semibold hover:bg-rose-600 hover:text-white transition"
                  >
                    Reset Inbox Data to Defaults
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
