"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Tag,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface CartSummaryProps {
  distinctCount: number;
  itemCount: number;
  subtotal: number;
  savings: number;
  onProceedToCheckout?: () => void;
  disabled?: boolean;
}

export function CartSummary({
  distinctCount,
  itemCount,
  subtotal,
  savings,
  onProceedToCheckout,
  disabled = false,
}: CartSummaryProps) {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Original list price before discounts
  const grossSubtotal = subtotal + savings;

  const handleCheckoutClick = () => {
    if (disabled || itemCount === 0) return;
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      setIsCheckoutModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5EBE8] pb-3">
          <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
            Live Bill Summary
          </h3>
          <span className="text-[11px] text-[#718096] bg-[#F7F9F8] px-2 py-0.5 rounded-full border border-[#E5EBE8]">
            {distinctCount} {distinctCount === 1 ? "product" : "products"} • {itemCount}{" "}
            {itemCount === 1 ? "unit" : "units"}
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-2 text-xs">
          {/* Gross MRP */}
          <div className="flex justify-between text-[#718096]">
            <span>Items Subtotal (MRP)</span>
            <span className="font-semibold text-[#18252B]">
              {formatCurrency(grossSubtotal)}
            </span>
          </div>

          {/* Store Discounts */}
          {savings > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Store Savings & Offers</span>
              </span>
              <span>-{formatCurrency(savings)}</span>
            </div>
          )}

          {/* Tax line */}
          <div className="flex justify-between text-[#718096]">
            <span className="flex items-center gap-1">
              <span>Estimated GST</span>
              <span className="text-[10px] text-slate-400">(Inclusive)</span>
            </span>
            <span className="font-medium text-emerald-700">Included in MRP</span>
          </div>

          {/* Store Bag / Convenience */}
          <div className="flex justify-between text-[#718096]">
            <span>Self-Checkout Convenience</span>
            <span className="font-bold text-emerald-700 uppercase text-[10px]">
              FREE (Queue-Free)
            </span>
          </div>
        </div>

        {/* Final Total Amount */}
        <div className="pt-3 border-t border-[#E5EBE8] flex items-baseline justify-between">
          <div>
            <span className="text-xs text-[#718096] block font-medium">
              Final Payable Amount
            </span>
            <span className="text-2xl font-black text-[#102B35] tracking-tight">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {savings > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>You save {formatCurrency(savings)}</span>
            </div>
          )}
        </div>

        {/* Disclaimer Note */}
        <p className="text-[10px] text-[#718096] leading-tight">
          * Prices are synchronized with current store catalogue. Authoritative bill is finalized upon digital checkout.
        </p>

        {/* Primary Checkout CTA Button */}
        <button
          type="button"
          onClick={handleCheckoutClick}
          disabled={disabled || itemCount === 0}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer ${
            !disabled && itemCount > 0
              ? "bg-[#17A890] hover:bg-[#128673] text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Proceed to Checkout • {formatCurrency(subtotal)}</span>
        </button>

        {/* Continue Shopping Link */}
        <div className="text-center pt-1">
          <Link
            href="/explore"
            className="text-xs font-bold text-[#17A890] hover:underline inline-flex items-center gap-1"
          >
            <span>Continue Browsing Products</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Module 8 Future Checkout Placeholder Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
          <div
            className="w-full max-w-sm bg-white rounded-3xl border border-[#E5EBE8] shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#17A890]/10 text-[#17A890] flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#17A890] bg-[#17A890]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Module 8 Preview
              </span>
              <h3 className="text-base font-bold text-[#102B35]">
                Digital Self-Checkout
              </h3>
              <p className="text-xs text-[#718096] leading-relaxed">
                UPI, Credit/Debit card payments, and instant Exit QR Receipt generation will activate in Module 8. Your current cart total of{" "}
                <span className="font-bold text-[#102B35]">
                  {formatCurrency(subtotal)}
                </span>{" "}
                is saved.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutModalOpen(false)}
              className="w-full bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Back to SmartCart
            </button>
          </div>
        </div>
      )}
    </>
  );
}
