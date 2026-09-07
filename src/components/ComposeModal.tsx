import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Minimize2,
  Maximize2,
  Send,
  Paperclip,
  Image as ImageIcon,
  Link as LinkIcon,
  Smile,
  Sparkles,
  Clock,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  ChevronDown
} from 'lucide-react';
import { Attachment, ComposeDraft } from '../types';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (payload: {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    attachments: Attachment[];
    scheduledTime?: string;
  }) => void;
  onSaveDraft: (draft: ComposeDraft) => void;
  onOpenAiAssistant: (task?: string, currentText?: string) => void;
  initialDraft?: ComposeDraft | null;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  onSend,
  onSaveDraft,
  onOpenAiAssistant,
  initialDraft
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [showScheduleSend, setShowScheduleSend] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);

  // Form Fields
  const [toInput, setToInput] = useState('');
  const [recipients, setRecipients] = useState<string[]>(initialDraft?.to || []);
  const [ccInput, setCcInput] = useState('');
  const [ccList, setCcList] = useState<string[]>(initialDraft?.cc || []);
  const [bccInput, setBccInput] = useState('');
  const [bccList, setBccList] = useState<string[]>(initialDraft?.bcc || []);
  const [subject, setSubject] = useState(initialDraft?.subject || '');
  const [body, setBody] = useState(initialDraft?.body || '');
  const [attachments, setAttachments] = useState<Attachment[]>(initialDraft?.attachments || []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync initial draft when passed
  useEffect(() => {
    if (initialDraft) {
      setRecipients(initialDraft.to || []);
      setCcList(initialDraft.cc || []);
      setBccList(initialDraft.bcc || []);
      setSubject(initialDraft.subject || '');
      setBody(initialDraft.body || '');
      setAttachments(initialDraft.attachments || []);
    }
  }, [initialDraft]);

  // Draft Autosave timer (every 12 seconds if content exists)
  useEffect(() => {
    if (!isOpen) return;
    if (recipients.length === 0 && !subject && !body) return;

    const timer = setTimeout(() => {
      onSaveDraft({
        to: recipients,
        cc: ccList,
        bcc: bccList,
        subject,
        body,
        attachments
      });
      setDraftSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 8000);

    return () => clearTimeout(timer);
  }, [recipients, ccList, bccList, subject, body, attachments, isOpen, onSaveDraft]);

  if (!isOpen) return null;

  const handleAddRecipient = (e: React.KeyboardEvent | React.FocusEvent, type: 'to' | 'cc' | 'bcc') => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',' && e.key !== ' ') return;
    e.preventDefault();

    if (type === 'to' && toInput.trim()) {
      if (!recipients.includes(toInput.trim())) {
        setRecipients([...recipients, toInput.trim()]);
      }
      setToInput('');
    } else if (type === 'cc' && ccInput.trim()) {
      if (!ccList.includes(ccInput.trim())) {
        setCcList([...ccList, ccInput.trim()]);
      }
      setCcInput('');
    } else if (type === 'bcc' && bccInput.trim()) {
      if (!bccList.includes(bccInput.trim())) {
        setBccList([...bccList, bccInput.trim()]);
      }
      setBccInput('');
    }
  };

  const removeRecipient = (email: string, type: 'to' | 'cc' | 'bcc') => {
    if (type === 'to') setRecipients(recipients.filter((r) => r !== email));
    if (type === 'cc') setCcList(ccList.filter((r) => r !== email));
    if (type === 'bcc') setBccList(bccList.filter((r) => r !== email));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt: Attachment = {
        id: 'att-' + Date.now(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.type.includes('image') ? 'image' : 'doc'
      };
      setAttachments([...attachments, newAtt]);
    }
  };

  const handleSend = (scheduledTime?: string) => {
    const finalRecipients = [...recipients];
    if (toInput.trim() && !finalRecipients.includes(toInput.trim())) {
      finalRecipients.push(toInput.trim());
    }

    if (finalRecipients.length === 0) {
      alert('Please specify at least one recipient in the To field.');
      return;
    }

    onSend({
      to: finalRecipients,
      cc: ccList,
      bcc: bccList,
      subject: subject.trim(),
      body: body.trim(),
      attachments,
      scheduledTime
    });

    onClose();
  };

  const handleClose = () => {
    if (recipients.length > 0 || subject.trim() || body.trim()) {
      // Prompt discard or save as draft
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <div
      id="compose-modal-container"
      className={`fixed z-50 transition-all duration-200 ${
        isMinimized
          ? 'bottom-0 right-4 w-72 h-12 bg-[#1e2027] rounded-t-xl shadow-2xl border border-white/10'
          : isMaximized
          ? 'inset-0 md:inset-4 w-auto h-auto bg-[#171920] rounded-none md:rounded-2xl shadow-2xl flex flex-col border border-white/10'
          : 'inset-0 md:inset-auto md:bottom-0 md:right-8 md:w-[580px] md:h-[590px] bg-[#171920] rounded-none md:rounded-t-2xl shadow-2xl flex flex-col border border-white/10'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#20232b] rounded-t-2xl border-b border-white/5 select-none">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            {subject ? subject : 'New Message'}
          </span>
          {draftSavedTime && (
            <span className="text-[11px] text-[#90939d] hidden sm:inline">
              (Saved at {draftSavedTime})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            id="btn-compose-minimize"
            onClick={() => setIsMinimized(!isMinimized)}
            className="hidden md:flex p-1.5 rounded-lg text-[#90939d] hover:text-white hover:bg-white/10 transition"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          <button
            id="btn-compose-maximize"
            onClick={() => setIsMaximized(!isMaximized)}
            className="hidden md:flex p-1.5 rounded-lg text-[#90939d] hover:text-white hover:bg-white/10 transition"
            title="Expand"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            id="btn-compose-close"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#90939d] hover:text-white hover:bg-white/10 transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* If minimized on desktop, show header only */}
      {!isMinimized && (
        <>
          {/* Fields Area */}
          <div className="flex-1 flex flex-col overflow-y-auto px-4 py-2 space-y-2 text-sm">
            {/* TO Field */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-1.5 pt-1">
              <span className="text-xs font-semibold text-[#8e919a] w-8">To</span>
              <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                {recipients.map((rec) => (
                  <span
                    key={rec}
                    className="inline-flex items-center gap-1 text-xs bg-[#2b354d] text-[#8ab4f8] px-2 py-0.5 rounded-full"
                  >
                    <span>{rec}</span>
                    <button
                      type="button"
                      onClick={() => removeRecipient(rec, 'to')}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="input-compose-to"
                  type="text"
                  value={toInput}
                  onChange={(e) => setToInput(e.target.value)}
                  onKeyDown={(e) => handleAddRecipient(e, 'to')}
                  onBlur={(e) => handleAddRecipient(e, 'to')}
                  placeholder={recipients.length === 0 ? 'Recipients (press Enter)' : ''}
                  className="flex-1 min-w-[120px] bg-transparent text-white placeholder-[#8e919a] focus:outline-none text-sm"
                />
              </div>

              {!showCcBcc && (
                <button
                  type="button"
                  onClick={() => setShowCcBcc(true)}
                  className="text-xs text-[#8e919a] hover:text-[#c4c6cf] transition"
                >
                  Cc/Bcc
                </button>
              )}
            </div>

            {/* CC / BCC fields */}
            {showCcBcc && (
              <>
                <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
                  <span className="text-xs font-semibold text-[#8e919a] w-8">Cc</span>
                  <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                    {ccList.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 text-xs bg-white/10 text-[#c4c6cf] px-2 py-0.5 rounded-full"
                      >
                        <span>{c}</span>
                        <button
                          type="button"
                          onClick={() => removeRecipient(c, 'cc')}
                          className="hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      id="input-compose-cc"
                      type="text"
                      value={ccInput}
                      onChange={(e) => setCcInput(e.target.value)}
                      onKeyDown={(e) => handleAddRecipient(e, 'cc')}
                      onBlur={(e) => handleAddRecipient(e, 'cc')}
                      className="flex-1 min-w-[100px] bg-transparent text-white placeholder-[#8e919a] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
                  <span className="text-xs font-semibold text-[#8e919a] w-8">Bcc</span>
                  <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                    {bccList.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1 text-xs bg-white/10 text-[#c4c6cf] px-2 py-0.5 rounded-full"
                      >
                        <span>{b}</span>
                        <button
                          type="button"
                          onClick={() => removeRecipient(b, 'bcc')}
                          className="hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      id="input-compose-bcc"
                      type="text"
                      value={bccInput}
                      onChange={(e) => setBccInput(e.target.value)}
                      onKeyDown={(e) => handleAddRecipient(e, 'bcc')}
                      onBlur={(e) => handleAddRecipient(e, 'bcc')}
                      className="flex-1 min-w-[100px] bg-transparent text-white placeholder-[#8e919a] focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Subject */}
            <div className="border-b border-white/5 pb-1.5">
              <input
                id="input-compose-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full bg-transparent text-white placeholder-[#8e919a] focus:outline-none font-medium text-sm"
              />
            </div>

            {/* AI Assistant Help Me Write Bar */}
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Need inspiration or proofreading?</span>
              </div>
              <button
                id="btn-compose-ai-help"
                type="button"
                onClick={() => onOpenAiAssistant('help-me-write', body)}
                className="text-xs font-semibold bg-cyan-500 text-[#111318] px-2.5 py-1 rounded-lg hover:bg-cyan-400 transition"
              >
                Help me write
              </button>
            </div>

            {/* Body TextArea */}
            <div className="flex-1 flex flex-col min-h-[140px]">
              <textarea
                id="textarea-compose-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Compose your email..."
                className="w-full flex-1 bg-transparent text-white placeholder-[#7e828e] resize-none focus:outline-none leading-relaxed text-sm"
              />
            </div>

            {/* Uploaded Attachments */}
            {attachments.length > 0 && (
              <div className="border-t border-white/5 pt-2 flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <span
                    key={att.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#242730] border border-white/10 text-xs text-[#c4c6cf]"
                  >
                    <Paperclip className="w-3 h-3 text-[#8ab4f8]" />
                    <span className="truncate max-w-[120px]">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                      className="text-[#90939d] hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Bottom Action & Formatting Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1e2027] border-t border-white/5 rounded-b-2xl">
            {/* Left: Send Button & Split Schedule Dropdown */}
            <div className="flex items-center relative">
              <button
                id="btn-compose-send"
                onClick={() => handleSend()}
                className="flex items-center gap-2 px-4 py-2 rounded-l-full bg-[#8ab4f8] text-[#111318] font-semibold text-sm hover:bg-[#adc8ff] active:scale-95 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>

              <button
                id="btn-compose-schedule-toggle"
                onClick={() => setShowScheduleSend(!showScheduleSend)}
                className="px-2 py-2 rounded-r-full bg-[#7ca8f5] text-[#111318] hover:bg-[#9cbdff] border-l border-black/10 transition"
                title="Schedule send"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Schedule Send Popup */}
              {showScheduleSend && (
                <div
                  id="schedule-send-popup"
                  className="absolute bottom-12 left-0 w-64 bg-[#282a32] rounded-xl shadow-2xl border border-white/10 py-2 z-50 text-xs"
                >
                  <div className="px-3 py-1 text-[#90939d] font-semibold uppercase tracking-wider">
                    Schedule send
                  </div>
                  <button
                    onClick={() => handleSend('Tomorrow morning, 8:00 AM')}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-white flex justify-between"
                  >
                    <span>Tomorrow morning</span>
                    <span className="text-[#90939d]">8:00 AM</span>
                  </button>
                  <button
                    onClick={() => handleSend('Tomorrow afternoon, 1:00 PM')}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-white flex justify-between"
                  >
                    <span>Tomorrow afternoon</span>
                    <span className="text-[#90939d]">1:00 PM</span>
                  </button>
                  <button
                    onClick={() => handleSend('Monday morning, 8:00 AM')}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-white flex justify-between"
                  >
                    <span>Monday morning</span>
                    <span className="text-[#90939d]">8:00 AM</span>
                  </button>
                </div>
              )}
            </div>

            {/* Center: Formatting & Attachment Shortcuts */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg text-[#90939d] hover:text-white hover:bg-white/5 transition"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg text-[#90939d] hover:text-white hover:bg-white/5 transition"
                title="Insert photo"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter link URL:');
                  if (url) setBody(body + ` [${url}](${url})`);
                }}
                className="p-2 rounded-lg text-[#90939d] hover:text-white hover:bg-white/10 transition"
                title="Insert link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setBody(body + ' 😊')}
                className="p-2 rounded-lg text-[#90939d] hover:text-white hover:bg-white/10 transition"
                title="Insert emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Discard Draft */}
            <button
              id="btn-compose-discard"
              type="button"
              onClick={() => setShowDiscardConfirm(true)}
              className="p-2 rounded-lg text-[#90939d] hover:text-rose-400 hover:bg-white/10 transition"
              title="Discard draft"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 rounded-2xl z-50">
          <div className="bg-[#242730] p-5 rounded-xl border border-white/10 max-w-xs w-full space-y-3">
            <h4 className="text-sm font-bold text-white">Discard draft?</h4>
            <p className="text-xs text-[#90939d] leading-relaxed">
              Your message will be permanently deleted and cannot be recovered.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#c4c6cf] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-500"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
