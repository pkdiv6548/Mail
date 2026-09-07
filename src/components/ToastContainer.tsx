import React from 'react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto flex items-center justify-between gap-3 bg-[#242730] text-[#f1f3f7] dark:bg-[#282a32] dark:text-[#e4e6ec] px-4 py-3 rounded-xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <span className="text-sm font-medium leading-snug line-clamp-2">{toast.text}</span>
          {toast.undoAction && (
            <button
              id={`toast-undo-${toast.id}`}
              onClick={() => {
                toast.undoAction?.();
                onDismiss(toast.id);
              }}
              className="text-xs font-bold text-[#8ab4f8] hover:text-[#adc8ff] active:scale-95 transition uppercase tracking-wider px-2 py-1 rounded hover:bg-white/5 whitespace-nowrap"
            >
              Undo
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
