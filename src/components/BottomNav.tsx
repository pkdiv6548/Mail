import React from 'react';
import { Mail, MessageSquare, Video, MoreHorizontal, Star, Edit3, Search } from 'lucide-react';

export type BottomNavTab = 'mail' | 'chat' | 'meet' | 'more' | 'starred' | 'compose' | 'search';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onSelectTab: (tab: BottomNavTab) => void;
  unreadMailCount?: number;
  unreadChatCount?: number;
  mode?: 'workspace' | 'mail-only';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadMailCount,
  unreadChatCount = 3,
  mode = 'workspace'
}) => {
  const workspaceTabs = [
    { id: 'mail' as BottomNavTab, label: 'Mail', icon: Mail, badge: unreadMailCount },
    { id: 'chat' as BottomNavTab, label: 'Chat', icon: MessageSquare, badge: unreadChatCount },
    { id: 'meet' as BottomNavTab, label: 'Meet', icon: Video },
    { id: 'more' as BottomNavTab, label: 'More', icon: MoreHorizontal }
  ];

  const mailOnlyTabs = [
    { id: 'mail' as BottomNavTab, label: 'Inbox', icon: Mail, badge: unreadMailCount },
    { id: 'starred' as BottomNavTab, label: 'Starred', icon: Star },
    { id: 'compose' as BottomNavTab, label: 'Compose', icon: Edit3 },
    { id: 'search' as BottomNavTab, label: 'Search', icon: Search },
    { id: 'more' as BottomNavTab, label: 'More', icon: MoreHorizontal }
  ];

  const tabs = mode === 'workspace' ? workspaceTabs : mailOnlyTabs;

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#16181e]/95 backdrop-blur-lg border-t border-white/5 pb-safe"
    >
      <div className="flex items-center justify-around px-2 py-1.5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`bottom-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 group focus:outline-none"
            >
              {/* Material 3 Active Pill Indicator */}
              <div
                className={`relative flex items-center justify-center px-5 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2b354d] text-[#8ab4f8] shadow-sm'
                    : 'text-[#90939d] hover:text-[#c4c6cf]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />

                {/* Badge */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#8ab4f8] text-[10px] font-bold text-[#111318]">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'text-[#8ab4f8] font-semibold' : 'text-[#90939d]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
