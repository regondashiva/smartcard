"use client";

import React from "react";
import { Search, X, Barcode } from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

const QUICK_TAGS = ["Amul", "Atta", "Basmati", "Eggs", "Tea", "Butter", "Biscuits"];

export function ProductSearch({
  searchQuery,
  onSearchChange,
  resultCount,
}: ProductSearchProps) {
  return (
    <div className="space-y-2">
      <div className="relative flex items-center bg-white rounded-2xl border border-[#E5EBE8] hover:border-[#17A890]/40 focus-within:border-[#17A890] focus-within:ring-2 focus-within:ring-[#17A890]/20 shadow-xs transition-all">
        <div className="pl-3.5 pr-2 text-[#718096] flex items-center justify-center">
          <Search className="w-4 h-4 text-[#718096]" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by product, brand, or barcode (EAN)..."
          className="w-full py-2.5 pr-9 text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-transparent focus:outline-hidden"
          aria-label="Search catalogue products"
        />

        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 p-1 rounded-full text-[#718096] hover:text-[#18252B] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-3 pointer-events-none text-[#CBD5E1] hidden sm:flex items-center gap-1">
            <Barcode className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Search status & quick tags */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-0.5">
        <div className="flex items-center gap-1 text-[11px] text-[#718096] shrink-0">
          <span>Quick:</span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSearchChange(tag)}
              className="px-2 py-0.5 rounded-md bg-[#F7F9F8] border border-[#E5EBE8] hover:border-[#17A890]/40 hover:text-[#102B35] font-medium transition-colors cursor-pointer text-[10px]"
            >
              {tag}
            </button>
          ))}
        </div>

        {searchQuery && (
          <span className="text-[11px] font-semibold text-[#17A890] shrink-0">
            {resultCount} {resultCount === 1 ? "match" : "matches"}
          </span>
        )}
      </div>
    </div>
  );
}
