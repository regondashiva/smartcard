"use client";

import React from "react";
import { LogOut, X, AlertTriangle } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
    >
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#E5EBE8] overflow-hidden p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200 shrink-0">
            <LogOut className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#718096] hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 id="logout-title" className="text-base font-bold text-[#18252B]">
            Confirm Sign Out?
          </h2>
          <p className="text-xs text-[#718096] mt-1 leading-relaxed">
            You will be signed out of your SmartCart account. Any uncompleted in-store demo shopping cart will be disconnected.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Yes, Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#E5EBE8] hover:bg-slate-50 text-[#18252B] font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
