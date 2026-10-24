"use client";

import React from "react";

interface QuickCat {
  label: string;
  emoji: string;
  bg: string;
  id: string;
}

const QUICK_CATS: QuickCat[] = [
  { id: "fruits-veg",    label: "Fruits & Veg",   emoji: "🥦", bg: "bg-green-50  border-green-200" },
  { id: "dairy",         label: "Dairy & Eggs",    emoji: "🥛", bg: "bg-blue-50   border-blue-200" },
  { id: "snacks",        label: "Snacks",           emoji: "🍟", bg: "bg-amber-50  border-amber-200" },
  { id: "beverages",     label: "Beverages",        emoji: "🥤", bg: "bg-violet-50 border-violet-200" },
  { id: "bakery",        label: "Bakery",           emoji: "🍞", bg: "bg-orange-50 border-orange-200" },
  { id: "meat-seafood",  label: "Meat & Fish",      emoji: "🐟", bg: "bg-red-50    border-red-200" },
  { id: "personal-care", label: "Beauty & Care",    emoji: "🧴", bg: "bg-pink-50   border-pink-200" },
  { id: "household",     label: "Household",        emoji: "🧹", bg: "bg-cyan-50   border-cyan-200" },
  { id: "frozen",        label: "Frozen Foods",     emoji: "🧊", bg: "bg-sky-50    border-sky-200" },
  { id: "organic",       label: "Organic",          emoji: "🌿", bg: "bg-lime-50   border-lime-200" },
  { id: "staples",       label: "Staples",          emoji: "🌾", bg: "bg-yellow-50 border-yellow-200" },
  { id: "baby",          label: "Baby Care",        emoji: "🍼", bg: "bg-rose-50   border-rose-200" },
];

interface QuickCategoriesProps {
  onSelectCategory?: (id: string) => void;
}

export function QuickCategories({ onSelectCategory }: QuickCategoriesProps) {
  return (
    <section aria-label="Quick Category Browse" className="space-y-2.5">
      {/* Header */}
      <div className="px-0.5">
        <h2 className="text-xs font-black text-[#102B35] tracking-tight">
          Shop by Category
        </h2>
        <p className="text-[10px] text-[#718096] mt-0.5">Tap to browse instantly</p>
      </div>

      {/* Horizontal scrollable pill row */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {QUICK_CATS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory?.(cat.id)}
            className={`
              flex-shrink-0 flex flex-col items-center gap-1.5
              w-[72px] sm:w-20 px-2 py-3 rounded-2xl border
              ${cat.bg}
              hover:shadow-md hover:-translate-y-0.5
              transition-all duration-200 active:scale-95
              cursor-pointer
            `}
            aria-label={`Browse ${cat.label}`}
          >
            <span className="text-2xl leading-none">{cat.emoji}</span>
            <span className="text-[10px] font-bold text-[#18252B] text-center leading-tight line-clamp-2">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
