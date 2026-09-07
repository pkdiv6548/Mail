import React, { useState } from 'react';
import { X, UserPlus, Settings, Check, HardDrive, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface AccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  currentAccount: UserAccount;
  onSelectAccount: (acc: UserAccount) => void;
  onOpenSettings: () => void;
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  isOpen,
  onClose,
  accounts,
  currentAccount,
  onSelectAccount,
  onOpenSettings
}) => {
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  if (!isOpen) return null;

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail && newName) {
      const newAcc: UserAccount = {
        id: 'acc-' + Date.now(),
        name: newName,
        email: newEmail,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        storageUsed: '0.1 GB',
        storageLimit: '15 GB',
        storagePercentage: 1
      };
      onSelectAccount(newAcc);
      setShowAddAccountModal(false);
      onClose();
    }
  };

  return (
    <div
      id="account-switcher-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="account-switcher-dialog"
        className="bg-[#1c1e26] border border-white/10 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl space-y-4 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Current Active Account Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentAccount.avatar}
              alt={currentAccount.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8ab4f8]"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{currentAccount.name}</h3>
              <p className="text-xs text-[#90939d] truncate">{currentAccount.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#90939d] hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security / Verification Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
          <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>MailFlow Secure Device Protection is active</span>
        </div>

        {/* Account Storage Metric */}
        <div className="p-3 rounded-2xl bg-[#14151b] border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#90939d]">
            <span className="flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5" /> Google One / MailFlow Storage
            </span>
            <span>{currentAccount.storageUsed} of {currentAccount.storageLimit}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              style={{ width: `${currentAccount.storagePercentage}%` }}
            />
          </div>
        </div>

        {/* Other Accounts List */}
        <div className="space-y-1 pt-1 border-t border-white/5">
          <span className="text-[11px] font-semibold text-[#8e919a] uppercase tracking-wider block px-1 pb-1">
            Other Accounts
          </span>
          {accounts
            .filter((acc) => acc.id !== currentAccount.id)
            .map((acc) => (
              <button
                key={acc.id}
                id={`account-option-${acc.id}`}
                onClick={() => {
                  onSelectAccount(acc);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{acc.name}</p>
                    <p className="text-[11px] text-[#90939d] truncate">{acc.email}</p>
                  </div>
                </div>
              </button>
            ))}
        </div>

        {/* Action Buttons: Add account & Manage */}
        <div className="pt-2 border-t border-white/5 space-y-1">
          <button
            id="btn-add-another-account"
            onClick={() => setShowAddAccountModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#8ab4f8] hover:bg-[#8ab4f8]/10 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add another account</span>
          </button>

          <button
            id="btn-manage-accounts"
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#c4c6cf] hover:text-white hover:bg-white/5 transition"
          >
            <Settings className="w-4 h-4 text-[#8e919a]" />
            <span>Manage accounts on this device</span>
          </button>
        </div>

        {/* Add Account Sub-Modal */}
        {showAddAccountModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#242730] p-5 rounded-2xl max-w-xs w-full space-y-3 border border-white/10">
              <h4 className="text-sm font-bold text-white">Add Account</h4>
              <form onSubmit={handleAddAccount} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#90939d] font-medium block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Jordan Lee"
                    className="w-full bg-[#181a22] px-3 py-2 rounded-xl text-white border border-white/10 focus:outline-none focus:border-[#8ab4f8]"
                  />
                </div>
                <div>
                  <label className="text-[#90939d] font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. jordan.lee@company.com"
                    className="w-full bg-[#181a22] px-3 py-2 rounded-xl text-white border border-white/10 focus:outline-none focus:border-[#8ab4f8]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAccountModal(false)}
                    className="px-3 py-1.5 rounded-lg text-[#90939d] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#8ab4f8] text-[#111318] font-bold"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
