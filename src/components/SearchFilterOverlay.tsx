import React, { useState } from 'react';
import { X, Check, Calendar, Paperclip, Star, Mail, User } from 'lucide-react';

export interface SearchFilters {
  from?: string;
  to?: string;
  hasAttachment: boolean;
  unreadOnly: boolean;
  starredOnly: boolean;
  dateRange?: string;
}

interface SearchFilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export const SearchFilterOverlay: React.FC<SearchFilterOverlayProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div
      id="search-filter-overlay"
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#1c1e26] border border-white/10 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-bold text-white">Search Filters</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#90939d] hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleApply} className="space-y-3.5 text-xs">
          {/* From */}
          <div className="space-y-1">
            <label className="text-[#90939d] font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> From
            </label>
            <input
              type="text"
              value={localFilters.from || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, from: e.target.value })}
              placeholder="e.g. marcus@designlabs.co, chase"
              className="w-full bg-[#14151b] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#8e919a] focus:outline-none focus:border-[#8ab4f8]"
            />
          </div>

          {/* To */}
          <div className="space-y-1">
            <label className="text-[#90939d] font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> To
            </label>
            <input
              type="text"
              value={localFilters.to || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, to: e.target.value })}
              placeholder="e.g. alex.morgan@flowmail.io"
              className="w-full bg-[#14151b] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#8e919a] focus:outline-none focus:border-[#8ab4f8]"
            />
          </div>

          {/* Quick Toggle Checkboxes */}
          <div className="pt-2 space-y-2 border-t border-white/5">
            <label className="flex items-center gap-2.5 text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={localFilters.hasAttachment}
                onChange={(e) => setLocalFilters({ ...localFilters, hasAttachment: e.target.checked })}
                className="rounded accent-[#8ab4f8] w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-[#8ab4f8]" /> Has attachment
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={localFilters.unreadOnly}
                onChange={(e) => setLocalFilters({ ...localFilters, unreadOnly: e.target.checked })}
                className="rounded accent-[#8ab4f8] w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> Unread only
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={localFilters.starredOnly}
                onChange={(e) => setLocalFilters({ ...localFilters, starredOnly: e.target.checked })}
                className="rounded accent-[#8ab4f8] w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Starred only
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                onClearFilters();
                setLocalFilters({
                  from: '',
                  to: '',
                  hasAttachment: false,
                  unreadOnly: false,
                  starredOnly: false
                });
                onClose();
              }}
              className="text-xs text-[#90939d] hover:text-white"
            >
              Reset filters
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-[#c4c6cf] hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#8ab4f8] text-[#111318] font-bold hover:bg-[#adc8ff] transition"
              >
                Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
