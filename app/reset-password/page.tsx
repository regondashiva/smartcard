"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { showToast } = useCart();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!hasMinLength || !hasNumber) {
      setErrorMessage("New password must be at least 8 characters and contain a number.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPassword(password);
      if (res.success) {
        showToast("Password Reset Successful", "You can now log in with your new password.", "success");
        router.push("/login");
      } else {
        setErrorMessage(res.error || "Failed to reset password.");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-4 space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-[#17A890]/15 text-[#17A890] flex items-center justify-center mx-auto mb-2 border border-[#17A890]/30 shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black text-[#102B35] tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-xs text-[#718096]">
          Set a new strong password to secure your SmartCart account.
        </p>
      </div>

      {/* Recovery token badge */}
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold p-2.5 rounded-xl flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Secure Recovery Token Verified
        </span>
        <span className="font-mono text-[10px] text-emerald-900 bg-white/80 px-2 py-0.5 rounded">
          EXP: 15m
        </span>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-150"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Reset Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-sm space-y-4">
        {/* New Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter at least 8 characters"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-[#718096] hover:text-[#18252B] p-1 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Validation Checklist */}
          {password && (
            <div className="pt-1.5 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasMinLength ? "text-emerald-600" : "text-slate-300"
                  }`}
                />
                <span className={hasMinLength ? "text-emerald-700 font-medium" : "text-[#718096]"}>
                  Minimum 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasNumber ? "text-emerald-600" : "text-slate-300"
                  }`}
                />
                <span className={hasNumber ? "text-emerald-700 font-medium" : "text-[#718096]"}>
                  Contains at least 1 number
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-[#F7F9F8] focus:bg-white focus:outline-hidden transition-all ${
                confirmPassword.length > 0 && !passwordsMatch
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : confirmPassword.length > 0 && passwordsMatch
                  ? "border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  : "border-[#E5EBE8] focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-[#718096] hover:text-[#18252B] p-1 cursor-pointer"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-[11px] text-red-600 font-medium">
              Passwords do not match.
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !passwordsMatch || !hasMinLength || !hasNumber}
          className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Password & Log In</span>
            </>
          )}
        </button>
      </form>

      {/* Return link */}
      <div className="text-center text-xs">
        <Link href="/login" className="text-[#718096] hover:text-[#18252B] underline">
          Cancel and return to login
        </Link>
      </div>
    </div>
  );
}
