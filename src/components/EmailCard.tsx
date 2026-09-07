import React, { useState, useRef } from 'react';
import {
  Star,
  Archive,
  Trash2,
  Mail,
  MailOpen,
  Clock,
  Paperclip,
  Bookmark
} from 'lucide-react';
import { EmailMessage, SwipeActionType } from '../types';

interface EmailCardProps {
  email: EmailMessage;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
  onClick: (email: EmailMessage) => void;
  onStarToggle: (id: string, current: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleRead: (id: string, current: boolean) => void;
  onSnooze: (id: string) => void;
  swipeRightAction?: SwipeActionType;
  swipeLeftAction?: SwipeActionType;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  email,
  isSelected,
  onSelectToggle,
  onClick,
  onStarToggle,
  onArchive,
  onDelete,
  onToggleRead,
  onSnooze,
  swipeRightAction = 'archive',
  swipeLeftAction = 'delete'
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeActionTriggered, setSwipeActionTriggered] = useState<SwipeActionType | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHorizontalScroll = useRef<boolean | null>(null);

  const SWIPE_THRESHOLD = 85;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalScroll.current = null;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    if (isHorizontalScroll.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalScroll.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalScroll.current) {
      // Apply friction beyond threshold
      let adjusted = deltaX;
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        const excess = Math.abs(deltaX) - SWIPE_THRESHOLD;
        const sign = deltaX > 0 ? 1 : -1;
        adjusted = sign * (SWIPE_THRESHOLD + excess * 0.35);
      }
      setOffsetX(adjusted);
    }
  };

  const executeAction = (action: SwipeActionType) => {
    if (action === 'archive') onArchive(email.id);
    else if (action === 'delete') onDelete(email.id);
    else if (action === 'mark-read') onToggleRead(email.id, email.read);
    else if (action === 'star') onStarToggle(email.id, email.starred);
    else if (action === 'snooze') onSnooze(email.id);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (isHorizontalScroll.current) {
      if (offsetX > SWIPE_THRESHOLD) {
        const action = (swipeRightAction || 'archive') as SwipeActionType;
        setSwipeActionTriggered(action);
        setTimeout(() => {
          executeAction(action);
          setOffsetX(0);
          setSwipeActionTriggered(null);
        }, 150);
        return;
      } else if (offsetX < -SWIPE_THRESHOLD) {
        const action = (swipeLeftAction || 'delete') as SwipeActionType;
        setSwipeActionTriggered(action);
        setTimeout(() => {
          executeAction(action);
          setOffsetX(0);
          setSwipeActionTriggered(null);
        }, 150);
        return;
      }
    }
    setOffsetX(0);
    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalScroll.current = null;
  };

  // Action badge background color & icon
  const getActionInfo = (action: SwipeActionType) => {
    switch (action) {
      case 'archive':
        return { bg: 'bg-emerald-600', icon: Archive, label: 'Archive' };
      case 'delete':
        return { bg: 'bg-rose-600', icon: Trash2, label: 'Delete' };
      case 'mark-read':
        return { bg: 'bg-blue-600', icon: email.read ? Mail : MailOpen, label: email.read ? 'Unread' : 'Read' };
      case 'star':
        return { bg: 'bg-amber-500', icon: Star, label: 'Star' };
      case 'snooze':
        return { bg: 'bg-purple-600', icon: Clock, label: 'Snooze' };
      default:
        return { bg: 'bg-emerald-600', icon: Archive, label: 'Archive' };
    }
  };

  const rightActionInfo = getActionInfo((swipeRightAction || 'archive') as SwipeActionType);
  const leftActionInfo = getActionInfo((swipeLeftAction || 'delete') as SwipeActionType);

  return (
    <div
      id={`email-card-wrapper-${email.id}`}
      className="relative overflow-hidden group select-none border-b border-white/5 last:border-b-0"
    >
      {/* Swipe Action Backgrounds (Revealed upon dragging on mobile) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none"
      >
        {/* Swiping Right Action Indicator */}
        <div
          className={`flex items-center gap-2 text-white font-medium text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
            offsetX > 40 ? rightActionInfo.bg : 'bg-transparent'
          }`}
          style={{ opacity: Math.min(1, Math.max(0, offsetX / 60)) }}
        >
          <rightActionInfo.icon className="w-4 h-4" />
          <span>{rightActionInfo.label}</span>
        </div>

        {/* Swiping Left Action Indicator */}
        <div
          className={`flex items-center gap-2 text-white font-medium text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
            offsetX < -40 ? leftActionInfo.bg : 'bg-transparent'
          }`}
          style={{ opacity: Math.min(1, Math.max(0, -offsetX / 60)) }}
        >
          <span>{leftActionInfo.label}</span>
          <leftActionInfo.icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Card Surface */}
      <div
        id={`email-card-${email.id}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (Math.abs(offsetX) < 5) {
            onClick(email);
          }
        }}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1)'
        }}
        className={`relative z-10 flex items-start gap-3.5 px-3.5 py-3 sm:px-4 sm:py-3.5 cursor-pointer transition-colors duration-150 ${
          email.read
            ? 'bg-[#121316] hover:bg-[#1a1c22]'
            : 'bg-[#171920] hover:bg-[#20232c]'
        } ${isSelected ? 'bg-[#212636]! border-l-4 border-[#8ab4f8]' : ''}`}
      >
        {/* Left: Avatar with selection toggle option */}
        <div
          className="relative flex-shrink-0 mt-0.5"
          onClick={(e) => {
            e.stopPropagation();
            onSelectToggle(email.id);
          }}
        >
          {email.avatar ? (
            <img
              src={email.avatar}
              alt={email.sender}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {email.sender.slice(0, 1).toUpperCase()}
            </div>
          )}

          {/* Selection indicator overlay */}
          {isSelected && (
            <div className="absolute inset-0 rounded-full bg-[#8ab4f8] flex items-center justify-center text-[#111318] animate-in zoom-in-75 duration-150">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Center: Sender, Subject, Preview */}
        <div className="flex-1 min-w-0 pr-2">
          {/* Header Row: Sender + Labels */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className={`text-sm sm:text-base truncate ${
                email.read ? 'text-[#c4c6cf] font-medium' : 'text-[#f1f3f8] font-bold'
              }`}
            >
              {email.sender}
            </span>

            {/* Right: Date/Time */}
            <span
              className={`text-xs whitespace-nowrap flex-shrink-0 ${
                email.read ? 'text-[#8e919a]' : 'text-[#8ab4f8] font-semibold'
              }`}
            >
              {email.dateFormatted}
            </span>
          </div>

          {/* Subject Line */}
          <div className="flex items-center gap-2 mb-0.5">
            {email.important && (
              <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
            )}
            <p
              className={`text-xs sm:text-sm truncate ${
                email.read ? 'text-[#a4a7b2]' : 'text-[#e2e2e6] font-semibold'
              }`}
            >
              {email.subject}
            </p>
          </div>

          {/* Preview / Snippet */}
          <p className="text-xs text-[#7e828e] truncate font-normal leading-relaxed">
            {email.preview}
          </p>

          {/* Attachment chip indicator */}
          {email.hasAttachment && email.attachments.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {email.attachments.map((att) => (
                <span
                  key={att.id}
                  className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-[#9da1ad] border border-white/5"
                >
                  <Paperclip className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[120px]">{att.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Star Icon & Unread Dot & Desktop Hover Bar */}
        <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0 py-0.5">
          {/* Unread indicator dot */}
          {!email.read ? (
            <span className="w-2 h-2 rounded-full bg-[#8ab4f8] shadow-sm shadow-blue-500/50 mb-auto" />
          ) : (
            <div className="w-2 h-2 mb-auto" />
          )}

          {/* Star toggle button */}
          <button
            id={`btn-star-${email.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onStarToggle(email.id, email.starred);
            }}
            aria-label={email.starred ? 'Unstar email' : 'Star email'}
            className="p-1 rounded-full text-[#8e919a] hover:text-amber-400 hover:bg-white/5 transition active:scale-90 mt-1"
          >
            <Star
              className={`w-4 h-4 ${
                email.starred
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-[#8e919a] hover:text-[#c4c6cf]'
              }`}
            />
          </button>
        </div>

        {/* Desktop Hover Quick Action Bar */}
        <div
          className="hidden md:group-hover:flex absolute right-4 top-1/2 -translate-y-1/2 items-center gap-1 bg-[#1e2129] px-2 py-1 rounded-full shadow-lg border border-white/10 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            id={`hover-archive-${email.id}`}
            onClick={() => onArchive(email.id)}
            title="Archive"
            className="p-1.5 rounded-full text-[#90939d] hover:text-white hover:bg-white/10 transition"
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            id={`hover-delete-${email.id}`}
            onClick={() => onDelete(email.id)}
            title="Delete"
            className="p-1.5 rounded-full text-[#90939d] hover:text-rose-400 hover:bg-white/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            id={`hover-read-${email.id}`}
            onClick={() => onToggleRead(email.id, email.read)}
            title={email.read ? 'Mark as unread' : 'Mark as read'}
            className="p-1.5 rounded-full text-[#90939d] hover:text-[#8ab4f8] hover:bg-white/10 transition"
          >
            {email.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
          </button>

          <button
            id={`hover-snooze-${email.id}`}
            onClick={() => onSnooze(email.id)}
            title="Snooze"
            className="p-1.5 rounded-full text-[#90939d] hover:text-purple-400 hover:bg-white/10 transition"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
