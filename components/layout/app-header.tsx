"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useIsSplashActive } from "@/components/splash/splash-state";
import { useCart } from "@/store/cart-store";
import { useAuth } from "@/store/auth-store";
import { useNotifications } from "@/store/notification-store";
import { PRODUCTS } from "@/data/products";
import { StoreSelectorModal } from "@/components/ui/store-selector-modal";
import {
  ShoppingCart,
  Bell,
  User,
  Clock,
  ChevronRight,
  BellOff,
  Search,
  X,
  ScanLine,
  Sparkles,
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
  const pathname = usePathname();
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

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

  // Focus mobile input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [mobileSearchOpen]);

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
      setMobileSearchOpen(false);
      setSearchQuery("");
    }
  }

  function handleResultClick(productId: string) {
    router.push(`/products/${productId}`);
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
    setSearchQuery("");
  }

  const initials = user
    ? user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "";

  const isSplash = useIsSplashActive();
  if (pathname === "/splash" || isSplash || pathname.startsWith("/checkout")) return null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0C222B]/95 backdrop-blur-md text-white border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.18)] print:hidden">

        {/* ── Mobile full-screen search overlay ── */}
        {mobileSearchOpen && (
          <div className="sm:hidden fixed inset-0 z-50 bg-[#0C222B] flex flex-col">
            {/* Search bar row */}
            <div className="flex items-center gap-2 px-3 py-3 border-b border-white/10">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <div className="flex items-center bg-white rounded-full px-3 py-2 gap-2">
                  <Search className="w-4 h-4 text-[#17A890] shrink-0" />
                  <input
                    ref={mobileInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search groceries, brands…"
                    className="flex-1 bg-transparent text-[#102B35] placeholder:text-slate-400 text-sm outline-none"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")}>
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>
              </form>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="text-slate-300 text-xs font-bold px-1 py-1 shrink-0"
              >
                Cancel
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {searchResults.length} suggestions
                  </div>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/10 overflow-hidden shrink-0">
                        {product.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{product.name}</p>
                        <p className="text-xs text-slate-400 truncate">{product.brand} · ₹{product.price}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
                      setMobileSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-full py-4 text-sm font-bold text-[#17A890] text-center"
                  >
                    See all results for &ldquo;{searchQuery}&rdquo; →
                  </button>
                </>
              ) : searchQuery.trim() ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Search className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No results for &ldquo;{searchQuery}&rdquo;</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <Sparkles className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">Start typing to search</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-3 sm:px-5 lg:px-7 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4">

            {/* ── LEFT: Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-hidden shrink-0"
              aria-label="SmartCart AI Home"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#17A890] via-[#20be9f] to-[#25d3b6] flex items-center justify-center shadow-md shadow-[#17A890]/25 group-hover:scale-105 transition-all duration-200 shrink-0 overflow-hidden">
                <Image
                  src="/images/smartcart-icon.png"
                  alt="SmartCart AI"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25d3b6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25d3b6]" />
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-black text-sm sm:text-base tracking-tight text-white flex items-center">
                  SmartCart
                  <span className="text-[#25d3b6] ml-1 flex items-center">
                    AI<span className="text-[11px] text-[#25d3b6] ml-0.5 -mt-1.5 font-bold">✦</span>
                  </span>
                </span>
                <span className="hidden sm:block text-[9px] text-slate-300 font-extrabold tracking-wider uppercase">
                  Smart Shopping • Faster Checkout
                </span>
              </div>
            </Link>

            {/* ── CENTER: Search bar (hidden on mobile, shown sm+) ── */}
            <div className="hidden sm:flex flex-1 max-w-xl relative min-w-0 mx-2" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative flex items-center bg-white rounded-full shadow-sm hover:shadow-md focus-within:shadow-xl focus-within:ring-3 focus-within:ring-[#17A890]/30 transition-all duration-200">
                  <Search className="w-4 h-4 text-[#17A890] shrink-0 ml-4 pointer-events-none stroke-[2.2]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search fresh groceries, dairy, snacks, brands…"
                    className="w-full bg-transparent text-[#102B35] placeholder:text-slate-400 text-sm font-medium pl-2.5 pr-20 py-2.5 outline-none rounded-full"
                    aria-label="Search products"
                  />
                  <div className="absolute right-2.5 flex items-center gap-1">
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        href="/scan"
                        className="flex items-center gap-1 bg-[#17A890]/10 hover:bg-[#17A890]/20 text-[#0F766E] px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase transition-colors"
                      >
                        <ScanLine className="w-3 h-3 text-[#17A890]" />
                        <span>Scan</span>
                      </Link>
                    )}
                  </div>
                </div>
              </form>

              {/* Desktop search results dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5EBE8] z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-2 bg-[#F7F9F8] border-b border-[#E5EBE8] flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Product Suggestions
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {searchResults.length} matches
                    </span>
                  </div>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.id)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#F7F9F8] transition-colors text-left border-b border-[#F0F4F2] last:border-0 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden border border-[#E5EBE8]">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#102B35] truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-500 font-medium truncate">{product.brand}</span>
                          <span className="text-[10px] font-black text-[#17A890]">₹{product.price}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchFocused(false);
                      setSearchQuery("");
                    }}
                    className="w-full px-3 py-2.5 text-xs font-bold text-[#17A890] hover:bg-teal-50 transition-colors text-center cursor-pointer border-t border-[#E5EBE8]"
                  >
                    See all results for &ldquo;{searchQuery}&rdquo; →
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT: Mobile search icon + Notifications + Profile ── */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">

              {/* Mobile search tap button */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="sm:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-100 transition-all"
                aria-label="Open search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setIsNotifOpen((v) => !v); setIsProfileOpen(false); }}
                  aria-label={`Notifications${mounted && unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-100 hover:text-white transition-all hover:scale-105 active:scale-95 relative shadow-sm cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {mounted && unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#FF5757] ring-2 ring-[#0C222B] flex items-center justify-center text-[9px] font-black text-white px-1 shadow-sm animate-in zoom-in-75">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute right-0 mt-2.5 w-80 bg-white text-[#18252B] rounded-2xl shadow-2xl border border-[#E5EBE8] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5EBE8] bg-[#F7F9F8]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-[#102B35]">Shopping Alerts</span>
                          {mounted && unreadCount > 0 && (
                            <span className="text-[10px] font-black text-white bg-[#17A890] rounded-full px-2 py-0.5">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <Link href="/notifications" onClick={() => setIsNotifOpen(false)} className="text-[11px] font-bold text-[#17A890] hover:underline">
                          View all
                        </Link>
                      </div>

                      {previewNotifs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                          <BellOff className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="text-xs text-slate-500 font-medium">No shopping alerts right now</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#F0F4F2] max-h-72 overflow-y-auto">
                          {previewNotifs.map((n) => (
                            <button
                              key={n.id}
                              onClick={() => handleNotifClick(n.id, n.actions?.[0]?.payload)}
                              className={`w-full text-left px-4 py-3 hover:bg-[#F7F9F8] transition-colors flex items-start gap-3 cursor-pointer ${!n.isRead ? "bg-teal-50/50" : ""}`}
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

                      <div className="grid grid-cols-2 divide-x divide-[#E5EBE8] border-t border-[#E5EBE8] bg-[#F7F9F8]">
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

              {/* Profile Button — simple avatar circle with first letter */}
              <div className="relative">
                <button
                  onClick={() => { setIsProfileOpen((v) => !v); setIsNotifOpen(false); }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#17A890] to-[#0f7a66] flex items-center justify-center shrink-0 ring-2 ring-amber-400/80 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label={mounted && isAuthenticated ? "Profile menu" : "Sign in"}
                >
                  <span className="font-black text-sm text-white select-none">
                    {mounted && isAuthenticated && user
                      ? user.name.charAt(0).toUpperCase()
                      : <User className="w-4 h-4 text-white" />}
                  </span>
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-2xl border border-[#E5EBE8] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      {mounted && isAuthenticated && user ? (
                        <>
                          <div className="px-4 py-3.5 bg-gradient-to-br from-[#F7F9F8] to-teal-50/40 border-b border-[#E5EBE8]">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-black text-[#102B35] truncate">{user.name}</p>
                              <span className="text-[9px] font-black text-amber-800 bg-amber-400/30 px-1.5 py-0.5 rounded-full border border-amber-300/60">
                                {user.membershipTier}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                          </div>
                          <div className="py-1">
                            {[
                              { label: "My Profile", href: "/profile" },
                              { label: "My Orders & Receipts", href: "/orders" },
                              { label: "Shopping History & Insights", href: "/my-shopping" },
                              { label: "Alerts & Notifications", href: "/notifications" },
                              { label: "Account Settings", href: "/settings" },
                              { label: "Help & Customer Support", href: "/help" },
                            ].map(({ label, href }) => (
                              <Link
                                key={href}
                                href={href}
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#18252B] hover:bg-[#F7F9F8] hover:text-[#17A890] transition-colors"
                              >
                                {label}
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-4 space-y-3">
                          <p className="text-xs text-slate-600 font-medium">Sign in to access your profile, receipts, and membership rewards.</p>
                          <Link
                            href="/login"
                            onClick={() => setIsProfileOpen(false)}
                            className="block w-full text-center py-2.5 bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                          >
                            Sign In / Register
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
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
