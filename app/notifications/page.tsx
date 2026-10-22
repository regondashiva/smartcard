"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/auth-store";
import { useNotifications } from "@/store/notification-store";
import {
  CustomerNotification,
  NotificationCategory,
} from "@/types/notification";
import {
  Bell,
  BellOff,
  CheckCheck,
  ChevronRight,
  Clock,
  Filter,
  Package,
  PackagePlus,
  QrCode,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  Info,
} from "lucide-react";

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Bell, BellOff, CheckCheck, Clock, Package, PackagePlus, QrCode, Receipt,
  ShieldCheck, ShoppingCart, Sparkles, Tag, Trash2, AlertTriangle,
  CheckCircle2, XCircle, X, Info,
};

function NotifIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = name ? (ICON_MAP[name] || Bell) : Bell;
  return <Icon className={className} />;
}

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<NotificationCategory, { label: string; color: string; bg: string }> = {
  session:      { label: "Session",      color: "text-[#17A890]",  bg: "bg-teal-50 border-teal-200" },
  cart:         { label: "Cart",         color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
  verification: { label: "Verification", color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
  payment:      { label: "Payment",      color: "text-green-600",  bg: "bg-green-50 border-green-200" },
  order:        { label: "Order",        color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
  receipt:      { label: "Receipt",      color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  reminder:     { label: "Reminder",     color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  promo:        { label: "Offer",        color: "text-pink-600",   bg: "bg-pink-50 border-pink-200" },
  system:       { label: "System",       color: "text-slate-600",  bg: "bg-slate-50 border-slate-200" },
};

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Priority dot ─────────────────────────────────────────────────────────────
function PriorityDot({ priority }: { priority: CustomerNotification["priority"] }) {
  const colors: Record<string, string> = {
    urgent: "bg-red-500",
    high: "bg-amber-400",
    normal: "bg-[#17A890]",
    low: "bg-slate-300",
  };
  return <span className={`w-2 h-2 rounded-full shrink-0 ${colors[priority] || colors.normal}`} />;
}

// ─── Single Notification Card ─────────────────────────────────────────────────
interface NotifCardProps {
  notif: CustomerNotification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

function NotifCard({ notif, onMarkRead, onDismiss }: NotifCardProps) {
  const router = useRouter();
  const cat = CATEGORY_CONFIG[notif.category] || CATEGORY_CONFIG.system;

  function handleAction(payload?: string, type?: string) {
    if (type === "navigate" && payload) {
      router.push(payload);
    }
    if (!notif.isRead) onMarkRead(notif.id);
  }

  return (
    <article
      className={`relative rounded-2xl border p-4 transition-all duration-200 ${
        notif.isRead
          ? "bg-white border-[#E5EBE8]"
          : "bg-teal-50/40 border-[#17A890]/30 shadow-sm"
      }`}
    >
      {/* Unread indicator */}
      {!notif.isRead && (
        <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#17A890]" />
      )}

      <div className={`flex items-start gap-3 ${!notif.isRead ? "ml-4" : ""}`}>
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cat.bg}`}
        >
          <NotifIcon name={notif.iconName} className={`w-5 h-5 ${cat.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${cat.bg} ${cat.color}`}
            >
              {cat.label}
            </span>
            <PriorityDot priority={notif.priority} />
            <span className="text-[11px] text-slate-400 ml-auto flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(notif.createdAt)}
            </span>
          </div>

          <h3
            className={`mt-1.5 text-sm font-bold leading-tight ${
              notif.isRead ? "text-[#18252B]" : "text-[#102B35]"
            }`}
          >
            {notif.title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{notif.body}</p>

          {/* Actions */}
          {notif.actions && notif.actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {notif.actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.payload, action.type)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    action.variant === "primary"
                      ? "bg-[#17A890] text-white hover:bg-[#128673]"
                      : action.variant === "danger"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {action.label}
                  {action.type === "navigate" && (
                    <ChevronRight className="w-3 h-3 inline-block ml-0.5 -mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(notif.id)}
          className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 p-1 rounded-lg hover:bg-slate-100"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS: { value: "all" | NotificationCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "session", label: "Session" },
  { value: "verification", label: "Verification" },
  { value: "payment", label: "Payments" },
  { value: "order", label: "Orders" },
  { value: "promo", label: "Offers" },
  { value: "reminder", label: "Reminders" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markRead,
    markAllRead,
    dismiss,
    clearAll,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<"all" | NotificationCategory>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchNotifications();
  }, [isAuthenticated, router, fetchNotifications]);

  const filtered = useMemo(() => {
    let list = notifications;
    if (activeFilter !== "all") {
      list = list.filter((n) => n.category === activeFilter);
    }
    if (showUnreadOnly) {
      list = list.filter((n) => !n.isRead);
    }
    return list;
  }, [notifications, activeFilter, showUnreadOnly]);

  // Auto-mark read on view for visible notifications
  useEffect(() => {
    const unreadIds = filtered.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length > 0) {
      const timer = setTimeout(() => markRead(unreadIds), 2000);
      return () => clearTimeout(timer);
    }
  }, [filtered, markRead]);

  return (
    <div className="pb-24">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-[#102B35] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#17A890]" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[#17A890] text-white text-[11px] font-black">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Your shopping alerts and updates</p>
        </div>

        <Link
          href="/settings/notifications"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#17A890] bg-teal-50 px-3 py-2 rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </Link>
      </div>

      {/* Action Bar */}
      {notifications.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#17A890] bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowUnreadOnly((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              showUnreadOnly
                ? "bg-[#102B35] text-white border-[#102B35]"
                : "bg-white text-slate-600 border-[#E5EBE8] hover:bg-slate-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {showUnreadOnly ? "Unread only" : "All"}
          </button>
          <button
            onClick={clearAll}
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none -mx-4 px-4">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              activeFilter === tab.value
                ? "bg-[#102B35] text-white border-[#102B35]"
                : "bg-white text-slate-600 border-[#E5EBE8] hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {isLoading && notifications.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <BellOff className="w-7 h-7 text-slate-400" />
          </div>
          <h2 className="text-base font-bold text-[#102B35] mb-1">
            {showUnreadOnly ? "No unread notifications" : "No notifications yet"}
          </h2>
          <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
            {showUnreadOnly
              ? "You're all caught up! All notifications have been read."
              : "Start shopping to receive session alerts, payment confirmations, and personalised offers."}
          </p>
          {showUnreadOnly && (
            <button
              onClick={() => setShowUnreadOnly(false)}
              className="mt-4 text-xs font-semibold text-[#17A890] underline underline-offset-2"
            >
              Show all notifications
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <NotifCard
              key={notif.id}
              notif={notif}
              onMarkRead={(id) => markRead([id])}
              onDismiss={dismiss}
            />
          ))}
        </div>
      )}

      {/* Footer hint */}
      {filtered.length > 0 && (
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Notifications older than 30 days are automatically removed.{" "}
          <Link href="/settings/notifications" className="text-[#17A890] font-semibold">
            Manage preferences
          </Link>
        </p>
      )}
    </div>
  );
}
