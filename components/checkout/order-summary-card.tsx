"use client";

import React from "react";
import Image from "next/image";
import { BillSummary } from "@/types/checkout";
import { formatCurrency } from "@/lib/utils";
import { paiseToRupees } from "@/lib/checkout-service";
import { Tag, ShieldCheck, Info } from "lucide-react";

interface OrderSummaryCardProps {
  bill: BillSummary;
  /** When true, renders the full line-item list; when false, shows compact totals only */
  showLineItems?: boolean;
}

export function OrderSummaryCard({
  bill,
  showLineItems = true,
}: OrderSummaryCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-[#E5EBE8] flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
          Order Summary
        </h3>
        <span className="text-[11px] text-[#718096] bg-[#F7F9F8] px-2 py-0.5 rounded-full border border-[#E5EBE8]">
          {bill.distinctProducts}{" "}
          {bill.distinctProducts === 1 ? "product" : "products"} •{" "}
          {bill.totalUnits} {bill.totalUnits === 1 ? "unit" : "units"}
        </span>
      </div>

      {/* Line Items */}
      {showLineItems && (
        <div className="divide-y divide-[#F7F9F8]">
          {bill.lineItems.map((li) => (
            <div key={li.productId} className="flex items-center gap-3 px-5 py-3">
              {/* Product image */}
              <div className="w-12 h-12 rounded-xl border border-[#E5EBE8] bg-[#F7F9F8] flex-shrink-0 overflow-hidden relative">
                <Image
                  src={li.imageUrl}
                  alt={li.productName}
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                  unoptimized
                />
              </div>

              {/* Name + unit */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#18252B] truncate">
                  {li.productName}
                </p>
                <p className="text-[11px] text-[#718096] truncate">
                  {li.brand} · {li.unit}
                </p>
                {li.savingsPaise > 0 && (
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Save {formatCurrency(paiseToRupees(li.savingsPaise))}
                  </p>
                )}
              </div>

              {/* Qty × price */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-[#102B35]">
                  {formatCurrency(paiseToRupees(li.lineTotalPaise))}
                </p>
                <p className="text-[10px] text-[#718096]">
                  {li.quantity} ×{" "}
                  {formatCurrency(paiseToRupees(li.unitPricePaise))}
                </p>
                {li.savingsPaise > 0 && (
                  <p className="text-[10px] text-[#718096] line-through">
                    {formatCurrency(
                      paiseToRupees(li.mrpPaise * li.quantity)
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bill Breakdown */}
      <div className="px-5 py-4 space-y-2 border-t border-[#E5EBE8] bg-[#FAFBFA]">
        {/* Gross MRP */}
        <div className="flex justify-between text-xs text-[#718096]">
          <span>Items MRP Total</span>
          <span className="font-semibold text-[#18252B]">
            {formatCurrency(paiseToRupees(bill.grossMrpPaise))}
          </span>
        </div>

        {/* Savings */}
        {bill.savingsPaise > 0 && (
          <div className="flex justify-between text-xs text-emerald-700 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              Store Savings &amp; Offers
            </span>
            <span>−{formatCurrency(paiseToRupees(bill.savingsPaise))}</span>
          </div>
        )}

        {/* GST */}
        <div className="flex justify-between text-xs text-[#718096]">
          <span className="flex items-center gap-1">
            Estimated GST
            <span className="text-[10px] text-slate-400">(Inclusive)</span>
          </span>
          <span className="font-medium text-emerald-700">Included in MRP</span>
        </div>

        {/* Self-checkout fee */}
        <div className="flex justify-between text-xs text-[#718096]">
          <span>Self-Checkout Convenience</span>
          <span className="font-bold text-emerald-700 uppercase text-[10px]">
            FREE
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5EBE8] pt-3 mt-1 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-[#718096] block font-medium">
              Total Payable
            </span>
            <span className="text-2xl font-black text-[#102B35] tracking-tight">
              {formatCurrency(paiseToRupees(bill.totalPaise))}
            </span>
          </div>

          {bill.savingsPaise > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                You save {formatCurrency(paiseToRupees(bill.savingsPaise))}
              </span>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-[#718096] leading-tight flex items-start gap-1 pt-1">
          <Info className="w-3 h-3 flex-shrink-0 mt-px" />
          GST is inclusive in Indian MRP. Final bill is authoritative upon
          payment confirmation.
        </p>
      </div>
    </div>
  );
}
