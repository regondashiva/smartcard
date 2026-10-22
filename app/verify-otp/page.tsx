"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { user, pendingVerificationPhone, verifyPhoneOtp } = useAuth();
  const { showToast } = useCart();

  const phone = pendingVerificationPhone || user?.phone || "+91 98765 43210";

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.replace(/\D/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < pasted.length; i++) {
          newDigits[i] = pasted[i];
        }
        setOtpDigits(newDigits);
        const nextIdx = Math.min(pasted.length, 5);
        inputRefs.current[nextIdx]?.focus();
      }
      return;
    }

    const clean = value.replace(/\D/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillDemo = () => {
    setOtpDigits(["1", "2", "3", "4", "5", "6"]);
    setErrorMessage(null);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtpDigits(["", "", "", "", "", ""]);
    showToast("OTP Resent", "A fresh 6-digit code has been dispatched.");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyPhoneOtp(fullOtp);
      if (res.success) {
        showToast("Phone Verified", "Your mobile number has been authenticated.", "success");
        router.push("/profile");
      } else {
        setErrorMessage(res.error || "Invalid OTP code. Please try again.");
      }
    } catch {
      setErrorMessage("Verification failed. Please try again.");
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
          Verify Mobile Number
        </h1>
        <p className="text-xs text-[#718096]">
          Enter the 6-digit verification code sent to
        </p>
        <p className="text-xs font-bold text-[#102B35] font-mono">
          {phone}
        </p>
      </div>

      {/* Demo helper */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-[11px] text-amber-900">
            <span className="font-bold">Test OTP:</span> 123456
          </p>
        </div>
        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="text-[11px] font-bold text-[#17A890] hover:text-[#128673] underline cursor-pointer"
        >
          Fill Demo OTP
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

      {/* OTP Form */}
      <form onSubmit={handleVerify} className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-sm space-y-5">
        <div>
          <label className="text-xs font-bold text-[#18252B] block text-center mb-3">
            Enter 6-Digit SMS Code
          </label>

          {/* 6 Digit Inputs */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-13 text-center text-lg font-black font-mono text-[#102B35] bg-[#F7F9F8] rounded-xl border border-[#E5EBE8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all shadow-2xs"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Resend timer */}
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          <span className="text-[#718096]">Didn&apos;t receive code?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-[#17A890] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resend OTP</span>
            </button>
          ) : (
            <span className="text-[#718096] font-mono">
              Resend in 00:{timer.toString().padStart(2, "0")}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || otpDigits.some((d) => d === "")}
          className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Continue</span>
            </>
          )}
        </button>
      </form>

      {/* Back link */}
      <div className="text-center text-xs">
        <Link
          href="/login"
          className="text-[#718096] hover:text-[#18252B] underline"
        >
          Change phone number or login with password
        </Link>
      </div>
    </div>
  );
}
