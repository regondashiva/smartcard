"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signup, continueAsGuest } = useAuth();
  const { showToast } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!hasMinLength || !hasNumber) {
      setErrorMessage("Password must be at least 8 characters and include a number.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }
    if (!termsAccepted) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      // Format phone with India prefix if not present
      const formattedPhone = phone.startsWith("+91")
        ? phone
        : `+91 ${phone.replace(/\D/g, "").slice(-10)}`;

      const res = await signup({
        name,
        email,
        phone: formattedPhone,
        password,
        termsAccepted,
      });

      if (res.success) {
        showToast("Account Created", "Please verify your mobile number with the OTP.");
        router.push("/verify-otp");
      } else {
        setErrorMessage(res.error || "Failed to create account. Please try again.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-2 space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-14 h-14 rounded-2xl bg-[#17A890]/15 flex items-center justify-center mx-auto mb-2 border border-[#17A890]/30 shadow-xs overflow-hidden">
          <Image
            src="/images/smartcart-icon.png"
            alt="SmartCart AI"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        <h1 className="text-xl font-black text-[#102B35] tracking-tight">
          Create SmartCart Account
        </h1>
        <p className="text-xs text-[#718096]">
          Join SmartClub for seamless in-aisle self-checkout
        </p>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-sm space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shiva Ramakrishna"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. shiva@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Mobile Number with India Prefix */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Mobile Number (India) <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-[#18252B] border-r border-[#CBD5E1] pr-2 pointer-events-none">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
              maxLength={12}
              className="w-full pl-18 pr-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all font-mono"
            />
          </div>
          <p className="text-[10px] text-[#718096]">
            We will send a 6-digit OTP for instant phone verification.
          </p>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create strong password"
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

          {/* Password Requirements Checklist */}
          {password && (
            <div className="pt-1.5 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasMinLength ? "text-emerald-600" : "text-slate-300"
                  }`}
                />
                <span className={hasMinLength ? "text-emerald-700 font-medium" : "text-[#718096]"}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasNumber ? "text-emerald-600" : "text-slate-300"
                  }`}
                />
                <span className={hasNumber ? "text-emerald-700 font-medium" : "text-[#718096]"}>
                  Includes at least 1 number
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasUppercase ? "text-emerald-600" : "text-slate-300"
                  }`}
                />
                <span className={hasUppercase ? "text-emerald-700 font-medium" : "text-[#718096]"}>
                  Includes 1 uppercase letter (optional)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
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
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-[11px] text-red-600 font-medium">
              Passwords do not match.
            </p>
          )}
        </div>

        {/* Terms and Privacy Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-[#CBD5E1] text-[#17A890] focus:ring-[#17A890] h-4 w-4 cursor-pointer"
            />
            <span className="text-[11px] text-[#718096] leading-snug">
              I agree to the{" "}
              <span className="text-[#17A890] font-semibold underline">Terms of Service</span> and{" "}
              <span className="text-[#17A890] font-semibold underline">Privacy Policy</span>.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="text-center space-y-2 text-xs">
        <p className="text-[#718096]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#17A890] font-bold hover:underline"
          >
            Log in here
          </Link>
        </p>

        <div>
          <button
            onClick={() => {
              continueAsGuest();
              router.push("/");
            }}
            className="text-[#718096] hover:text-[#18252B] underline transition-colors cursor-pointer"
          >
            Continue as Guest (Browse Only)
          </button>
        </div>
      </div>
    </div>
  );
}
