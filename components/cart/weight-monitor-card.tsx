"use client";

import React from "react";
import Link from "next/link";
import { ExpectedWeightResult } from "@/store/cart-store";
import {
  Scale,
  WifiOff,
  AlertCircle,
  Info,
  CheckCircle2,
  Cpu,
} from "lucide-react";

interface WeightMonitorCardProps {
  expectedWeight: ExpectedWeightResult;
  isHardwareConnected?: boolean;
}

export function WeightMonitorCard({
  expectedWeight,
  isHardwareConnected = false,
}: WeightMonitorCardProps) {
  const { totalGrams, formattedKg, complete, knownItemsCount, totalItemsCount } =
    expectedWeight;

  return (
    <div className="bg-white rounded-3xl border border-[#E5EBE8] p-4.5 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#17A890]/10 text-[#17A890] flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#102B35]">
              Cart Weight Monitoring
            </h3>
            <p className="text-[10px] text-[#718096]">
              IoT load cell scale verification
            </p>
          </div>
        </div>

        {/* Hardware Sensor Status Badge */}
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            isHardwareConnected
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          {isHardwareConnected ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sensor Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-2.5 h-2.5 text-amber-600" />
              <span>Sensor Not Connected</span>
            </>
          )}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        {/* Expected Weight Card */}
        <div className="bg-[#F7F9F8] p-3 rounded-2xl border border-[#E5EBE8] space-y-1">
          <span className="text-[10px] font-semibold text-[#718096] uppercase block">
            Expected Weight
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#102B35]">
              {totalItemsCount > 0 ? formattedKg : "0.00"}
            </span>
            <span className="text-xs font-bold text-[#718096]">kg</span>
          </div>
          <p className="text-[10px] text-[#718096] leading-tight">
            {totalItemsCount === 0 ? (
              "Cart is empty"
            ) : complete ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 inline shrink-0" />
                All {totalItemsCount} items indexed
              </span>
            ) : (
              <span>
                {knownItemsCount} of {totalItemsCount} items indexed (partial)
              </span>
            )}
          </p>
        </div>

        {/* Measured Physical Weight Card */}
        <div className="bg-[#F7F9F8] p-3 rounded-2xl border border-[#E5EBE8] space-y-1">
          <span className="text-[10px] font-semibold text-[#718096] uppercase block">
            Measured Scale Weight
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-400">
              {isHardwareConnected ? "0.00" : "--"}
            </span>
            <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
          <p className="text-[10px] text-amber-700 font-medium leading-tight">
            {isHardwareConnected
              ? "Live load cell stream"
              : "Sensor hardware offline"}
          </p>
        </div>
      </div>

      {/* Transparent Explanation Notice & Link */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 space-y-2 text-[11px] text-[#718096]">
        <div className="flex items-start gap-2 leading-snug">
          <Cpu className="w-4 h-4 text-[#17A890] shrink-0 mt-0.5" />
          <p>
            Cart load cells cross-check physical scale readings against scanned barcodes for anti-theft security.
          </p>
        </div>

        <Link
          href="/cart/verification"
          className="text-xs font-bold text-[#17A890] hover:text-[#128673] flex items-center justify-between pt-1 border-t border-slate-200 transition-colors"
        >
          <span>Open Verification & Mismatch Hub</span>
          <span className="text-xs">→</span>
        </Link>
      </div>
    </div>
  );
}
