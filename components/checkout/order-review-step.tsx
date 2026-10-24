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
  ChevronRight,
  Sparkles,
  ShoppingBag,
  QrCode,
  CheckCircle2,
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
  const totalRupees = paiseToRupees(bill.totalPaise);
  const savingsRupees = paiseToRupees(bill.savingsPaise);

  return (
    <div className="space-y-4 pb-28">
      {/* Step Info Row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#17A890] animate-pulse" />
          <p className="text-xs font-bold text-[#102B35]">
            Review your live cart before payment
          </p>
        </div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#17A890] hover:text-[#128673] bg-[#17A890]/10 hover:bg-[#17A890]/15 px-3 py-1 rounded-full transition-colors"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>Edit Cart</span>
        </Link>
      </div>

      {/* Revalidation warning */}
      {revalidationError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-bold mb-0.5">Price Update Detected</p>
            <p className="leading-relaxed">{revalidationError}</p>
            <Link
              href="/cart"
              className="font-bold underline underline-offset-2 mt-1.5 inline-block text-amber-900"
            >
              Review cart items →
            </Link>
          </div>
        </div>
      )}

      {/* Order Summary Card */}
      <OrderSummaryCard bill={bill} showLineItems />

      {/* Trust & Guarantee Cards */}
      <div className="bg-white rounded-2xl border border-[#E2EBE6] p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#102B35]">
          <ShieldCheck className="w-4 h-4 text-[#17A890]" />
          <span>SmartCart Buyer Protection</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F0F4F2]">
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#F8FAF9]">
            <CheckCircle2 className="w-4 h-4 text-[#17A890] mb-1" />
            <span className="text-[10px] font-bold text-[#102B35] leading-tight">
              100% Verified
            </span>
            <span className="text-[9px] text-[#718096] leading-none mt-0.5">
              Accurate MRP
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#F8FAF9]">
            <QrCode className="w-4 h-4 text-[#17A890] mb-1" />
            <span className="text-[10px] font-bold text-[#102B35] leading-tight">
              Instant Gate Pass
            </span>
            <span className="text-[9px] text-[#718096] leading-none mt-0.5">
              Queue-free exit
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#F8FAF9]">
            <Lock className="w-4 h-4 text-[#17A890] mb-1" />
            <span className="text-[10px] font-bold text-[#102B35] leading-tight">
              256-Bit SSL
            </span>
            <span className="text-[9px] text-[#718096] leading-none mt-0.5">
              NPCI Certified
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Production pattern for Instamart/Blinkit) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E2EBE6] p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider block">
              Total Payable
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-[#102B35]">
                {formatCurrency(totalRupees)}
              </span>
              {savingsRupees > 0 && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Save {formatCurrency(savingsRupees)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onProceed}
            disabled={isRevalidating || !!revalidationError}
            className={`flex-1 py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer ${
              isRevalidating || revalidationError
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-[#17A890] to-[#0f8b76] hover:from-[#149580] hover:to-[#0c7a67] text-white shadow-[#17A890]/25"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>
              {isRevalidating ? "Verifying Bill Total…" : "Proceed to Payment"}
            </span>
            {!isRevalidating && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        </div>
      </div>
    </div>
  );
}
