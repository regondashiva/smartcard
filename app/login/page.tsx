"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Phone,
  AlertCircle,
  ArrowRight,
  ShoppingCart,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithOtp, continueAsGuest } = useAuth();
  const { showToast } = useCart();

  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Demo credentials auto-fill
  const handleDemoFill = () => {
    setIdentifier("shiva.shopper@smartcart-demo.in");
    setPassword("SmartCart#2024");
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage(
        authMode === "otp"
          ? "Please enter your 10-digit mobile number."
          : "Please enter your registered email or mobile number."
      );
      return;
    }

    if (authMode === "password" && !password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === "otp") {
        const res = await loginWithOtp(identifier);
        if (res.success) {
          showToast("OTP Sent", "Enter the 6-digit verification code.");
          router.push("/verify-otp");
        } else {
          setErrorMessage(res.error || "Failed to send OTP.");
        }
      } else {
        const res = await login(identifier, password);
        if (res.success) {
          showToast("Welcome Back!", "Logged into SmartCart AI successfully.");
          router.push("/");
        } else {
          setErrorMessage(res.error || "Invalid credentials. Please verify.");
        }
      }
    } catch {
      setErrorMessage("An unexpected error occurred during sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-2 space-y-5">
      {/* Brand Header */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-[#17A890]/15 text-[#17A890] flex items-center justify-center mx-auto mb-2 border border-[#17A890]/30 shadow-xs">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black text-[#102B35] tracking-tight">
          Welcome to SmartCart AI
        </h1>
        <p className="text-xs text-[#718096]">
          Sign in to access your saved cart, club points & live billing
        </p>
      </div>

      {/* Auth Mode Toggle (Password vs OTP) */}
      <div className="flex bg-[#F7F9F8] p-1 rounded-2xl border border-[#E5EBE8]">
        <button
          type="button"
          onClick={() => {
            setAuthMode("password");
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            authMode === "password"
              ? "bg-white text-[#102B35] shadow-xs"
              : "text-[#718096] hover:text-[#18252B]"
          }`}
        >
          Password Login
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("otp");
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            authMode === "otp"
              ? "bg-white text-[#102B35] shadow-xs"
              : "text-[#718096] hover:text-[#18252B]"
          }`}
        >
          Login via Mobile OTP
        </button>
      </div>

      {/* Demo Credentials Helper Pill */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-[#17A890] shrink-0" />
          <p className="text-[11px] text-teal-900 truncate">
            <span className="font-bold">Test Account:</span> Shiva (Gold Member)
          </p>
        </div>
        <button
          type="button"
          onClick={handleDemoFill}
          className="text-[11px] font-bold text-[#17A890] hover:text-[#128673] underline shrink-0 cursor-pointer"
        >
          Auto Fill
        </button>
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

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-sm space-y-4">
        {/* Identifier Field (Email or Mobile) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            {authMode === "otp" ? "Mobile Number (India)" : "Email or Mobile Number"}
          </label>
          <div className="relative flex items-center">
            {authMode === "otp" ? (
              <Phone className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            ) : (
              <User className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            )}
            <input
              type={authMode === "otp" ? "tel" : "text"}
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                authMode === "otp"
                  ? "Enter 10-digit mobile number"
                  : "e.g. shiva@example.com or 9876543210"
              }
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Password Field (Only for password mode) */}
        {authMode === "password" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#18252B]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-[#17A890] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#718096] hover:text-[#18252B] p-1 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Remember me checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-[#CBD5E1] text-[#17A890] focus:ring-[#17A890] h-4 w-4 cursor-pointer"
            />
            <span className="text-xs text-[#718096]">Remember this device</span>
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
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>{authMode === "otp" ? "Send Mobile OTP" : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="text-center space-y-2 text-xs">
        <p className="text-[#718096]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#17A890] font-bold hover:underline"
          >
            Create account
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
            Continue as Guest (No login needed)
          </button>
        </div>
      </div>
    </div>
  );
}
