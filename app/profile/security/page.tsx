"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import {
  ArrowLeft,
  Shield,
  Lock,
  Smartphone,
  Fingerprint,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Monitor,
} from "lucide-react";

export default function SecuritySettingsPage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useCart();

  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? false);
  const [biometric, setBiometric] = useState(user?.biometricLoginEnabled ?? true);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: "sess_1",
      device: "Pixel 8 Pro (Android 14)",
      location: "Bengaluru, India",
      ip: "192.168.1.11",
      isCurrent: true,
      lastActive: "Active Now",
    },
    {
      id: "sess_2",
      device: "SmartCart In-Store Tablet #12",
      location: "Indiranagar Store",
      ip: "10.0.4.82",
      isCurrent: false,
      lastActive: "2 hours ago",
    },
  ]);

  const handleToggle2FA = () => {
    const nextVal = !twoFactor;
    setTwoFactor(nextVal);
    updateProfile({ twoFactorEnabled: nextVal });
    showToast(
      nextVal ? "2FA Enabled" : "2FA Disabled",
      nextVal ? "SMS OTP verification required on login." : "Two-factor disabled.",
      nextVal ? "success" : "info"
    );
  };

  const handleToggleBiometric = () => {
    const nextVal = !biometric;
    setBiometric(nextVal);
    updateProfile({ biometricLoginEnabled: nextVal });
    showToast(
      nextVal ? "Biometrics Enabled" : "Biometrics Disabled",
      nextVal ? "Fingerprint / Face unlock active." : "Biometric unlock disabled."
    );
  };

  const handleSignOutOtherSessions = () => {
    setActiveSessions(activeSessions.filter((s) => s.isCurrent));
    showToast("Sessions Terminated", "Signed out of all other devices successfully.", "info");
  };

  return (
    <div className="max-w-md mx-auto py-2 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors"
            aria-label="Back to profile"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#102B35]">Security & Privacy</h1>
            <p className="text-[11px] text-[#718096]">Account protection & device sessions</p>
          </div>
        </div>
      </div>

      {/* Security Status Card */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-4 shadow-sm flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16865C] border border-emerald-200 flex items-center justify-center shrink-0">
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-bold text-[#18252B]">Security Status</h2>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
              Strong
            </span>
          </div>
          <p className="text-[11px] text-[#718096] mt-0.5">
            Password active • Verified contact credentials
          </p>
        </div>
      </div>

      {/* Authentication Options */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] overflow-hidden shadow-sm divide-y divide-[#E5EBE8]">
        {/* Change Password */}
        <Link
          href="/reset-password"
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#102B35] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Change Password</p>
              <p className="text-[11px] text-[#718096]">Last updated 2 months ago</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>

        {/* Two-Factor Authentication Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#17A890]/15 text-[#17A890] flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-[#718096]">Require SMS OTP code at sign in</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={handleToggle2FA}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17A890]"></div>
          </label>
        </div>

        {/* Biometric Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#17A890] flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18252B]">Biometric Unlock</p>
              <p className="text-[11px] text-[#718096]">Fast fingerprint or face check on device</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={biometric}
              onChange={handleToggleBiometric}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17A890]"></div>
          </label>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#102B35]">
            <Monitor className="w-4 h-4 text-[#17A890]" />
            <span>Active Login Sessions ({activeSessions.length})</span>
          </div>
          {activeSessions.length > 1 && (
            <button
              onClick={handleSignOutOtherSessions}
              className="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
            >
              Sign Out Others
            </button>
          )}
        </div>

        <div className="space-y-2">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-2xl bg-[#F7F9F8] border border-[#E5EBE8] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    session.isCurrent ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-[#18252B]">{session.device}</p>
                    {session.isCurrent && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        This Phone
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#718096] mt-0.5">
                    {session.location} • {session.lastActive}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/70 rounded-3xl border border-red-200 p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Account Deletion</span>
        </div>
        <p className="text-[11px] text-red-700 leading-snug">
          Permanently delete your SmartCart profile, accumulated loyalty points, and purchase history.
        </p>
        <button
          onClick={() => showToast("Request Logged", "Account deletion request sent to store administration.", "warning")}
          className="text-xs font-bold text-red-700 hover:text-red-800 underline pt-1 cursor-pointer"
        >
          Request Account Deletion
        </button>
      </div>
    </div>
  );
}
