"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/auth-store";
import { useNotifications } from "@/store/notification-store";
import {
  NotificationCategory,
  NotificationCategoryPreference,
} from "@/types/notification";
import {
  Bell,
  BellOff,
  ChevronLeft,
  Moon,
  ShoppingCart,
  ShieldCheck,
  CreditCard,
  Package,
  Receipt,
  Clock,
  Tag,
  Settings,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ─── Category Icon Map ────────────────────────────────────────────────────────

const CAT_ICONS: Record<NotificationCategory, React.ElementType> = {
  session:      ShoppingCart,
  cart:         ShoppingCart,
  verification: ShieldCheck,
  payment:      CreditCard,
  order:        Package,
  receipt:      Receipt,
  reminder:     Clock,
  promo:        Tag,
  system:       Settings,
};

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:ring-offset-2 ${
        checked ? "bg-[#17A890]" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
      <span className="sr-only">{checked ? "On" : "Off"}</span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationSettingsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { preferences, fetchPreferences, updatePreferences, pushState, requestPushPermission } =
    useNotifications();

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchPreferences();
  }, [isAuthenticated, router, fetchPreferences]);

  async function handleToggleMaster(value: boolean) {
    setIsSaving(true);
    try {
      await updatePreferences({ masterEnabled: value });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  }

  async function handleToggleCategory(
    category: NotificationCategory,
    field: "enabled" | "pushEnabled",
    value: boolean
  ) {
    if (!preferences) return;
    const updatedCategories = preferences.categories.map(
      (c: NotificationCategoryPreference) =>
        c.category === category ? { ...c, [field]: value } : c
    );
    setIsSaving(true);
    try {
      await updatePreferences({ categories: updatedCategories });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  }

  async function handleQuietHours(field: string, value: boolean | string) {
    setIsSaving(true);
    try {
      await updatePreferences({ [field]: value });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  }

  if (!preferences) {
    return (
      <div className="pb-24">
        <div className="h-10 w-40 bg-slate-100 rounded-xl animate-pulse mb-4" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse mb-3" />
        ))}
      </div>
    );
  }

  const pushGranted = pushState.status === "granted";
  const pushDenied = pushState.status === "denied";
  const pushUnsupported = pushState.status === "unsupported";

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pt-1">
        <Link
          href="/notifications"
          className="w-9 h-9 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-slate-500 hover:text-[#102B35] transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-[#102B35] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#17A890]" />
            Notification Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Control how SmartCart AI alerts you</p>
        </div>
      </div>

      {/* Save Status Toast */}
      {saveStatus !== "idle" && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold ${
            saveStatus === "saved"
              ? "bg-teal-50 text-teal-700 border border-teal-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {saveStatus === "saved" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {saveStatus === "saved" ? "Preferences saved" : "Failed to save — please try again"}
        </div>
      )}

      {/* Master Toggle */}
      <section className="bg-white border border-[#E5EBE8] rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#102B35] flex items-center justify-center">
              {preferences.masterEnabled ? (
                <Bell className="w-5 h-5 text-[#17A890]" />
              ) : (
                <BellOff className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-[#102B35]">All Notifications</p>
              <p className="text-xs text-slate-500">
                {preferences.masterEnabled ? "Notifications are on" : "All notifications paused"}
              </p>
            </div>
          </div>
          <Toggle
            id="master-toggle"
            checked={preferences.masterEnabled}
            onChange={handleToggleMaster}
          />
        </div>
      </section>

      {/* Push Notifications */}
      <section className="bg-white border border-[#E5EBE8] rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-4 h-4 text-[#17A890]" />
          <h2 className="text-sm font-bold text-[#102B35]">Push Notifications</h2>
        </div>

        {pushUnsupported ? (
          <div className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
            Push notifications are not supported by your browser.
          </div>
        ) : pushDenied ? (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            Browser push permission was denied. Please enable it in your browser settings and refresh.
          </div>
        ) : pushGranted ? (
          <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-xl p-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Push notifications are enabled for this device.
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Receive push alerts for payments, verification issues, and exit passes — even when the app is in the background.
            </p>
            <button
              onClick={requestPushPermission}
              className="w-full py-2.5 rounded-xl bg-[#17A890] text-white text-sm font-bold hover:bg-[#128673] transition-colors"
            >
              Enable Push Notifications
            </button>
          </div>
        )}
      </section>

      {/* Quiet Hours */}
      <section className="bg-white border border-[#E5EBE8] rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-[#102B35]">Quiet Hours</h2>
          </div>
          <Toggle
            id="quiet-hours-toggle"
            checked={preferences.quietHoursEnabled}
            onChange={(v) => handleQuietHours("quietHoursEnabled", v)}
          />
        </div>
        {preferences.quietHoursEnabled && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1">
              <label className="text-xs text-slate-500 font-medium block mb-1">From</label>
              <input
                type="time"
                value={preferences.quietHoursStart}
                onChange={(e) => handleQuietHours("quietHoursStart", e.target.value)}
                className="w-full border border-[#E5EBE8] rounded-xl px-3 py-2 text-sm text-[#102B35] bg-[#F7F9F8] focus:outline-none focus:ring-2 focus:ring-[#17A890]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 font-medium block mb-1">Until</label>
              <input
                type="time"
                value={preferences.quietHoursEnd}
                onChange={(e) => handleQuietHours("quietHoursEnd", e.target.value)}
                className="w-full border border-[#E5EBE8] rounded-xl px-3 py-2 text-sm text-[#102B35] bg-[#F7F9F8] focus:outline-none focus:ring-2 focus:ring-[#17A890]"
              />
            </div>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2">
          During quiet hours, in-app banners are suppressed. Urgent alerts (payment failures, mismatch) still appear.
        </p>
      </section>

      {/* Category Preferences */}
      <section className="bg-white border border-[#E5EBE8] rounded-2xl overflow-hidden shadow-sm mb-4">
        <div className="px-4 pt-4 pb-2 border-b border-[#E5EBE8]">
          <h2 className="text-sm font-bold text-[#102B35]">Notification Categories</h2>
          <p className="text-xs text-slate-500 mt-0.5">Choose what you want to be notified about</p>
        </div>

        <div className="divide-y divide-[#F0F4F2]">
          {preferences.categories.map((cat: NotificationCategoryPreference) => {
            const Icon = CAT_ICONS[cat.category] || Bell;
            return (
              <div key={cat.category} className="px-4 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7F9F8] border border-[#E5EBE8] flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-[#17A890]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#102B35] leading-tight">{cat.label}</p>
                  <p className="text-xs text-slate-500 leading-snug truncate">{cat.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Toggle
                    id={`cat-${cat.category}-enabled`}
                    checked={cat.enabled && preferences.masterEnabled}
                    onChange={(v) => handleToggleCategory(cat.category, "enabled", v)}
                  />
                  {pushGranted && cat.enabled && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">Push</span>
                      <Toggle
                        id={`cat-${cat.category}-push`}
                        checked={cat.pushEnabled}
                        onChange={(v) => handleToggleCategory(cat.category, "pushEnabled", v)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Last Updated */}
      <p className="text-center text-[11px] text-slate-400 mt-2">
        Last updated:{" "}
        {new Date(preferences.updatedAt).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {isSaving && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#102B35] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl">
          <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          Saving…
        </div>
      )}
    </div>
  );
}
