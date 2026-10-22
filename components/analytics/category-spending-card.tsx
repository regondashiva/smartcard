"use client";

import React from "react";
import { CategorySpending } from "@/types/analytics";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Tag, ShoppingCart } from "lucide-react";

interface CategorySpendingCardProps {
  categories: CategorySpending[];
  totalSpent: number;
}

export function CategorySpendingCard({
  categories,
  totalSpent,
}: CategorySpendingCardProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-5 text-center space-y-2 shadow-xs">
        <p className="text-xs font-bold text-[#102B35]">No Category Breakdown</p>
        <p className="text-[11px] text-[#718096]">
          Category insights will appear as you scan and purchase products.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#17A890] flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#102B35]">
              Spending by Category
            </h3>
            <p className="text-[10px] text-[#718096]">
              {categories.length} active supermarket categories
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-[#102B35] bg-[#F7F9F8] px-2.5 py-1 rounded-full border border-[#E5EBE8]">
          Total: {formatCurrency(totalSpent)}
        </span>
      </div>

      {/* Category Progress Bars */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.categoryId} className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-bold text-[#102B35]">
                  {cat.categoryName}
                </span>
                <span className="text-[10px] text-[#718096]">
                  ({cat.itemCount} {cat.itemCount === 1 ? "unit" : "units"})
                </span>
              </div>

              <div className="text-right">
                <span className="font-bold text-[#102B35]">
                  {formatCurrency(cat.amount)}
                </span>
                <span className="text-[10px] text-[#718096] font-semibold ml-1.5">
                  ({cat.percentage}%)
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
