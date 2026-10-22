"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import {
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const { showToast } = useCart();

  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Please enter your registered email or phone number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await requestPasswordReset(identifier);
      if (res.success) {
        setIsSuccess(true);
        showToast("Reset Link Dispatched", "Check your inbox or SMS for instructions.");
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("Unable to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-4 space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-[#17A890]/15 text-[#17A890] flex items-center justify-center mx-auto mb-2 border border-[#17A890]/30 shadow-xs">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black text-[#102B35] tracking-tight">
          Forgot Password?
        </h1>
        <p className="text-xs text-[#718096]">
          Enter your registered email or phone number to receive recovery instructions.
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

      {/* Success State */}
      {isSuccess ? (
        <div className="bg-white rounded-3xl border border-[#E5EBE8] p-6 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16865C] flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#18252B]">
              Instructions Dispatched
            </h2>
            <p className="text-xs text-[#718096] mt-1 leading-relaxed">
              We sent a secure password reset link to:
            </p>
            <p className="text-xs font-mono font-bold text-[#102B35] mt-1 bg-[#F7F9F8] py-1 px-3 rounded-md inline-block border border-[#E5EBE8]">
              {identifier}
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <Link
              href="/reset-password"
              className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors block"
            >
              <span>Continue to Set New Password</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full bg-white border border-[#E5EBE8] hover:bg-slate-50 text-[#18252B] font-bold text-xs py-2.5 px-4 rounded-xl block transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        /* Input Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#18252B] block">
              Registered Email or Mobile Number
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. shiva@example.com or 9876543210"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all"
              />
            </div>
            <p className="text-[11px] text-[#718096]">
              A verification code or reset link will be sent to this destination.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Instructions...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Return to Login */}
      <div className="text-center text-xs">
        <Link
          href="/login"
          className="text-[#718096] hover:text-[#18252B] inline-flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
