"use client";

import React from "react";
import Link from "next/link";
import { BillSummary } from "@/types/checkout";
import { OrderSummaryCard } from "./order-summary-card";
import { formatCurrency } from "@/lib/utils";
import { paiseToRupees } from "@/lib/checkout-service";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  AlertTriangle,
} from "lucide-react";

interface OrderReviewStepProps {
  bill: BillSummary;
  isRevalidating: boolean;
  revalidationError: string | null;
  onProceed: () => void;
}

export function OrderReviewStep({
  bill,
  isRevalidating,
  revalidationError,
  onProceed,
}: OrderReviewStepProps) {
  return (
    <div className="space-y-4">
      {/* Back to Cart */}
      <div className="flex items-center justify-between">
        <Link
          href="/cart"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#718096] hover:text-[#102B35] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Edit Cart
        </Link>
        <span className="text-[11px] text-[#718096] bg-white px-2.5 py-1 rounded-full border border-[#E5EBE8]">
          Step 1 of 4
        </span>
      </div>

      {/* Revalidation warning */}
      {revalidationError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-px" />
          <div className="text-xs text-amber-800">
            <p className="font-bold mb-0.5">Price Update Detected</p>
            <p className="leading-relaxed">{revalidationError}</p>
            <Link
              href="/cart"
              className="font-bold underline underline-offset-2 mt-1 inline-block"
            >
              Review cart →
            </Link>
          </div>
        </div>
      )}

      {/* Order Summary Card */}
      <OrderSummaryCard bill={bill} showLineItems />

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: ShieldCheck, label: "Secure\nCheckout" },
          { icon: Lock, label: "256-bit\nEncryption" },
          { icon: ShieldCheck, label: "PCI DSS\nCompliant" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-[#E5EBE8] p-3 flex flex-col items-center gap-1.5 text-center"
          >
            <Icon className="w-4 h-4 text-[#17A890]" />
            <span className="text-[10px] font-semibold text-[#718096] whitespace-pre-line leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onProceed}
        disabled={isRevalidating || !!revalidationError}
        className={`w-full py-4 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer ${
          isRevalidating || revalidationError
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-[#17A890] hover:bg-[#128673] text-white"
        }`}
      >
        <Lock className="w-4 h-4" />
        {isRevalidating
          ? "Verifying prices…"
          : `Proceed to Payment · ${formatCurrency(paiseToRupees(bill.totalPaise))}`}
      </button>
    </div>
  );
}
