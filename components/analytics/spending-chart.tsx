"use client";

import React, { useState } from "react";
import { SpendingTrendPoint } from "@/types/analytics";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, BarChart2, Calendar } from "lucide-react";

interface SpendingChartProps {
  trends: SpendingTrendPoint[];
  totalSpent: number;
}

export function SpendingChart({ trends, totalSpent }: SpendingChartProps) {
  const [activePoint, setActivePoint] = useState<SpendingTrendPoint | null>(null);

  if (trends.length === 0) {
    return (
      <div className="bg-[#F7F9F8] rounded-2xl p-6 text-center border border-[#E5EBE8] space-y-2">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#718096] flex items-center justify-center mx-auto">
          <BarChart2 className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-[#102B35]">No Spending Trends Available</p>
        <p className="text-[11px] text-[#718096] max-w-xs mx-auto">
          Complete purchases using SmartCart to unlock your daily and monthly spending trends.
        </p>
      </div>
    );
  }

  // Find max amount to scale bars
  const maxAmount = Math.max(...trends.map((t) => t.amount), 100);

  return (
    <div className="space-y-3">
      {/* Active tooltip or summary header */}
      <div className="flex items-center justify-between text-xs bg-[#F7F9F8] p-3 rounded-2xl border border-[#E5EBE8]">
        {activePoint ? (
          <div>
            <span className="text-[10px] text-[#718096] block">{activePoint.label}</span>
            <span className="text-sm font-black text-[#102B35]">
              {formatCurrency(activePoint.amount)}
            </span>
            <span className="text-[10px] text-[#718096] ml-1.5">
              ({activePoint.orderCount} {activePoint.orderCount === 1 ? "order" : "orders"})
            </span>
          </div>
        ) : (
          <div>
            <span className="text-[10px] text-[#718096] block">Period Total</span>
            <span className="text-sm font-black text-[#102B35]">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-[10px] text-[#718096] ml-1.5">
              across {trends.length} active {trends.length === 1 ? "day" : "days"}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#17A890]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Interactive</span>
        </div>
      </div>

      {/* SVG Responsive Bar & Trend Visualization */}
      <div className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-2xs">
        <div className="h-44 w-full flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-1">
          {trends.map((point) => {
            const heightPercent = Math.max(Math.round((point.amount / maxAmount) * 100), 8);
            const isHovered = activePoint?.dateKey === point.dateKey;

            return (
              <div
                key={point.dateKey}
                onMouseEnter={() => setActivePoint(point)}
                onMouseLeave={() => setActivePoint(null)}
                onClick={() => setActivePoint(point)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Bar Value Indicator */}
                <div
                  className={`text-[9px] font-mono font-bold transition-all mb-1 ${
                    isHovered ? "text-[#17A890] scale-110" : "text-transparent group-hover:text-[#102B35]"
                  }`}
                >
                  ₹{point.amount}
                </div>

                {/* Vertical Bar */}
                <div className="w-full max-w-[32px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      isHovered
                        ? "bg-[#102B35]"
                        : "bg-gradient-to-t from-[#17A890] to-[#20C997]"
                    }`}
                  />
                </div>

                {/* X-Axis Date Label */}
                <span className="text-[9px] text-[#718096] font-medium mt-2 truncate w-full text-center">
                  {point.label.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-[#718096] text-center pt-2 border-t border-[#F0F4F2]">
          Tap any bar to inspect daily purchase amounts &amp; order count
        </p>
      </div>
    </div>
  );
}
