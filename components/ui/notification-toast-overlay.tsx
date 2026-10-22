"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/store/notification-store";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ShoppingCart,
  ShieldCheck,
  X,
  ChevronRight,
} from "lucide-react";
import type { ToastVariant } from "@/types/notification";

// ─── Variant config ───────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<
  ToastVariant,
  { bg: string; border: string; icon: React.ElementType; iconColor: string }
> = {
  success:      { bg: "bg-green-50",   border: "border-green-300",  icon: CheckCircle2,   iconColor: "text-green-600" },
  error:        { bg: "bg-red-50",     border: "border-red-300",    icon: XCircle,        iconColor: "text-red-600" },
  warning:      { bg: "bg-amber-50",   border: "border-amber-300",  icon: AlertTriangle,  iconColor: "text-amber-600" },
  info:         { bg: "bg-blue-50",    border: "border-blue-300",   icon: Info,           iconColor: "text-blue-600" },
  cart:         { bg: "bg-teal-50",    border: "border-teal-300",   icon: ShoppingCart,   iconColor: "text-teal-600" },
  verification: { bg: "bg-amber-50",   border: "border-amber-300",  icon: ShieldCheck,    iconColor: "text-amber-600" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationToastOverlay() {
  const { toasts, dismissToast } = useNotifications();
  const router = useRouter();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-[72px] right-3 z-[9999] flex flex-col gap-2 max-w-[320px] w-[calc(100vw-24px)] pointer-events-none print:hidden"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const cfg = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;
        const Icon = cfg.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md ${cfg.bg} ${cfg.border} animate-in slide-in-from-right-4 fade-in duration-200`}
            role="alert"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#102B35] leading-tight">{toast.title}</p>
              {toast.body && (
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">{toast.body}</p>
              )}
              {toast.action && toast.action.type === "navigate" && toast.action.payload && (
                <button
                  onClick={() => {
                    router.push(toast.action!.payload!);
                    dismissToast(toast.id);
                  }}
                  className="mt-2 flex items-center gap-1 text-xs font-bold text-[#17A890] hover:underline"
                >
                  {toast.action.label}
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 p-0.5 rounded"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
