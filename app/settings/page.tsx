"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import { getFullOrders } from "@/lib/receipt-service";
import {
  loadShoppingPreferences,
  saveShoppingPreferences,
  exportCustomerAccountArchive,
} from "@/lib/settings-service";
import { ShoppingPreferences } from "@/types/settings";
import { CATEGORIES } from "@/data/categories";
import { LogoutModal } from "@/components/auth/logout-modal";
import {
  User,
  ShieldCheck,
  Bell,
  Sliders,
  Lock,
  Download,
  Trash2,
  HelpCircle,
  Headphones,
  Info,
  LogOut,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Coins,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Store,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { clearCart, endSession, selectedStore } = useCart();

  const [preferences, setPreferences] = useState<ShoppingPreferences>(
    loadShoppingPreferences()
  );
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);

  useEffect(() => {
    setPreferences(loadShoppingPreferences());
  }, []);

  const handleTogglePref = (
    key: keyof ShoppingPreferences,
    value: boolean | string
  ) => {
    const updated = saveShoppingPreferences({ [key]: value });
    setPreferences(updated);
    setSaveSuccessMsg("Preferences saved successfully");
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleCategoryToggle = (catId: string) => {
    const current = preferences.preferredCategories;
    const next = current.includes(catId)
      ? current.filter((c) => c !== catId)
      : [...current, catId];
    const updated = saveShoppingPreferences({ preferredCategories: next });
    setPreferences(updated);
  };

  const handleExportData = () => {
    const orders = getFullOrders();
    exportCustomerAccountArchive(user, orders, preferences);
    setSaveSuccessMsg("Account data archive downloaded as JSON");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleConfirmLogout = () => {
    logout();
    clearCart();
    endSession();
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  const handleConfirmAccountDeletion = () => {
    if (deleteConfirmText.trim().toLowerCase() !== "delete my account") return;
    setIsDeletedSuccess(true);
    setTimeout(() => {
      logout();
      clearCart();
      endSession();
      setIsDeleteModalOpen(false);
      router.push("/");
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 space-y-5">
      {/* ─── Top Header ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2.5">
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-white border border-[#E5EBE8] text-[#102B35] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs"
            aria-label="Back to profile"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-extrabold text-[#102B35]">
              Customer Settings
            </h1>
            <p className="text-[11px] text-slate-500">
              Manage your profile, preferences, privacy, and support
            </p>
          </div>
        </div>

        <span className="bg-[#17A890]/15 text-[#17A890] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#17A890]/30">
          Module 12 • Final
        </span>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* ─── SECTION 1: Account and Profile ─── */}
      <section className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#102B35] text-white flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
                Account & Profile
              </h2>
              <p className="text-[10px] text-slate-500">
                Personal identity and SmartClub membership tier
              </p>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="text-xs font-bold text-[#17A890] hover:underline"
          >
            Edit Profile
          </Link>
        </div>

        {isAuthenticated && user ? (
          <div className="flex items-center justify-between bg-[#F7F9F8] p-3 rounded-xl border border-[#E5EBE8]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#17A890] text-[#102B35] font-black text-sm flex items-center justify-center shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-[#102B35] truncate">
                    {user.name}
                  </h3>
                  <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                    {user.membershipTier}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <p className="text-[10px] text-slate-400 font-mono">{user.phone}</p>
              </div>
            </div>

            <Link
              href="/profile"
              className="text-slate-400 hover:text-[#102B35] p-1"
              aria-label="View Full Profile"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs font-bold text-[#102B35]">Guest Shopper</p>
              <p className="text-[11px] text-slate-500">
                Sign in to save purchase history and sync preferences across devices
              </p>
            </div>
            <Link
              href="/login"
              className="bg-[#17A890] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#128673] transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>

      {/* ─── SECTION 2: Security & Authentication ─── */}
      <section className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E5EBE8]">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
              Security & Access
            </h2>
            <p className="text-[10px] text-slate-500">
              Account protection and password management
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F0F4F2]">
          <Link
            href="/profile/security"
            className="py-2.5 flex items-center justify-between hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-bold text-[#102B35]">
                  Password & Biometrics
                </p>
                <p className="text-[10px] text-slate-500">
                  Update your master password or configure biometric unlock
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/reset-password"
            className="py-2.5 flex items-center justify-between hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-bold text-[#102B35]">
                  Reset Forgotten Password
                </p>
                <p className="text-[10px] text-slate-500">
                  Request password reset verification code
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </section>

      {/* ─── SECTION 3: Notification Preferences ─── */}
      <section className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#17A890] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
                Notifications & Alerts
              </h2>
              <p className="text-[10px] text-slate-500">
                Cart alerts, price drops, and quiet hours
              </p>
            </div>
          </div>
          <Link
            href="/settings/notifications"
            className="text-xs font-bold text-[#17A890] hover:underline"
          >
            Manage Alerts
          </Link>
        </div>

        <Link
          href="/settings/notifications"
          className="flex items-center justify-between bg-[#F7F9F8] p-3 rounded-xl border border-[#E5EBE8] hover:bg-teal-50/50 transition-colors"
        >
          <div className="text-xs">
            <p className="font-bold text-[#102B35]">Custom Push Channels</p>
            <p className="text-[11px] text-slate-500">
              Configure order updates, verification mismatches, and Do Not Disturb hours
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#17A890]" />
        </Link>
      </section>

      {/* ─── SECTION 4: Shopping Preferences ─── */}
      <section className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E5EBE8]">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
              Shopping Preferences
            </h2>
            <p className="text-[10px] text-slate-500">
              Tailor your in-store discovery and regional formatting
            </p>
          </div>
        </div>

        {/* Currency & Region Format */}
        <div className="flex items-center justify-between py-1.5">
          <div>
            <span className="text-xs font-bold text-[#102B35] flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#17A890]" />
              Currency Display
            </span>
            <span className="text-[10px] text-slate-500">
              Prices formatted in official Indian Rupee (₹ INR)
            </span>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-[#102B35] px-2.5 py-1 rounded-lg border border-[#E5EBE8]">
            ₹ INR (India)
          </span>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between py-1.5 border-t border-[#F0F4F2]">
          <div>
            <span className="text-xs font-bold text-[#102B35] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              Interface Language
            </span>
            <span className="text-[10px] text-slate-500">
              Active supermarket display language
            </span>
          </div>
          <select
            value={preferences.preferredLanguage}
            onChange={(e) =>
              handleTogglePref("preferredLanguage", e.target.value as any)
            }
            className="text-xs font-bold text-[#102B35] bg-[#F7F9F8] border border-[#E5EBE8] rounded-lg px-2.5 py-1 outline-none focus:border-[#17A890]"
          >
            <option value="en">English (India)</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
            <option value="te">Telugu (తెలుగు)</option>
          </select>
        </div>

        {/* Preferred Categories */}
        <div className="space-y-2 pt-2 border-t border-[#F0F4F2]">
          <span className="text-xs font-bold text-[#102B35] block">
            Preferred Product Categories (Pantry Staples)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
              const isSelected = preferences.preferredCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                    isSelected
                      ? "bg-[#17A890] text-white border-[#17A890]"
                      : "bg-[#F7F9F8] text-slate-600 border-[#E5EBE8] hover:border-slate-300"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: Privacy and Personalization ─── */}
      <section className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E5EBE8]">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
              Privacy & Personalization
            </h2>
            <p className="text-[10px] text-slate-500">
              Manage AI recommendations and authoritative data exports
            </p>
          </div>
        </div>

        {/* AI Recommendations Toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-bold text-[#102B35]">
              Personalized AI Recommendations
            </p>
            <p className="text-[10px] text-slate-500 max-w-sm">
              Allow Module 11 Assistant and Module 9 Analytics to use previous purchase receipts to suggest relevant staples
            </p>
          </div>
          <button
            onClick={() =>
              handleTogglePref(
                "enablePersonalizedRecommendations",
                !preferences.enablePersonalizedRecommendations
              )
            }
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              preferences.enablePersonalizedRecommendations
                ? "bg-[#17A890]"
                : "bg-slate-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                preferences.enablePersonalizedRecommendations
                  ? "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Export Account Data */}
        <div className="flex items-center justify-between py-2 border-t border-[#F0F4F2]">
          <div>
            <p className="text-xs font-bold text-[#102B35]">
              Export My Account Archive
            </p>
            <p className="text-[10px] text-slate-500">
              Download your full profile, order receipts, and settings as a clean JSON file
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 bg-[#F7F9F8] hover:bg-[#EEF2F0] text-[#102B35] font-bold text-xs px-3 py-1.5 rounded-xl border border-[#E5EBE8] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#17A890]" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Account Deletion Request */}
        <div className="flex items-center justify-between py-2 border-t border-red-100 bg-red-50/50 -mx-4 px-4 rounded-b-xl">
          <div>
            <p className="text-xs font-bold text-red-700">Delete Account</p>
            <p className="text-[10px] text-red-500">
              Permanently purge your account, saved receipts, and loyalty points
            </p>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-xs font-bold text-red-700 bg-white border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            Request Deletion
          </button>
        </div>
      </section>

      {/* ─── SECTION 6: Help and Support ─── */}
      <section className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E5EBE8]">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
              Help & Customer Support
            </h2>
            <p className="text-[10px] text-slate-500">
              Shopper guides, FAQs, and store support tickets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Link
            href="/help"
            className="p-3 rounded-xl bg-[#F7F9F8] hover:bg-blue-50/60 border border-[#E5EBE8] transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-blue-700 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#102B35]">Help Center & FAQ</p>
                <p className="text-[10px] text-slate-500">Guides for all 12 modules</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </Link>

          <Link
            href="/support"
            className="p-3 rounded-xl bg-[#F7F9F8] hover:bg-teal-50/60 border border-[#E5EBE8] transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#17A890]/15 text-[#17A890] flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#102B35]">Customer Support</p>
                <p className="text-[10px] text-slate-500">Submit a store ticket</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#17A890]" />
          </Link>
        </div>
      </section>

      {/* ─── SECTION 7: About SmartCart AI ─── */}
      <section className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
                About SmartCart AI
              </h2>
              <p className="text-[10px] text-slate-500">
                Self-Checkout Application Version & Architecture
              </p>
            </div>
          </div>
          <Link
            href="/about"
            className="text-xs font-bold text-[#17A890] hover:underline"
          >
            View Details
          </Link>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 bg-[#F7F9F8] p-3 rounded-xl border border-[#E5EBE8]">
          <div>
            <p className="font-bold text-[#102B35]">SmartCart AI v1.2.0</p>
            <p className="text-[10px] text-slate-500">
              Next.js 16 App Router • React 19 • Tailwind CSS • shadcn/ui
            </p>
          </div>
          <Link
            href="/about"
            className="text-xs font-bold text-[#17A890] flex items-center gap-1 hover:underline"
          >
            <span>Architecture</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* ─── SECTION 8: Sign Out ─── */}
      {isAuthenticated && (
        <div className="pt-2">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of SmartCart</span>
          </button>
        </div>
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      {/* Account Deletion Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-white rounded-2xl border border-red-200 p-5 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-extrabold text-[#102B35]">
                Confirm Account Deletion
              </h3>
              <p className="text-xs text-slate-500">
                This will permanently delete your account profile, SmartClub loyalty rewards, and stored preferences.
              </p>
            </div>

            {isDeletedSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs font-bold text-emerald-800">
                Account successfully scheduled for purge. Signing out...
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-[11px] text-red-700">
                  Type <strong>delete my account</strong> below to confirm:
                </div>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="delete my account"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-red-500"
                />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeleteConfirmText("");
                    }}
                    className="py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAccountDeletion}
                    disabled={
                      deleteConfirmText.trim().toLowerCase() !== "delete my account"
                    }
                    className="py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
