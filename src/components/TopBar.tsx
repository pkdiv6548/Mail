import React, { useState } from 'react';
import { Menu, Search, Sparkles, X, SlidersHorizontal, Settings as SettingsIcon, HelpCircle, Grid } from 'lucide-react';
import { UserAccount } from '../types';

interface TopBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onOpenDrawer: () => void;
  onOpenAccountSwitcher: () => void;
  onOpenAiAssistant: () => void;
  onOpenSearchFilter: () => void;
  onOpenSettings: () => void;
  currentAccount: UserAccount;
  hasActiveFilters?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  query,
  onQueryChange,
  onOpenDrawer,
  onOpenAccountSwitcher,
  onOpenAiAssistant,
  onOpenSearchFilter,
  onOpenSettings,
  currentAccount,
  hasActiveFilters
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <header
      id="app-top-bar"
      className="sticky top-0 z-30 w-full px-3 py-2 sm:px-4 sm:py-2.5 transition-colors bg-[#111318]/90 dark:bg-[#111318]/90 backdrop-blur-md"
    >
      <div className="flex items-center gap-2 sm:gap-3 max-w-5xl mx-auto w-full">
        {/* Mobile Hamburger Menu / Desktop Sidebar Toggle */}
        <button
          id="btn-hamburger-menu"
          onClick={onOpenDrawer}
          aria-label="Toggle navigation menu"
          className="flex items-center justify-center w-10 h-10 rounded-full text-[#c4c6cf] hover:text-white hover:bg-white/10 active:scale-95 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Large Rounded Material 3 Search Bar */}
        <div
          id="search-bar-container"
          className={`flex-1 relative flex items-center h-12 rounded-full px-3.5 transition-all duration-200 border ${
            isFocused
              ? 'bg-[#292c34] border-[#8ab4f8]/50 shadow-lg shadow-black/30'
              : 'bg-[#1e2025] hover:bg-[#252830] border-white/5 shadow-sm'
          }`}
        >
          <div className="flex items-center text-[#90939d] mr-2.5 pointer-events-none">
            <Search className="w-4 h-4 text-[#8ab4f8]" />
          </div>

          <input
            id="search-input-field"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search in emails..."
            className="w-full bg-transparent text-sm sm:text-base text-[#e2e2e6] placeholder-[#8e919a] focus:outline-none"
          />

          {/* Clear Search Button */}
          {query && (
            <button
              id="btn-clear-search"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="p-1 text-[#90939d] hover:text-white rounded-full hover:bg-white/10 transition mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Filter Toggle */}
          <button
            id="btn-search-filter"
            onClick={onOpenSearchFilter}
            aria-label="Search filter options"
            className={`p-1.5 rounded-full transition mr-1 ${
              hasActiveFilters
                ? 'text-[#8ab4f8] bg-[#8ab4f8]/15'
                : 'text-[#90939d] hover:text-[#c4c6cf] hover:bg-white/10'
            }`}
            title="Filter search"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* AI Sparkle Action Button */}
          <button
            id="btn-ai-sparkle-topbar"
            onClick={onOpenAiAssistant}
            aria-label="Open AI email assistant"
            className="relative p-1.5 rounded-full text-[#67e8f9] hover:bg-cyan-500/15 active:scale-95 transition group"
            title="MailFlow AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-[#67e8f9] group-hover:rotate-12 transition-transform duration-300" />
            <span className="sr-only">AI Assistant</span>
          </button>
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden md:flex items-center gap-1">
          <button
            id="btn-topbar-settings"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#90939d] hover:text-[#e2e2e6] hover:bg-white/10 transition"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Avatar with Account Switcher Trigger */}
        <button
          id="btn-profile-avatar"
          onClick={onOpenAccountSwitcher}
          aria-label={`Current account: ${currentAccount.name}. Click to switch accounts`}
          className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-[#8ab4f8] transition active:scale-95 overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#8ab4f8]"
        >
          <img
            src={currentAccount.avatar}
            alt={currentAccount.name}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#111318]" />
        </button>
      </div>
    </header>
  );
};
