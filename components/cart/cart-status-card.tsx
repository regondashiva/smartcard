"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ScanLine,
  ArrowRight,
  Info,
} from "lucide-react";

interface CartStatusCardProps {
  itemCount: number;
  distinctCount: number;
  isSessionActive: boolean;
}

export function CartStatusCard({
  itemCount,
  distinctCount,
  isSessionActive,
}: CartStatusCardProps) {
  if (itemCount === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-[#E5EBE8] p-4 shadow-xs space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">
          Shopping Guidance & Status
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          <Info className="w-3 h-3 text-amber-600" />
          <span>Pending Verification</span>
        </span>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#17A890]/10 text-[#17A890] flex items-center justify-center shrink-0 mt-0.5">
          <ScanLine className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-bold text-[#102B35]">
            {itemCount} {itemCount === 1 ? "Item" : "Items"} in Smart Basket
          </h4>
          <p className="text-[11px] text-[#718096] leading-relaxed">
            Barcode scanning registers products into your digital cart. Physical load-cell weight cross-checking and final verification will occur prior to checkout.
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-[#E5EBE8] flex items-center justify-between text-[11px] text-[#718096]">
        <span>Next Step:</span>
        <span className="font-bold text-[#17A890]">
          Scan more items or review bill below
        </span>
      </div>
    </div>
  );
}
