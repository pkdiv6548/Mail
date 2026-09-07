import React, { useState } from 'react';
import {
  MessageSquare,
  Video,
  Plus,
  Search,
  Users,
  Calendar,
  Copy,
  Check,
  PhoneCall,
  Sparkles
} from 'lucide-react';

interface ChatMeetViewProps {
  view: 'chat' | 'meet' | 'more';
  onStartMeeting?: () => void;
  onOpenMail: () => void;
}

export const ChatMeetView: React.FC<ChatMeetViewProps> = ({
  view,
  onOpenMail
}) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'spaces'>('messages');
  const [meetingCode, setMeetingCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeCall, setActiveCall] = useState(false);

  const mockConversations = [
    {
      id: 'c1',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'Awesome! Did you review the mobile designs?',
      time: '11:42 AM',
      unread: 1,
      online: true
    },
    {
      id: 'c2',
      name: 'Design Systems Core',
      avatar: '',
      isSpace: true,
      lastMessage: 'Sarah: Token exports are ready in Figma',
      time: '9:15 AM',
      unread: 3,
      online: false
    },
    {
      id: 'c3',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'Let us sync before the all-hands.',
      time: 'Yesterday',
      unread: 0,
      online: false
    }
  ];

  if (view === 'chat') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#111318] text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight">MailFlow Chat</h2>
          <button className="p-2 rounded-full bg-[#2b354d] text-[#8ab4f8]">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
              activeTab === 'messages' ? 'bg-[#2b354d] text-[#8ab4f8]' : 'bg-[#1a1c22] text-[#90939d]'
            }`}
          >
            Direct messages
          </button>
          <button
            onClick={() => setActiveTab('spaces')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
              activeTab === 'spaces' ? 'bg-[#2b354d] text-[#8ab4f8]' : 'bg-[#1a1c22] text-[#90939d]'
            }`}
          >
            Spaces
          </button>
        </div>

        {/* Chat conversations */}
        <div className="space-y-1">
          {mockConversations.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#1a1c22] cursor-pointer transition"
            >
              <div className="relative">
                {c.avatar ? (
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-11 h-11 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#282d3c] flex items-center justify-center text-[#8ab4f8]">
                    <Users className="w-5 h-5" />
                  </div>
                )}
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#111318]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white truncate">{c.name}</span>
                  <span className="text-xs text-[#8e919a]">{c.time}</span>
                </div>
                <p className="text-xs text-[#90939d] truncate mt-0.5">{c.lastMessage}</p>
              </div>

              {c.unread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#8ab4f8] text-[#111318] text-[11px] font-bold">
                  {c.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'meet') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#111318] text-white p-4 max-w-md mx-auto w-full">
        <h2 className="text-xl font-bold tracking-tight mb-4">MailFlow Meet</h2>

        {activeCall ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center p-6 bg-[#16181f] rounded-3xl border border-white/5">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
              <Video className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-bold">Meeting in Progress</h3>
            <p className="text-xs text-[#90939d]">Meeting code: flow-sync-921</p>
            <button
              onClick={() => setActiveCall(false)}
              className="px-6 py-2.5 bg-rose-600 text-white rounded-full font-bold text-sm hover:bg-rose-500 transition"
            >
              Leave Call
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveCall(true)}
                className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#202430] border border-white/5 hover:border-[#8ab4f8] transition text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-[#8ab4f8] flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white">New Meeting</span>
                <span className="text-[10px] text-[#8e919a]">Instant link</span>
              </button>

              <button
                onClick={() => {
                  const code = prompt('Enter meeting code:');
                  if (code) setActiveCall(true);
                }}
                className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#202430] border border-white/5 hover:border-[#8ab4f8] transition text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white">Join with Code</span>
                <span className="text-[10px] text-[#8e919a]">Enter meeting ID</span>
              </button>
            </div>

            {/* Upcoming video meetings */}
            <div className="p-4 rounded-2xl bg-[#16181f] border border-white/5 space-y-3">
              <span className="text-xs font-semibold text-[#8e919a] uppercase tracking-wider block">
                Scheduled for today
              </span>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#8ab4f8]" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Design Sprint Retro</h4>
                    <span className="text-[11px] text-[#8e919a]">2:00 PM – 2:45 PM</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCall(true)}
                  className="px-3 py-1 bg-[#8ab4f8] text-[#111318] text-xs font-bold rounded-lg"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
      <Sparkles className="w-10 h-10 text-[#8ab4f8]" />
      <h3 className="text-lg font-bold">MailFlow Suite</h3>
      <p className="text-xs text-[#90939d] max-w-xs">
        Access all connected productivity tools: Drive, Contacts, Calendar, and MailFlow AI.
      </p>
      <button
        onClick={onOpenMail}
        className="px-4 py-2 rounded-xl bg-[#8ab4f8] text-[#111318] text-xs font-bold"
      >
        Return to Inbox
      </button>
    </div>
  );
};
