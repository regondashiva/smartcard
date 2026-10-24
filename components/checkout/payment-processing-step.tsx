"use client";

import React, { useEffect, useState } from "react";
import { BillSummary, PaymentMethodId } from "@/types/checkout";
import { formatCurrency } from "@/lib/utils";
import { paiseToRupees } from "@/lib/checkout-service";
import { Lock, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

const METHOD_LABEL: Record<PaymentMethodId, string> = {
  upi: "UPI Direct",
  card: "Debit / Credit Card",
  netbanking: "Net Banking",
  wallet_gpay: "Google Pay",
  wallet_phonepe: "PhonePe",
  wallet_paytm: "Paytm",
};

interface PaymentProcessingStepProps {
  bill: BillSummary;
  method: PaymentMethodId;
}

const MESSAGES = [
  "Contacting secure payment gateway…",
  "Authorising transaction with your bank…",
  "Verifying digital cart items…",
  "Issuing digital exit gate pass…",
  "Finalising your order confirmation…",
];

export function PaymentProcessingStep({
  bill,
  method,
}: PaymentProcessingStepProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 700);

    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 94) return p;
        return Math.min(p + Math.random() * 15, 94);
      });
    }, 280);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div className="space-y-6 py-6 px-1">
      {/* Central Animation Card */}
      <div className="bg-white rounded-3xl border border-[#E2EBE6] shadow-[0_8px_32px_rgba(0,0,0,0.04)] px-6 py-12 flex flex-col items-center gap-6">
        {/* Glowing Pulsing Shield Rings */}
        <div className="relative flex items-center justify-center my-2">
          <span className="absolute w-32 h-32 rounded-full bg-[#17A890]/10 animate-ping duration-1000" />
          <span className="absolute w-24 h-24 rounded-full bg-[#17A890]/20 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#17A890] to-[#0d7563] flex items-center justify-center shadow-xl shadow-[#17A890]/30 text-white">
            <Lock className="w-9 h-9 stroke-[2.2]" />
          </div>
        </div>

        {/* Status text */}
        <div className="text-center space-y-1.5 max-w-xs">
          <h2 className="text-lg font-black text-[#102B35]">
            Processing Your Payment
          </h2>
          <p className="text-xs text-[#5E7381] font-medium min-h-[1.2rem] transition-all duration-300">
            {MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs bg-[#EDF2EF] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#17A890] to-emerald-400 rounded-full transition-all duration-400 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Payment Amount Card */}
        <div className="w-full max-w-xs bg-[#F8FAF9] border border-[#E2EBE6] rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#DCE4E0] flex items-center justify-center text-[#17A890] font-bold text-xs">
              ₹
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">
                Paying via {METHOD_LABEL[method]}
              </p>
              <p className="text-sm font-black text-[#102B35]">
                {formatCurrency(paiseToRupees(bill.totalPaise))}
              </p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#718096]">
        <ShieldCheck className="w-4 h-4 text-[#17A890]" />
        <span>256-Bit Encrypted · Please do not close or refresh this page</span>
      </div>
    </div>
  );
}
