"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VerificationDiscrepancy } from "@/types/verification";
import { formatWeight } from "@/lib/utils";
import {
  X,
  AlertTriangle,
  RotateCcw,
  ScanLine,
  UserCheck,
  CheckCircle2,
  Scale,
  Barcode,
  Info,
} from "lucide-react";

interface MismatchAlertSheetProps {
  discrepancy: VerificationDiscrepancy | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onResolve: (discrepancyId: string) => void;
  onRequestStaff: () => void;
}

export function MismatchAlertSheet({
  discrepancy,
  isOpen,
  onClose,
  onRetry,
  onResolve,
  onRequestStaff,
}: MismatchAlertSheetProps) {
  const [isResolving, setIsResolving] = useState(false);

  if (!isOpen || !discrepancy) return null;

  const isWeightDiscrepancy = discrepancy.type === "weight_discrepancy";
  const isProductMismatch = discrepancy.type === "product_mismatch";

  const handleManualResolve = () => {
    setIsResolving(true);
    setTimeout(() => {
      onResolve(discrepancy.id);
      setIsResolving(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-[#E5EBE8] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-sheet-title"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E5EBE8] flex items-center justify-between bg-red-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 block">
                Verification Review
              </span>
              <h2
                id="alert-sheet-title"
                className="text-sm font-bold text-[#102B35]"
              >
                {isWeightDiscrepancy
                  ? "Weight Variance Alert"
                  : isProductMismatch
                  ? "Product Identification Mismatch"
                  : "Cart Verification Notice"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#718096] hover:text-[#18252B] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto no-scrollbar">
          {/* Friendly Guidance Box */}
          <div className="bg-[#F7F9F8] border border-[#E5EBE8] rounded-2xl p-3.5 space-y-1 text-xs">
            <span className="font-bold text-[#102B35] block">
              {discrepancy.productName}
            </span>
            <p className="text-[11px] text-[#718096] leading-relaxed">
              {discrepancy.explanation}
            </p>
          </div>

          {/* Comparison Details */}
          {isWeightDiscrepancy && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-0.5">
                <span className="text-[10px] text-[#718096] block uppercase">
                  Expected Weight
                </span>
                <span className="text-base font-black text-[#102B35]">
                  {discrepancy.expectedWeightGrams
                    ? formatWeight(discrepancy.expectedWeightGrams)
                    : "N/A"}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Tolerance: ±{discrepancy.toleranceGrams || 25}g
                </span>
              </div>

              <div className="bg-red-50 border border-red-200 p-3 rounded-2xl space-y-0.5">
                <span className="text-[10px] text-red-700 block uppercase">
                  Measured on Scale
                </span>
                <span className="text-base font-black text-red-700">
                  {discrepancy.measuredWeightGrams
                    ? formatWeight(discrepancy.measuredWeightGrams)
                    : "N/A"}
                </span>
                <span className="text-[10px] text-red-600 font-semibold block">
                  Variance: +{discrepancy.differenceGrams}g
                </span>
              </div>
            </div>
          )}

          {isProductMismatch && (
            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
                <span className="text-[10px] text-[#718096] block uppercase">
                  Scanned Barcode Item
                </span>
                <p className="font-bold text-[#102B35]">
                  {discrepancy.productName}
                </p>
                <span className="font-mono text-[10px] text-slate-500 block">
                  EAN: {discrepancy.scannedBarcode}
                </span>
              </div>

              <div className="bg-red-50 border border-red-200 p-3 rounded-2xl space-y-1">
                <span className="text-[10px] text-red-700 block uppercase font-bold">
                  Scale & Camera Detections
                </span>
                <p className="font-bold text-red-800">
                  {discrepancy.detectedItemName || "Unrecognized Item"}
                </p>
                <span className="font-mono text-[10px] text-red-600 block">
                  EAN: {discrepancy.detectedBarcode}
                </span>
              </div>
            </div>
          )}

          {/* Customer Self-Resolution Guidance */}
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-[11px] space-y-1">
            <span className="font-bold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Recommended Resolution Steps:</span>
            </span>
            <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
              <li>Ensure no extra bags or items are leaning on the cart basket edge.</li>
              <li>Remove and replace the item gently onto the cart scale platform.</li>
              <li>Or rescan the item barcode using the scanner camera.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F7F9F8] border-t border-[#E5EBE8] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onRetry();
                onClose();
              }}
              className="bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-Weigh Cart</span>
            </button>

            <Link
              href="/scan"
              className="bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Rescan Item</span>
            </Link>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onRequestStaff();
                onClose();
              }}
              className="flex-1 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#18252B] font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#17A890]" />
              <span>Request Staff Assistance</span>
            </button>

            <button
              type="button"
              onClick={handleManualResolve}
              disabled={isResolving}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
            >
              {isResolving ? "Resolving..." : "Clear Alert"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
