"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { LogoutModal } from "@/components/auth/logout-modal";
import {
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  CreditCard,
  LogOut,
  Edit3,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Compass,
  ChevronRight,
  Award,
  Zap,
  ShoppingBag,
  RotateCcw,
  Receipt,
  QrCode,
  TrendingUp,
  Settings,
  HelpCircle,
  Headphones,
  Info,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, resetOnboarding } = useAuth();
  const { session, selectedStore, clearCart, endSession, getItemCount } = useCart();
  const itemCount = getItemCount();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    clearCart();
    endSession();
    setIsLogoutModalOpen(false);
  };

  const handleRevisitOnboarding = () => {
    resetOnboarding();
    router.push("/onboarding");
  };

  // If Guest (Not Logged In)
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-4 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-[#718096] flex items-center justify-center mx-auto border border-[#E5EBE8] shadow-xs">
            <User className="w-8 h-8 text-[#718096]" />
          </div>
          <h1 className="text-xl font-black text-[#102B35]">
            Guest Shopper
          </h1>
          <p className="text-xs text-[#718096] max-w-xs mx-auto">
            Sign in or register to save your shopping history, earn SmartClub rewards, and enable digital checkout.
          </p>
        </div>

        {/* Auth CTA Card */}
        <div className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-sm space-y-3">
          <Link
            href="/login"
            className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors block text-center"
          >
            <span>Sign In to Existing Account</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <Link
            href="/register"
            className="w-full bg-white hover:bg-slate-50 text-[#102B35] border border-[#E5EBE8] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors block text-center"
          >
            Create New Account
          </Link>
        </div>

        {/* Benefits of joining */}
        <div className="bg-white rounded-3xl border border-[#E5EBE8] p-4 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
            SmartClub Membership Perks
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#18252B]">Live Digital Receipts</p>
                <p className="text-[11px] text-[#718096]">Exit gates scan QR receipts generated directly from your phone.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#17A890] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#18252B]">Exclusive Store Savings</p>
                <p className="text-[11px] text-[#718096]">Instant club member discounts applied automatically in-aisle.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick action to test onboarding */}
        <div className="text-center">
          <button
            onClick={handleRevisitOnboarding}
            className="text-xs font-semibold text-[#17A890] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>View Welcome Onboarding Flow</span>
          </button>
        </div>
      </div>
    );
  }

  // Authenticated Customer Profile
  return (
    <div className="max-w-md mx-auto py-2 space-y-4">
      {/* Profile Header */}
      <div className="flex items-center justify-between pb-1 border-b border-[#E5EBE8]">
        <div>
          <h1 className="text-base font-bold text-[#102B35]">Customer Profile</h1>
          <p className="text-[11px] text-[#718096]">SmartCart AI Member Hub</p>
        </div>
        <Link
          href="/profile/edit"
          className="text-xs font-bold text-[#17A890] hover:text-[#128673] flex items-center gap-1 bg-[#17A890]/10 px-2.5 py-1 rounded-full border border-[#17A890]/20 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Link>
      </div>

      {/* Shopper Identification Card */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-4 shadow-sm flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#17A890] to-[#25d3b6] text-[#102B35] font-black text-xl flex items-center justify-center shadow-md shrink-0">
          <User className="w-7 h-7 text-[#102B35]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#18252B] truncate">{user.name}</h2>
            <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.2 rounded-full shadow-2xs shrink-0">
              {user.membershipTier.replace("SmartClub ", "")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#718096]">
            <Mail className="w-3 h-3 text-[#17A890]" />
            <span className="truncate">{user.email}</span>
            {user.isEmailVerified && (
              <span title="Verified email">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#718096]">
            <Phone className="w-3 h-3 text-[#17A890]" />
            <span className="font-mono">{user.phone}</span>
            {user.isPhoneVerified && (
              <span title="Verified phone">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SmartClub Membership Card */}
      <div className="bg-gradient-to-tr from-[#102B35] via-[#143d4c] to-[#175263] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden border border-[#17A890]/30">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#17A890]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold tracking-wider uppercase text-[#17A890] text-[10px]">
            {user.membershipTier} Pass
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            ID: SC-84920
          </span>
        </div>

        {/* Member Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div>
            <span className="text-[10px] text-slate-300 uppercase block">Club Points</span>
            <span className="text-base font-black text-amber-400 mt-0.5 block">
              {user.stats.clubPoints}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-300 uppercase block">Total Savings</span>
            <span className="text-base font-black text-emerald-400 mt-0.5 block">
              {formatCurrency(user.stats.totalSavings)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-300 uppercase block">Store Trips</span>
            <span className="text-base font-black text-white mt-0.5 block">
              {user.stats.totalTrips}
            </span>
          </div>
        </div>

        <div className="mt-3.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#17A890]" />
            <span className="truncate">{selectedStore.name}</span>
          </span>
          <span className="text-[10px] text-slate-400">Since {user.memberSince}</span>
        </div>
      </div>

      {/* Account Settings Menu */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] overflow-hidden shadow-sm divide-y divide-[#E5EBE8]">
        <Link
          href="/my-shopping"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Shopping Insights &amp; Buy Again</p>
              <p className="text-[10px] text-[#718096]">Monthly spending breakdown, 1-tap reorders &amp; recommendations</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <Link
          href="/orders"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#17A890] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">My Orders &amp; Digital Receipts</p>
              <p className="text-[10px] text-[#718096]">Past shopping bills, tax invoices &amp; exit passes</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <Link
          href="/exit-scanner"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#102B35]/10 text-[#102B35] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Store Exit Gate Scanner</p>
              <p className="text-[10px] text-[#718096]">Kiosk mode to validate customer exit passes</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <Link
          href="/profile/edit"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#102B35] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Personal Information</p>
              <p className="text-[10px] text-[#718096]">Name, email, phone & preferences</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <Link
          href="/profile/security"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#17A890] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Security & 2FA</p>
              <p className="text-[10px] text-[#718096]">Password, biometrics & login devices</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <Link
          href="/verify-email"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16865C] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#18252B]">Email Verification</p>
                {user.isEmailVerified ? (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Verified
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    Pending
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#718096]">Receipt delivery & communication</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <Link
          href="/settings"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Settings &amp; Preferences</p>
              <p className="text-[10px] text-[#718096]">Notifications, language, privacy &amp; export</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <Link
          href="/help"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Help Center &amp; Guides</p>
              <p className="text-[10px] text-[#718096]">FAQs for scanning, billing, and exit passes</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <Link
          href="/support"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#17A890] flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Customer Support Desk</p>
              <p className="text-[10px] text-[#718096]">Submit ticket or track in-store inquiries</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <Link
          href="/about"
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">About SmartCart AI</p>
              <p className="text-[10px] text-[#718096]">Version 1.2.0 • 12-Module Matrix</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        <button
          onClick={handleRevisitOnboarding}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Revisit Welcome Onboarding</p>
              <p className="text-[10px] text-[#718096]">Experience the first-time shopper introduction</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </button>
      </div>

      {/* Dietary Tags Display */}
      {user.dietaryPreferences && user.dietaryPreferences.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#E5EBE8] p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#102B35]">
              Dietary Preferences
            </span>
            <Link
              href="/profile/edit"
              className="text-[10px] font-bold text-[#17A890] hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {user.dietaryPreferences.map((pref, i) => (
              <span
                key={i}
                className="bg-[#17A890]/10 text-[#102B35] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#17A890]/20"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active Session Diagnostics */}
      <div className="bg-[#F7F9F8] rounded-3xl border border-[#E5EBE8] p-4 space-y-2.5 text-xs">
        <div className="flex items-center justify-between font-bold text-[#102B35]">
          <span>Shopping Session Status</span>
          <span className="font-mono text-[11px] text-[#718096]">
            {session.isActive ? session.id : "No Session"}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#718096]">
          <span>Cart Item Count</span>
          <span className="font-bold text-[#102B35]">{itemCount} items</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#718096]">
          <span>Default Branch</span>
          <span className="font-semibold text-[#18252B] truncate max-w-[200px]">
            {selectedStore.name}
          </span>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="pt-1">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full py-3 px-4 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of SmartCart</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
