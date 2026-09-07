import React, { useState } from 'react';
import {
  ArrowLeft,
  Archive,
  Trash2,
  Mail,
  MoreVertical,
  Star,
  Reply,
  ReplyAll,
  Forward,
  Paperclip,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  Lock,
  Clock,
  Printer
} from 'lucide-react';
import { EmailMessage, Attachment } from '../types';

interface EmailReaderProps {
  email: EmailMessage;
  threadMessages: EmailMessage[];
  onBack: () => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleRead: (id: string, current: boolean) => void;
  onStarToggle: (id: string, current: boolean) => void;
  onSnooze: (id: string) => void;
  onOpenReply: (type: 'reply' | 'reply-all' | 'forward', targetEmail: EmailMessage) => void;
  onOpenAiAssistant: (task?: string) => void;
  onSendQuickReply: (text: string) => void;
}

export const EmailReader: React.FC<EmailReaderProps> = ({
  email,
  threadMessages,
  onBack,
  onArchive,
  onDelete,
  onToggleRead,
  onStarToggle,
  onSnooze,
  onOpenReply,
  onOpenAiAssistant,
  onSendQuickReply
}) => {
  const [showSenderDetails, setShowSenderDetails] = useState(false);
  const [expandedThreadIds, setExpandedThreadIds] = useState<Record<string, boolean>>({
    [email.id]: true
  });
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [quickReplyText, setQuickReplyText] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Group thread messages or fallback to single email
  const messages = threadMessages.length > 0 ? threadMessages : [email];

  const toggleThreadMessage = (id: string) => {
    setExpandedThreadIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleQuickReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickReplyText.trim()) {
      onSendQuickReply(quickReplyText.trim());
      setQuickReplyText('');
    }
  };

  return (
    <div
      id="email-reader-view"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#111318] text-[#e2e2e6]"
    >
      {/* Top Action App Bar */}
      <header className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 border-b border-white/5 bg-[#16181e]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            id="btn-reader-back"
            onClick={onBack}
            aria-label="Back to inbox"
            className="p-2 rounded-full text-[#c4c6cf] hover:text-white hover:bg-white/10 active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="hidden sm:inline text-xs font-semibold text-[#8e919a] uppercase tracking-wider">
            Back to mail
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            id="btn-reader-archive"
            onClick={() => onArchive(email.id)}
            aria-label="Archive email"
            title="Archive"
            className="p-2 rounded-full text-[#c4c6cf] hover:text-white hover:bg-white/10 transition"
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            id="btn-reader-delete"
            onClick={() => onDelete(email.id)}
            aria-label="Delete email"
            title="Delete"
            className="p-2 rounded-full text-[#c4c6cf] hover:text-rose-400 hover:bg-white/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            id="btn-reader-toggle-read"
            onClick={() => onToggleRead(email.id, email.read)}
            aria-label="Mark as unread"
            title="Mark as unread"
            className="p-2 rounded-full text-[#c4c6cf] hover:text-[#8ab4f8] hover:bg-white/10 transition"
          >
            <Mail className="w-4 h-4" />
          </button>

          <button
            id="btn-reader-snooze"
            onClick={() => onSnooze(email.id)}
            aria-label="Snooze email"
            title="Snooze"
            className="p-2 rounded-full text-[#c4c6cf] hover:text-purple-400 hover:bg-white/10 transition"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* More actions dropdown */}
          <div className="relative">
            <button
              id="btn-reader-more"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              aria-label="More options"
              className="p-2 rounded-full text-[#c4c6cf] hover:text-white hover:bg-white/10 transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div
                id="reader-more-dropdown"
                className="absolute right-0 top-10 w-44 bg-[#20232b] rounded-xl shadow-2xl border border-white/10 py-1.5 z-40 text-sm animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  onClick={() => {
                    window.print();
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 text-[#c4c6cf] hover:text-white text-left"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print message</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAiAssistant('summarize-email');
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 text-cyan-300 text-left"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Summarize with AI</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Email Reading Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto w-full space-y-4">
        {/* Subject Header with Labels */}
        <div className="border-b border-white/5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#f1f3f8] leading-snug">
              {email.subject}
            </h1>
            <button
              id="btn-reader-star"
              onClick={() => onStarToggle(email.id, email.starred)}
              aria-label={email.starred ? 'Unstar message' : 'Star message'}
              className="p-1.5 rounded-full hover:bg-white/5 transition"
            >
              <Star
                className={`w-5 h-5 ${
                  email.starred ? 'fill-amber-400 text-amber-400' : 'text-[#8e919a]'
                }`}
              />
            </button>
          </div>

          {/* Category & Custom Labels */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#252832] text-[#8ab4f8] border border-white/5">
              {email.category}
            </span>
            {email.labels.map((lbl) => (
              <span
                key={lbl}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-[#c4c6cf] border border-white/5"
              >
                {lbl}
              </span>
            ))}
            {messages.length > 1 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {messages.length} messages in conversation
              </span>
            )}
          </div>

          {/* AI Quick Insight Action Chips */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar py-1">
            <button
              id="btn-ai-summarize-chip"
              onClick={() => onOpenAiAssistant('summarize-email')}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 hover:bg-cyan-500/20 active:scale-95 transition whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Summarize</span>
            </button>
            <button
              id="btn-ai-action-items-chip"
              onClick={() => onOpenAiAssistant('extract-action-items')}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-500/20 active:scale-95 transition whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Action items</span>
            </button>
            <button
              id="btn-ai-suggest-reply-chip"
              onClick={() => onOpenAiAssistant('suggest-reply')}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 active:scale-95 transition whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Suggest reply</span>
            </button>
            <button
              id="btn-ai-dates-chip"
              onClick={() => onOpenAiAssistant('extract-dates')}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 hover:bg-amber-500/20 active:scale-95 transition whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Extract dates</span>
            </button>
          </div>
        </div>

        {/* Conversation Thread Messages */}
        <div className="space-y-4">
          {messages.map((msg, index) => {
            const isLast = index === messages.length - 1;
            const isExpanded = expandedThreadIds[msg.id] ?? isLast;

            return (
              <div
                key={msg.id}
                id={`thread-message-${msg.id}`}
                className="rounded-2xl bg-[#171920] border border-white/5 overflow-hidden transition-all"
              >
                {/* Message Header */}
                <div
                  onClick={() => toggleThreadMessage(msg.id)}
                  className="flex items-start justify-between gap-3 p-3 sm:p-4 cursor-pointer hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {msg.avatar ? (
                      <img
                        src={msg.avatar}
                        alt={msg.sender}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {msg.sender.slice(0, 1)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold text-[#f1f3f8] truncate">
                          {msg.sender}
                        </span>
                        <span className="text-xs text-[#8e919a] truncate hidden sm:inline">
                          &lt;{msg.senderEmail}&gt;
                        </span>
                      </div>
                      <div className="text-xs text-[#8e919a] flex items-center gap-1">
                        <span>to {msg.recipients.join(', ')}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 text-xs text-[#8e919a]">
                    <span>{msg.dateFormatted}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReply('reply', msg);
                      }}
                      title="Reply"
                      className="p-1 rounded hover:bg-white/10 text-[#c4c6cf] hover:text-white"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Message Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1 space-y-4">
                    {/* Expandable security & details toggle */}
                    <div className="text-xs text-[#8e919a]">
                      <button
                        onClick={() => setShowSenderDetails(!showSenderDetails)}
                        className="flex items-center gap-1 hover:text-[#c4c6cf] transition"
                      >
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>Standard encryption (TLS)</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showSenderDetails ? 'rotate-180' : ''}`} />
                      </button>

                      {showSenderDetails && (
                        <div className="mt-2 p-3 rounded-lg bg-black/30 border border-white/5 space-y-1 font-mono text-[11px] text-[#a0a4b0]">
                          <div><strong className="text-white">From:</strong> {msg.sender} &lt;{msg.senderEmail}&gt;</div>
                          <div><strong className="text-white">To:</strong> {msg.recipients.join(', ')}</div>
                          <div><strong className="text-white">Date:</strong> {new Date(msg.timestamp).toLocaleString()}</div>
                          <div><strong className="text-white">Security:</strong> Standard TLS Encryption, Signed by verified domain</div>
                        </div>
                      )}
                    </div>

                    {/* Body Text */}
                    <div className="text-sm sm:text-base text-[#d8dae2] leading-relaxed whitespace-pre-line font-normal">
                      {msg.body}
                    </div>

                    {/* Attachments Section */}
                    {msg.hasAttachment && msg.attachments.length > 0 && (
                      <div className="pt-3 border-t border-white/5">
                        <span className="text-xs font-semibold text-[#8e919a] uppercase tracking-wider mb-2 block">
                          {msg.attachments.length} Attachments
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.attachments.map((att) => (
                            <div
                              key={att.id}
                              id={`attachment-card-${att.id}`}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-[#20232b] border border-white/5 hover:border-white/20 transition group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-[#8ab4f8] flex items-center justify-center flex-shrink-0">
                                  <Paperclip className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#f1f3f8] truncate max-w-[170px]">
                                    {att.name}
                                  </p>
                                  <span className="text-[11px] text-[#8e919a]">{att.size}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                {att.type === 'image' && (
                                  <button
                                    onClick={() => setPreviewAttachment(att)}
                                    title="Preview Image"
                                    className="p-1.5 rounded-lg text-[#8e919a] hover:text-white hover:bg-white/10 transition"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                                <a
                                  href={att.url || '#'}
                                  download={att.name}
                                  title="Download"
                                  className="p-1.5 rounded-lg text-[#8e919a] hover:text-[#8ab4f8] hover:bg-white/10 transition"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons: Reply, Reply All, Forward */}
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          <button
            id="btn-action-reply"
            onClick={() => onOpenReply('reply', email)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#1e2027] hover:bg-white/10 text-sm font-medium text-[#e2e2e6] hover:text-white transition active:scale-95"
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>

          <button
            id="btn-action-reply-all"
            onClick={() => onOpenReply('reply-all', email)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#1e2027] hover:bg-white/10 text-sm font-medium text-[#e2e2e6] hover:text-white transition active:scale-95"
          >
            <ReplyAll className="w-4 h-4" />
            <span>Reply all</span>
          </button>

          <button
            id="btn-action-forward"
            onClick={() => onOpenReply('forward', email)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#1e2027] hover:bg-white/10 text-sm font-medium text-[#e2e2e6] hover:text-white transition active:scale-95"
          >
            <Forward className="w-4 h-4" />
            <span>Forward</span>
          </button>
        </div>

        {/* Bottom Quick Reply Input */}
        <form onSubmit={handleQuickReplySubmit} className="pt-2 pb-8">
          <div className="flex items-center gap-2 bg-[#1e2129] border border-white/10 rounded-2xl p-2 focus-within:border-[#8ab4f8] transition">
            <input
              id="input-quick-reply"
              type="text"
              value={quickReplyText}
              onChange={(e) => setQuickReplyText(e.target.value)}
              placeholder={`Quick reply to ${email.sender.split(' ')[0]}...`}
              className="flex-1 bg-transparent px-3 py-1 text-sm text-white placeholder-[#8e919a] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!quickReplyText.trim()}
              aria-label="Send quick reply"
              className="p-2 rounded-xl bg-[#8ab4f8] text-[#111318] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#adc8ff] active:scale-95 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Attachment Image Preview Modal */}
      {previewAttachment && (
        <div
          id="modal-attachment-preview"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreviewAttachment(null)}
        >
          <div
            className="bg-[#1e2027] p-4 rounded-2xl max-w-2xl w-full border border-white/10 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{previewAttachment.name}</span>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="text-[#90939d] hover:text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              <img
                src={previewAttachment.url}
                alt={previewAttachment.name}
                className="w-full h-auto object-contain max-h-[60vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
