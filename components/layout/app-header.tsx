"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart-store";
import { useAuth } from "@/store/auth-store";
import { useNotifications } from "@/store/notification-store";
import { StoreSelectorModal } from "@/components/ui/store-selector-modal";
import {
  ShoppingCart,
  ChevronDown,
  Bell,
  User,
  Clock,
  ChevronRight,
  BellOff,
  Sparkles,
} from "lucide-react";

function formatRelTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export function AppHeader() {
  const { selectedStore } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { notifications, unreadCount, markRead, dismiss } = useNotifications();
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const previewNotifs = notifications.slice(0, 3);

  function handleNotifClick(id: string, payload?: string) {
    markRead([id]);
    setIsNotifOpen(false);
    if (payload) router.push(payload);
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#102B35] text-white shadow-md print:hidden">
        {/* Top announcement bar */}
        <div className="bg-[#0B1D24] px-4 py-1 flex items-center justify-between text-[11px] text-slate-300 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#17A890] animate-pulse" />
            <span className="font-medium tracking-wide">
              SmartCart AI • All Modules Live
            </span>
          </div>
          <span className="bg-[#17A890]/20 text-[#17A890] px-1.5 py-0.5 rounded text-[10px] font-semibold border border-[#17A890]/30">
            Demo Store Data
          </span>
        </div>

        {/* Main Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Brand Mark */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-hidden"
              aria-label="SmartCart AI Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#17A890] to-[#25d3b6] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-5 h-5 text-[#102B35]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-base tracking-tight text-white leading-none">
                    SmartCart
                  </span>
                  <span className="text-[#17A890] text-xs font-black tracking-wider uppercase bg-white/10 px-1 py-0.5 rounded">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">
                  Self-Checkout System
                </span>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* SmartCart AI Assistant */}
              <Link
                href="/assistant"
                aria-label="SmartCart AI Assistant"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#17A890]/25 flex items-center justify-center text-[#25d3b6] hover:text-white transition-colors relative border border-white/10"
              >
                <Sparkles className="w-4 h-4 text-[#25d3b6]" />
              </Link>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen((v) => !v)}
                  aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-slate-200 hover:text-white transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-[#17A890] ring-2 ring-[#102B35] flex items-center justify-center text-[9px] font-black text-[#102B35] px-0.5">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotifOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotifOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white text-[#18252B] rounded-2xl shadow-2xl border border-[#E5EBE8] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Dropdown header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5EBE8] bg-[#F7F9F8]">
                        <div>
                          <span className="text-sm font-bold text-[#102B35]">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="ml-2 text-[10px] font-black text-white bg-[#17A890] rounded-full px-1.5 py-0.5">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <Link
                          href="/notifications"
                          onClick={() => setIsNotifOpen(false)}
                          className="text-[11px] font-semibold text-[#17A890] hover:underline"
                        >
                          See all
                        </Link>
                      </div>

                      {/* Preview list */}
                      {previewNotifs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                          <BellOff className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="text-xs text-slate-500 font-medium">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#F0F4F2]">
                          {previewNotifs.map((n) => (
                            <button
                              key={n.id}
                              onClick={() =>
                                handleNotifClick(n.id, n.actions?.[0]?.payload)
                              }
                              className={`w-full text-left px-4 py-3 hover:bg-[#F7F9F8] transition-colors flex items-start gap-3 ${
                                !n.isRead ? "bg-teal-50/50" : ""
                              }`}
                            >
                              {!n.isRead && (
                                <span className="w-2 h-2 rounded-full bg-[#17A890] shrink-0 mt-1.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold truncate ${!n.isRead ? "text-[#102B35]" : "text-slate-700"}`}>
                                  {n.title}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">{n.body}</p>
                                <span className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {formatRelTime(n.createdAt)}
                                </span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* View all footer */}
                      <div className="grid grid-cols-2 divide-x divide-[#E5EBE8] border-t border-[#E5EBE8]">
                        <Link
                          href="/notifications"
                          onClick={() => setIsNotifOpen(false)}
                          className="flex items-center justify-center gap-1 py-2.5 text-xs font-bold text-[#17A890] hover:bg-teal-50 transition-colors"
                        >
                          <span>All Alerts</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/settings/notifications"
                          onClick={() => setIsNotifOpen(false)}
                          className="flex items-center justify-center gap-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <span>Settings</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile */}
              <Link
                href={isAuthenticated ? "/profile" : "/login"}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
                aria-label={isAuthenticated ? "Customer Profile" : "Sign In"}
              >
                <div className="w-7 h-7 rounded-full bg-[#17A890] text-[#102B35] font-bold text-xs flex items-center justify-center">
                  <User className="w-4 h-4 text-[#102B35]" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-none text-white truncate max-w-[100px]">
                    {isAuthenticated && user ? user.name.split(" ")[0] : "Sign In"}
                  </span>
                  <span className="text-[9px] text-[#17A890] font-semibold leading-none mt-0.5">
                    {isAuthenticated && user
                      ? user.membershipTier.replace("SmartClub ", "")
                      : "Guest"}
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Store Location Bar */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => setIsStoreModalOpen(true)}
              className="flex items-center gap-1.5 text-left group w-full hover:opacity-95 transition-opacity"
              aria-label="Change supermarket store location"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#17A890]" />
              <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-[#17A890] transition-colors truncate">
                  {selectedStore.name}
                </span>
                <span className="text-[11px] text-slate-400 truncate hidden xs:inline">
                  • {selectedStore.address}
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-[#17A890] text-xs font-medium shrink-0 ml-1">
                <span>Change</span>
                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </header>

      <StoreSelectorModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />
    </>
  );
}
