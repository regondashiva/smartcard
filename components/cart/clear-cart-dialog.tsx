"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ClearCartDialogProps {
  isOpen: boolean;
  itemCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ClearCartDialog({
  isOpen,
  itemCount,
  onConfirm,
  onCancel,
}: ClearCartDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-3xl border border-[#E5EBE8] shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-cart-title"
      >
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
            <Trash2 className="w-5 h-5" />
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h3
            id="clear-cart-title"
            className="text-base font-bold text-[#102B35]"
          >
            Clear SmartCart Basket?
          </h3>
          <p className="text-xs text-[#718096] leading-relaxed">
            This will remove all {itemCount} {itemCount === 1 ? "item" : "items"} from your shopping basket. Your user profile and store connection will remain unchanged.
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#18252B] font-bold text-xs py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Yes, Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
