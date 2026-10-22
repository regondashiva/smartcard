"use client";

import React from "react";
import { useCart } from "@/store/cart-store";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastNotification() {
  const { toast, dismissToast } = useCart();

  if (!toast) return null;

  const iconMap: Record<"success" | "warning" | "info", React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-600 shrink-0" />,
  };

  const borderMap: Record<"success" | "warning" | "info", string> = {
    success: "border-emerald-200 bg-emerald-50/95",
    warning: "border-amber-200 bg-amber-50/95",
    info: "border-teal-200 bg-teal-50/95",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-in fade-in slide-in-from-top-3 duration-200"
    >
      <div
        className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md ${
          borderMap[toast.type]
        }`}
      >
        {iconMap[toast.type]}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#18252B] leading-tight">
            {toast.title}
          </p>
          <p className="text-xs text-[#718096] mt-0.5 leading-snug truncate">
            {toast.message}
          </p>
        </div>
        <button
          onClick={dismissToast}
          aria-label="Close notification"
          className="text-[#718096] hover:text-[#18252B] p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
