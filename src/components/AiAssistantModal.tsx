import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  FileText,
  Calendar,
  CheckSquare,
  MessageCircle,
  Wand2,
  Sliders
} from 'lucide-react';
import { AiTaskType, executeAiTask, AiResponse } from '../services/aiAssistant';
import { EmailMessage } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEmail?: EmailMessage | null;
  draftText?: string;
  initialTask?: AiTaskType;
  onInsertText?: (text: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  activeEmail,
  draftText,
  initialTask = 'summarize-email',
  onInsertText
}) => {
  const [currentTask, setCurrentTask] = useState<AiTaskType>(initialTask);
  const [userCustomPrompt, setUserCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Sync initial task
  useEffect(() => {
    if (initialTask) {
      setCurrentTask(initialTask);
    }
  }, [initialTask]);

  // Run task on open or task change
  useEffect(() => {
    if (isOpen) {
      runAi(currentTask);
    }
  }, [isOpen, currentTask]);

  const runAi = async (task: AiTaskType, customPrompt?: string) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await executeAiTask(task, {
        subject: activeEmail?.subject,
        body: activeEmail?.body,
        sender: activeEmail?.sender,
        draftText: draftText,
        userPrompt: customPrompt || userCustomPrompt
      });
      setResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (response?.result) {
      navigator.clipboard.writeText(response.result);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  const quickActions: Array<{ id: AiTaskType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'summarize-email', label: 'Summarize', icon: FileText },
    { id: 'extract-action-items', label: 'Action Items', icon: CheckSquare },
    { id: 'suggest-reply', label: 'Suggest Reply', icon: MessageCircle },
    { id: 'extract-dates', label: 'Dates & Deadlines', icon: Calendar },
    { id: 'help-me-write', label: 'Help Me Write', icon: Wand2 },
    { id: 'make-professional', label: 'Professional Tone', icon: Sliders },
    { id: 'make-shorter', label: 'Make Shorter', icon: FileText },
    { id: 'fix-grammar', label: 'Fix Grammar', icon: Check }
  ];

  return (
    <div
      id="ai-assistant-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="ai-assistant-dialog"
        className="bg-[#181a22] border border-cyan-500/20 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-cyan-950/40 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                MailFlow AI Assistant
                <span className="text-[9px] uppercase tracking-wider font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  Ready
                </span>
              </h3>
              <p className="text-[11px] text-[#90939d]">
                {activeEmail ? `Analyzing: ${activeEmail.subject}` : 'Email drafting & comprehension assistant'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-ai-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#90939d] hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="px-4 py-2 border-b border-white/5 bg-[#14161d] overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isSelected = currentTask === action.id;

            return (
              <button
                key={action.id}
                id={`ai-task-${action.id}`}
                onClick={() => {
                  setCurrentTask(action.id);
                  runAi(action.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-[#111318] font-bold shadow-xs'
                    : 'bg-white/5 text-[#c4c6cf] hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#111318]' : 'text-cyan-400'}`} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Output Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
              <p className="text-xs text-cyan-300 animate-pulse font-medium">
                MailFlow AI is processing your request...
              </p>
            </div>
          ) : response ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {response.title}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-[#90939d] hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
                  >
                    {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Main Text Result */}
              <div className="p-4 rounded-xl bg-[#1e2029] border border-white/5 text-sm text-[#e2e2e6] leading-relaxed whitespace-pre-line">
                {response.result}
              </div>

              {/* Action items list */}
              {response.actionItems && response.actionItems.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#8e919a] uppercase tracking-wider">
                    Checklist
                  </span>
                  <div className="space-y-1.5">
                    {response.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5 text-xs text-[#c4c6cf]"
                      >
                        <div className="w-4 h-4 rounded border border-cyan-500/50 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Dates */}
              {response.extractedDates && response.extractedDates.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#8e919a] uppercase tracking-wider">
                    Detected Timelines
                  </span>
                  <div className="space-y-1.5">
                    {response.extractedDates.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-xs text-[#c4c6cf]"
                      >
                        <span className="font-semibold text-amber-300">{item.date}</span>
                        <span className="text-[#8e919a]">{item.context}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested quick replies */}
              {response.suggestedReplies && response.suggestedReplies.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#8e919a] uppercase tracking-wider">
                    Tap to use reply
                  </span>
                  <div className="space-y-1.5">
                    {response.suggestedReplies.map((rep, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onInsertText?.(rep);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-xs text-cyan-200 border border-cyan-500/20 transition flex items-center justify-between group"
                      >
                        <span>"{rep}"</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer Custom Prompt Input */}
        <div className="p-3 bg-[#13151b] border-t border-white/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (userCustomPrompt.trim()) {
                runAi('help-me-write', userCustomPrompt.trim());
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              id="input-ai-custom-prompt"
              type="text"
              value={userCustomPrompt}
              onChange={(e) => setUserCustomPrompt(e.target.value)}
              placeholder="Ask MailFlow AI to refine, write, or clarify..."
              className="flex-1 bg-[#1c1e26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#8e919a] focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={isLoading || !userCustomPrompt.trim()}
              className="px-3 py-2 bg-cyan-500 text-[#111318] text-xs font-bold rounded-xl hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              Ask AI
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
