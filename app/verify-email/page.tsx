"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import {
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function VerifyEmailPage() {
  const { user, verifyEmail } = useAuth();
  const { showToast } = useCart();

  const [resendCooldown, setResendCooldown] = useState(false);

  const email = user?.email || "shiva.shopper@smartcart-demo.in";
  const isVerified = user?.isEmailVerified ?? true;

  const handleResend = () => {
    setResendCooldown(true);
    showToast("Email Dispatched", `Verification link sent to ${email}`);
    setTimeout(() => setResendCooldown(false), 20000);
  };

  const handleSimulateVerify = async () => {
    await verifyEmail();
    showToast("Email Verified!", "Your email address has been confirmed.", "success");
  };

  return (
    <div className="max-w-md mx-auto py-4 space-y-5">
      {/* Top back navigation */}
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors"
          aria-label="Back to profile"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-xs font-bold text-[#102B35]">
          Account Verification
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-6 shadow-sm text-center space-y-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
            isVerified
              ? "bg-[#16865C]/15 text-[#16865C] border border-[#16865C]/30"
              : "bg-amber-100 text-amber-700 border border-amber-200"
          }`}
        >
          {isVerified ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : (
            <Mail className="w-7 h-7" />
          )}
        </div>

        <div>
          <h1 className="text-lg font-black text-[#102B35]">
            {isVerified ? "Email Address Verified" : "Verify Your Email"}
          </h1>
          <p className="text-xs text-[#718096] mt-1">
            {isVerified
              ? "Your primary email is confirmed for order receipts and security alerts."
              : "We sent an email verification link to confirm your digital receipt address."}
          </p>
          <p className="text-xs font-bold font-mono text-[#102B35] mt-2 bg-[#F7F9F8] py-1.5 px-3 rounded-xl border border-[#E5EBE8] inline-block">
            {email}
          </p>
        </div>

        {/* Verification Status Pill */}
        <div className="pt-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
              isVerified
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {isVerified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status: Verified Active</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Status: Pending Confirmation</span>
              </>
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-2.5">
          {!isVerified && (
            <button
              onClick={handleSimulateVerify}
              className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Click on Email Link (Demo)</span>
            </button>
          )}

          <button
            onClick={handleResend}
            disabled={resendCooldown}
            className="w-full bg-white hover:bg-slate-50 text-[#102B35] border border-[#E5EBE8] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {resendCooldown ? "Link Dispatched" : "Resend Verification Link"}
            </span>
          </button>

          <Link
            href="/profile"
            className="w-full bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors block"
          >
            <span>Return to Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
