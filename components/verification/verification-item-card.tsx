"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CartItem } from "@/types/cart";
import { ItemVerificationResult, VerificationStatus } from "@/types/verification";
import { formatWeight } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  WifiOff,
  AlertTriangle,
  Barcode,
  Scale,
  Package,
  ChevronRight,
} from "lucide-react";

interface VerificationItemCardProps {
  item: CartItem;
  verificationResult?: ItemVerificationResult;
  onOpenDiscrepancy: () => void;
}

export function VerificationItemCard({
  item,
  verificationResult,
  onOpenDiscrepancy,
}: VerificationItemCardProps) {
  const { product, quantity } = item;
  const [imageError, setImageError] = useState(false);

  const status: VerificationStatus = verificationResult?.status || "not_checked";
  const discrepancy = verificationResult?.discrepancy;

  const getStatusBadge = (st: VerificationStatus) => {
    switch (st) {
      case "verified":
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
          label: "Verified",
          className: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "needs_attention":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-600" />,
          label: "Discrepancy",
          className: "bg-red-50 text-red-800 border-red-200 font-bold",
        };
      case "checking":
        return {
          icon: <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />,
          label: "Checking",
          className: "bg-blue-50 text-blue-800 border-blue-200",
        };
      case "unavailable":
        return {
          icon: <WifiOff className="w-3.5 h-3.5 text-slate-500" />,
          label: "Unavailable",
          className: "bg-slate-100 text-slate-700 border-slate-300",
        };
      case "not_checked":
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
          label: "Not Checked",
          className: "bg-slate-100 text-slate-600 border-slate-200",
        };
    }
  };

  const statusBadge = getStatusBadge(status);

  return (
    <div
      className={`bg-white rounded-3xl border p-4 shadow-2xs transition-colors space-y-3 ${
        status === "needs_attention"
          ? "border-red-300 ring-2 ring-red-100"
          : "border-[#E5EBE8]"
      }`}
    >
      {/* Top Row: Product Info & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-[#E5EBE8]">
            {!imageError ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="56px"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                <Package className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-[#17A890] uppercase tracking-wider block">
              {product.brand}
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-[#102B35] leading-snug line-clamp-1">
              {product.name}
            </h3>
            <p className="text-[11px] text-[#718096]">
              Quantity: <span className="font-bold text-[#102B35]">{quantity}</span>{" "}
              {quantity === 1 ? "unit" : "units"}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${statusBadge.className}`}
        >
          {statusBadge.icon}
          <span>{statusBadge.label}</span>
        </span>
      </div>

      {/* Barcode & Weight Comparison Grid */}
      <div className="bg-[#F7F9F8] rounded-2xl p-2.5 border border-[#E5EBE8] grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
        {/* Scanned Barcode */}
        <div className="space-y-0.5">
          <span className="text-[10px] text-[#718096] flex items-center gap-1">
            <Barcode className="w-3 h-3 text-[#17A890]" />
            <span>Barcode</span>
          </span>
          <span className="font-mono font-bold text-[#102B35] block truncate">
            {product.barcode || "N/A"}
          </span>
        </div>

        {/* Expected Weight */}
        <div className="space-y-0.5">
          <span className="text-[10px] text-[#718096] flex items-center gap-1">
            <Scale className="w-3 h-3 text-[#17A890]" />
            <span>Expected Weight</span>
          </span>
          <span className="font-bold text-[#102B35] block">
            {verificationResult?.expectedWeightGrams
              ? formatWeight(verificationResult.expectedWeightGrams)
              : "Not Specified"}
          </span>
        </div>

        {/* Measured Weight */}
        <div className="col-span-2 sm:col-span-1 space-y-0.5">
          <span className="text-[10px] text-[#718096] block">
            Measured Scale Weight
          </span>
          <span
            className={`font-bold block ${
              status === "needs_attention" && discrepancy?.type === "weight_discrepancy"
                ? "text-red-600"
                : "text-[#102B35]"
            }`}
          >
            {verificationResult?.measuredWeightGrams
              ? formatWeight(verificationResult.measuredWeightGrams)
              : "-- kg (sensor offline)"}
          </span>
        </div>
      </div>

      {/* Discrepancy Callout banner if flagged */}
      {discrepancy && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-red-900 block">
                {discrepancy.type === "weight_discrepancy"
                  ? "Weight Variance Detected"
                  : discrepancy.type === "product_mismatch"
                  ? "Item Classification Mismatch"
                  : "Verification Exception"}
              </span>
              <p className="text-[11px] text-red-800 leading-snug">
                {discrepancy.explanation}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDiscrepancy}
            className="w-full bg-white hover:bg-red-100/60 border border-red-300 text-red-800 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>Review & Resolve Discrepancy</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Verification Time Footer */}
      {verificationResult?.verifiedAt && !discrepancy && (
        <div className="text-[10px] text-[#718096] flex items-center justify-between pt-0.5">
          <span>Cross-checked by cart weight sensor</span>
          <span>{verificationResult.verifiedAt}</span>
        </div>
      )}
    </div>
  );
}
