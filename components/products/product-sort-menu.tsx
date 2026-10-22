"use client";

import React from "react";
import { ArrowUpDown, Check } from "lucide-react";

export type SortOption =
  | "recommended"
  | "price-low"
  | "price-high"
  | "name-asc"
  | "popular";

interface ProductSortMenuProps {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "popular", label: "Popularity" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A to Z" },
];

export function ProductSortMenu({
  currentSort,
  onSortChange,
}: ProductSortMenuProps) {
  return (
    <div className="relative inline-block text-left">
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="appearance-none bg-white border border-[#E5EBE8] hover:border-[#17A890]/40 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-[#18252B] focus:outline-hidden focus:ring-1 focus:ring-[#17A890] cursor-pointer shadow-2xs"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#718096]">
        <ArrowUpDown className="w-3 h-3" />
      </div>
    </div>
  );
}
