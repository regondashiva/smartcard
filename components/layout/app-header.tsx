"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart-store";
import { useAuth } from "@/store/auth-store";
import { StoreSelectorModal } from "@/components/ui/store-selector-modal";
import {
  ShoppingCart,
  ChevronDown,
  Bell,
  Sparkles,
  User,
  X,
  CheckCircle2,
} from "lucide-react";

export function AppHeader() {
  const { selectedStore, session } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#102B35] text-white shadow-md print:hidden">
        {/* Top announcement bar for Demo status */}
        <div className="bg-[#0B1D24] px-4 py-1 flex items-center justify-between text-[11px] text-slate-300 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#17A890] animate-pulse" />
            <span className="font-medium tracking-wide">
              SmartCart AI Prototype • Module 1
            </span>
          </div>
          <span className="bg-[#17A890]/20 text-[#17A890] px-1.5 py-0.2 rounded text-[10px] font-semibold border border-[#17A890]/30">
            Demo Store Data
          </span>
        </div>

        {/* Main Header Container */}
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
                  <span className="text-[#17A890] text-xs font-black tracking-wider uppercase bg-white/10 px-1 py-0.2 rounded">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">
                  Self-Checkout System
                </span>
              </div>
            </Link>

            {/* Actions: Notifications & Avatar */}
            <div className="flex items-center gap-2">
              {/* Notification Icon */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  aria-label="View notifications (1 unread)"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-slate-200 hover:text-white transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#17A890] ring-2 ring-[#102B35]" />
                </button>

                {/* Notification Dropdown Popover */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white text-[#18252B] rounded-2xl shadow-2xl border border-[#E5EBE8] p-3.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
                      <span className="text-xs font-bold text-[#102B35]">Notifications</span>
                      <button
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-[#718096] hover:text-[#18252B] p-0.5 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="py-2.5 space-y-2">
                      <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-100 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#17A890] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-[#102B35]">
                            Module 1 Activated
                          </p>
                          <p className="text-[11px] text-[#718096] mt-0.5 leading-snug">
                            Customer mobile app foundation & home screen are live with interactive mock data.
                          </p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#16865C] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-[#102B35]">
                            Demo Session Ready
                          </p>
                          <p className="text-[11px] text-[#718096] mt-0.5 leading-snug">
                            Tap &quot;Start Shopping&quot; below to simulate cart association.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Avatar / Profile Shortcut */}
              <Link
                href={isAuthenticated ? "/profile" : "/login"}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
                aria-label={isAuthenticated ? "Customer Profile" : "Sign In to SmartCart"}
              >
                <div className="w-7 h-7 rounded-full bg-[#17A890] text-[#102B35] font-bold text-xs flex items-center justify-center">
                  <User className="w-4 h-4 text-[#102B35]" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-none text-white truncate max-w-[100px]">
                    {isAuthenticated && user ? user.name.split(" ")[0] : "Sign In"}
                  </span>
                  <span className="text-[9px] text-[#17A890] font-semibold leading-none mt-0.5">
                    {isAuthenticated && user ? user.membershipTier.replace("SmartClub ", "") : "Guest"}
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Store Location Bar (Clickable to switch stores) */}
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

      {/* Store Selector Modal */}
      <StoreSelectorModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />
    </>
  );
}
