"use client";

import React from "react";
import { ProductCategory } from "@/types/product";
import {
  LayoutGrid,
  Apple,
  Milk,
  Cookie,
  Coffee,
  Croissant,
  Sparkles,
  Home,
  Wheat,
  LucideIcon,
} from "lucide-react";

interface CategoryListProps {
  categories: ProductCategory[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid,
  Apple,
  Milk,
  Cookie,
  Coffee,
  Croissant,
  Sparkles,
  Home,
  Wheat,
};

export function CategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <section aria-label="Product Categories" className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-[#102B35] tracking-tight">
          Explore by Category
        </h2>
        <span className="text-xs text-[#718096]">
          {categories.length} categories
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const Icon = ICON_MAP[cat.iconName] || LayoutGrid;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#102B35] text-white shadow-md ring-2 ring-[#17A890]/40 scale-102"
                  : "bg-white text-[#718096] border border-[#E5EBE8] hover:border-[#17A890]/40 hover:text-[#18252B] hover:bg-slate-50/50 shadow-xs"
              }`}
              aria-pressed={isSelected}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  isSelected
                    ? "bg-[#17A890] text-white"
                    : "bg-[#F7F9F8] text-[#17A890]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
