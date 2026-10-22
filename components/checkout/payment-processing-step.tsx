"use client";

import React, { useEffect, useState } from "react";
import { BillSummary, PaymentMethodId } from "@/types/checkout";
import { formatCurrency } from "@/lib/utils";
import { paiseToRupees } from "@/lib/checkout-service";
import { Lock, ShieldCheck } from "lucide-react";

const METHOD_LABEL: Record<PaymentMethodId, string> = {
  upi: "UPI",
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
  "Initiating secure payment…",
  "Connecting to payment gateway…",
  "Awaiting bank authorisation…",
  "Verifying transaction…",
  "Almost done…",
];

export function PaymentProcessingStep({ bill, method }: PaymentProcessingStepProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 700);

    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p; // stall near 100% until real response
        return Math.min(p + Math.random() * 12, 95);
      });
    }, 300);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Central animation card */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-xs px-6 py-10 flex flex-col items-center gap-6">
        {/* Pulse ring */}
        <div className="relative flex items-center justify-center">
          <span className="absolute w-24 h-24 rounded-full bg-[#17A890]/10 animate-ping" />
          <span className="absolute w-16 h-16 rounded-full bg-[#17A890]/20 animate-ping animation-delay-200" />
          <div className="relative w-20 h-20 rounded-full bg-[#17A890] flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-base font-black text-[#102B35]">Processing Payment</h2>
          <p className="text-xs text-[#718096] min-h-[1.2rem] transition-all duration-300">
            {MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#F0F4F2] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-[#17A890] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Amount chip */}
        <div className="bg-[#102B35] text-white rounded-2xl px-5 py-3 text-center">
          <p className="text-[10px] font-medium text-white/60 uppercase tracking-wider mb-0.5">
            {METHOD_LABEL[method]}
          </p>
          <p className="text-2xl font-black tracking-tight">
            {formatCurrency(paiseToRupees(bill.totalPaise))}
          </p>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-[#718096]">
        <ShieldCheck className="w-4 h-4 text-[#17A890]" />
        <span>Secured · Do not close or refresh</span>
      </div>
    </div>
  );
}
