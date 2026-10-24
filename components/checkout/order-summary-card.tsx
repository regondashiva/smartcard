"use client";

import React from "react";
import Image from "next/image";
import { BillSummary } from "@/types/checkout";
import { formatCurrency } from "@/lib/utils";
import { paiseToRupees } from "@/lib/checkout-service";
import { Tag, ShieldCheck, Sparkles, CheckCircle, Package } from "lucide-react";

interface OrderSummaryCardProps {
  bill: BillSummary;
  /** When true, renders the full line-item list; when false, shows compact totals only */
  showLineItems?: boolean;
}

export function OrderSummaryCard({
  bill,
  showLineItems = true,
}: OrderSummaryCardProps) {
  const savingsRupees = paiseToRupees(bill.savingsPaise);
  const totalRupees = paiseToRupees(bill.totalPaise);
  const grossMrpRupees = paiseToRupees(bill.grossMrpPaise);

  return (
    <div className="bg-white rounded-3xl border border-[#E2EBE6] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Top Savings Celebration Banner if savings > 0 */}
      {bill.savingsPaise > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 to-[#17A890] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-amber-200" />
            </div>
            <p className="text-xs font-bold tracking-tight">
              Yay! You are saving {formatCurrency(savingsRupees)} on this order
            </p>
          </div>
          <span className="text-[10px] uppercase font-black bg-white/20 px-2 py-0.5 rounded-full tracking-wider">
            Best Price
          </span>
        </div>
      )}

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#F0F4F2] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#17A890]" />
          <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
            Items in Cart
          </h3>
        </div>
        <span className="text-xs font-semibold text-[#5B6E7A] bg-[#F3F6F4] px-2.5 py-0.5 rounded-full border border-[#E2EBE6]">
          {bill.distinctProducts} {bill.distinctProducts === 1 ? "product" : "products"} • {bill.totalUnits} {bill.totalUnits === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Line Items */}
      {showLineItems && (
        <div className="divide-y divide-[#F0F4F2] px-1">
          {bill.lineItems.map((li) => {
            const lineTotal = paiseToRupees(li.lineTotalPaise);
            const lineOriginalTotal = paiseToRupees(li.mrpPaise * li.quantity);
            const itemSavings = paiseToRupees(li.savingsPaise);

            return (
              <div key={li.productId} className="flex items-center gap-3.5 px-4 py-3.5">
                {/* Product image with sleek presentation */}
                <div className="w-14 h-14 rounded-2xl border border-[#E5EBE8] bg-[#F8FAF9] flex-shrink-0 overflow-hidden relative shadow-2xs">
                  <Image
                    src={li.imageUrl}
                    alt={li.productName}
                    fill
                    sizes="56px"
                    className="object-contain p-1.5"
                    unoptimized
                  />
                </div>

                {/* Name + unit */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#102B35] truncate leading-snug">
                    {li.productName}
                  </p>
                  <p className="text-[11px] text-[#718096] truncate mt-0.5">
                    {li.brand} · <span className="font-medium text-[#4A5568]">{li.unit}</span>
                  </p>
                  {itemSavings > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 font-bold px-1.5 py-0.2 rounded-md mt-1">
                      <Tag className="w-2.5 h-2.5" />
                      Save {formatCurrency(itemSavings)}
                    </span>
                  )}
                </div>

                {/* Qty × price */}
                <div className="text-right flex-shrink-0 pl-2">
                  <p className="text-sm font-black text-[#102B35]">
                    {formatCurrency(lineTotal)}
                  </p>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    {itemSavings > 0 && (
                      <span className="text-[10px] text-[#A0AEC0] line-through">
                        {formatCurrency(lineOriginalTotal)}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-[#718096] bg-[#F3F6F4] px-1.5 py-0.2 rounded">
                      {li.quantity} {li.quantity > 1 ? "units" : "unit"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Perforated receipt divider */}
      <div className="relative border-t-2 border-dashed border-[#E5EBE8] my-1">
        <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#F8FAF9] border-r border-[#E2EBE6]" />
        <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#F8FAF9] border-l border-[#E2EBE6]" />
      </div>

      {/* Bill Breakdown */}
      <div className="px-5 py-4 space-y-2.5 bg-[#FAFBFB]">
        {/* Gross MRP */}
        <div className="flex justify-between text-xs text-[#718096]">
          <span>Item Total (MRP)</span>
          <span className="font-semibold text-[#18252B]">
            {formatCurrency(grossMrpRupees)}
          </span>
        </div>

        {/* Savings */}
        {bill.savingsPaise > 0 && (
          <div className="flex justify-between text-xs text-emerald-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              Store Discount &amp; Offers
            </span>
            <span>−{formatCurrency(savingsRupees)}</span>
          </div>
        )}

        {/* GST */}
        <div className="flex justify-between text-xs text-[#718096]">
          <span className="flex items-center gap-1">
            Estimated GST
            <span className="text-[10px] text-[#A0AEC0]">(All Inclusive)</span>
          </span>
          <span className="font-semibold text-emerald-700 text-xs">Included in MRP</span>
        </div>

        {/* Self-checkout fee */}
        <div className="flex justify-between text-xs text-[#718096]">
          <span>Self-Checkout Convenience</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#A0AEC0] line-through">₹25</span>
            <span className="font-bold text-emerald-700 uppercase text-[10px] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
              FREE
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5EBE8] pt-3.5 mt-2 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-[#718096] block font-semibold uppercase tracking-wider">
              Total Amount to Pay
            </span>
            <span className="text-2xl font-black text-[#102B35] tracking-tight">
              {formatCurrency(totalRupees)}
            </span>
          </div>

          {bill.savingsPaise > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold shadow-2xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>You save {formatCurrency(savingsRupees)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
