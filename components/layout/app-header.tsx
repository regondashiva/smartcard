"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart-store";
import { useAuth } from "@/store/auth-store";
import { useNotifications } from "@/store/notification-store";
import { PRODUCTS } from "@/data/products";
import { StoreSelectorModal } from "@/components/ui/store-selector-modal";
import {
  ShoppingCart,
  ChevronDown,
  Bell,
  User,
  Clock,
  ChevronRight,
  BellOff,
  Search,
  X,
} from "lucide-react";
import { Product } from "@/types/product";

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
  const { notifications, unreadCount, markRead } = useNotifications();

  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Prevent SSR/client hydration mismatch for client-persisted stores
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const previewNotifs = notifications.slice(0, 4);

  // Live search filter
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setSearchResults([]); return; }
    setSearchResults(
      PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      ).slice(0, 6)
    );
  }, [searchQuery]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleNotifClick(id: string, payload?: string) {
    markRead([id]);
    setIsNotifOpen(false);
    if (payload) router.push(payload);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setSearchQuery("");
    }
  }

  function handleResultClick(productId: string) {
    router.push(`/products/${productId}`);
    setIsSearchFocused(false);
    setSearchQuery("");
  }

  const initials = user
    ? user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "";

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#102B35] text-white shadow-lg print:hidden">
        <div className="px-3 sm:px-4 py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">

            {/* ── LEFT: Logo + Store Selector ── */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-1.5 group focus:outline-hidden"
                aria-label="SmartCart AI Home"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#17A890] to-[#25d3b6] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <ShoppingCart className="w-4 h-4 text-[#102B35]" />
                </div>
                <span className="hidden sm:flex flex-col leading-none">
                  <span className="font-extrabold text-[13px] tracking-tight text-white">
                    SmartCart <span className="text-[#17A890]">AI</span>
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">Self-Checkout</span>
                </span>
              </Link>

              <div className="hidden md:block w-px h-6 bg-white/15" />

              {/* Store Selector */}
              <button
                onClick={() => setIsStoreModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 text-left group hover:opacity-90 transition-opacity"
                aria-label="Change store location"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#17A890] shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold text-white group-hover:text-[#17A890] transition-colors truncate max-w-[130px]">
                    {selectedStore.name}
                  </span>
                  <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                    Change store <ChevronDown className="w-2.5 h-2.5 inline" />
                  </span>
                </div>
              </button>
            </div>

            {/* ── CENTER: Search Bar ── */}
            <div className="flex-1 relative min-w-0" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search products, brands, categories…"
                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-[#17A890]/60 text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none transition-all"
                    aria-label="Search products"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Live Results Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-[#E5EBE8] z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F7F9F8] transition-colors text-left border-b border-[#F0F4F2] last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F7F9F8] flex items-center justify-center shrink-0 overflow-hidden border border-[#E5EBE8]">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#18252B] truncate">{product.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{product.brand} · ₹{product.price}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchFocused(false);
                      setSearchQuery("");
                    }}
                    className="w-full px-3 py-2 text-[11px] font-bold text-[#17A890] hover:bg-teal-50 transition-colors text-center"
                  >
                    See all results for &ldquo;{searchQuery}&rdquo;
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT: Bell + Profile ── */}
            <div className="flex items-center gap-1.5 shrink-0">

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setIsNotifOpen((v) => !v); setIsProfileOpen(false); }}
                  aria-label={`Notifications${mounted && unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-slate-200 hover:text-white transition-colors relative border border-white/10"
                >
                  <Bell className="w-4 h-4" />
                  {mounted && unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-[#17A890] ring-2 ring-[#102B35] flex items-center justify-center text-[9px] font-black text-[#102B35] px-0.5">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white text-[#18252B] rounded-2xl shadow-2xl border border-[#E5EBE8] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5EBE8] bg-[#F7F9F8]">
                        <div>
                          <span className="text-sm font-bold text-[#102B35]">Notifications</span>
                          {mounted && unreadCount > 0 && (
                            <span className="ml-2 text-[10px] font-black text-white bg-[#17A890] rounded-full px-1.5 py-0.5">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <Link href="/notifications" onClick={() => setIsNotifOpen(false)} className="text-[11px] font-semibold text-[#17A890] hover:underline">
                          See all
                        </Link>
                      </div>

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
                              onClick={() => handleNotifClick(n.id, n.actions?.[0]?.payload)}
                              className={`w-full text-left px-4 py-3 hover:bg-[#F7F9F8] transition-colors flex items-start gap-3 ${!n.isRead ? "bg-teal-50/50" : ""}`}
                            >
                              {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#17A890] shrink-0 mt-1.5" />}
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold truncate ${!n.isRead ? "text-[#102B35]" : "text-slate-700"}`}>{n.title}</p>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">{n.body}</p>
                                <span className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                                  <Clock className="w-2.5 h-2.5" />{formatRelTime(n.createdAt)}
                                </span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 divide-x divide-[#E5EBE8] border-t border-[#E5EBE8]">
                        <Link href="/notifications" onClick={() => setIsNotifOpen(false)} className="flex items-center justify-center gap-1 py-2.5 text-xs font-bold text-[#17A890] hover:bg-teal-50 transition-colors">
                          <span>All Alerts</span><ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link href="/settings/notifications" onClick={() => setIsNotifOpen(false)} className="flex items-center justify-center gap-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                          <span>Settings</span><ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => { setIsProfileOpen((v) => !v); setIsNotifOpen(false); }}
                  className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
                  aria-label={mounted && isAuthenticated ? "Profile menu" : "Sign in"}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#17A890] to-[#0f7a66] font-black text-[11px] text-white flex items-center justify-center shrink-0">
                    {mounted && isAuthenticated && user ? initials : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-[11px] font-bold text-white truncate max-w-[72px]">
                      {mounted && isAuthenticated && user ? user.name.split(" ")[0] : "Sign In"}
                    </span>
                    {mounted && isAuthenticated && user && (
                      <span className="text-[9px] text-[#17A890] font-semibold">
                        {user.membershipTier.replace("SmartClub ", "")}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#E5EBE8] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      {mounted && isAuthenticated && user ? (
                        <>
                          <div className="px-4 py-3 bg-[#F7F9F8] border-b border-[#E5EBE8]">
                            <p className="text-sm font-bold text-[#102B35] truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                            <span className="inline-block mt-1 text-[10px] font-black text-[#17A890] bg-[#17A890]/10 px-2 py-0.5 rounded-full">
                              {user.membershipTier}
                            </span>
                          </div>
                          {[
                            { label: "My Profile", href: "/profile" },
                            { label: "My Orders", href: "/orders" },
                            { label: "Shopping History", href: "/my-shopping" },
                            { label: "Notifications", href: "/notifications" },
                            { label: "Settings", href: "/settings" },
                            { label: "Help & Support", href: "/help" },
                          ].map(({ label, href }) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#18252B] hover:bg-[#F7F9F8] transition-colors border-b border-[#F0F4F2] last:border-0"
                            >
                              {label}
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                            </Link>
                          ))}
                        </>
                      ) : (
                        <div className="p-4 space-y-3">
                          <p className="text-xs text-slate-600">Sign in to access your account and shopping history.</p>
                          <Link
                            href="/login"
                            onClick={() => setIsProfileOpen(false)}
                            className="block w-full text-center py-2 bg-[#17A890] text-white font-bold text-xs rounded-xl"
                          >
                            Sign In
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Store Bar */}
          <button
            onClick={() => setIsStoreModalOpen(true)}
            className="md:hidden flex items-center gap-1.5 mt-2 pt-2 border-t border-white/10 w-full text-left group hover:opacity-90 transition-opacity"
            aria-label="Change store"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#17A890] shrink-0" />
            <span className="text-[11px] font-bold text-white group-hover:text-[#17A890] transition-colors truncate flex-1">
              {selectedStore.name}
            </span>
            <span className="text-[10px] text-[#17A890] flex items-center gap-0.5">
              Change <ChevronDown className="w-3 h-3" />
            </span>
          </button>
        </div>
      </header>

      <StoreSelectorModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />
    </>
  );
}
