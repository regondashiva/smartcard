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

interface CategoryChipsProps {
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

export function CategoryChips({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        const Icon = ICON_MAP[cat.iconName] || LayoutGrid;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              isSelected
                ? "bg-[#102B35] text-white shadow-sm ring-1 ring-[#17A890]"
                : "bg-white text-[#718096] border border-[#E5EBE8] hover:border-[#17A890]/40 hover:text-[#18252B] hover:bg-slate-50/50"
            }`}
            aria-pressed={isSelected}
          >
            <Icon
              className={`w-3.5 h-3.5 ${
                isSelected ? "text-[#17A890]" : "text-[#718096]"
              }`}
            />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
