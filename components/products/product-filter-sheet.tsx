"use client";

import React from "react";
import { ProductCategory } from "@/types/product";
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Tag,
  IndianRupee,
} from "lucide-react";

export interface FilterState {
  categoryId: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  offersOnly: boolean;
  selectedBrand: string;
}

interface ProductFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  categories: ProductCategory[];
  availableBrands: string[];
  activeFilterCount: number;
}

export function ProductFilterSheet({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onResetFilters,
  categories,
  availableBrands,
  activeFilterCount,
}: ProductFilterSheetProps) {
  if (!isOpen) return null;

  const quickPriceCaps = [50, 100, 200, 500];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-title"
    >
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#E5EBE8] overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5EBE8] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#17A890]/15 text-[#17A890] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 id="filter-title" className="text-sm font-bold text-[#18252B]">
                Filter Catalogue
              </h2>
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-bold text-[#17A890]">
                  {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#718096] hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* 1. Quick Toggles: In Stock & Offers */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">
              Availability & Deals
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onFiltersChange({ ...filters, inStockOnly: !filters.inStockOnly })
                }
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  filters.inStockOnly
                    ? "border-[#16865C] bg-[#16865C]/10 text-[#16865C]"
                    : "border-[#E5EBE8] bg-[#F7F9F8] text-[#718096] hover:border-slate-300"
                }`}
              >
                <span>In Stock Only</span>
                {filters.inStockOnly && <Check className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() =>
                  onFiltersChange({ ...filters, offersOnly: !filters.offersOnly })
                }
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  filters.offersOnly
                    ? "border-[#D97706] bg-[#D97706]/10 text-[#D97706]"
                    : "border-[#E5EBE8] bg-[#F7F9F8] text-[#718096] hover:border-slate-300"
                }`}
              >
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Offers Only
                </span>
                {filters.offersOnly && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2. Price Range */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">
                Price Range (₹)
              </span>
              <span className="text-xs font-bold text-[#102B35]">
                Up to ₹{filters.maxPrice}
              </span>
            </div>

            {/* Quick Price Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {quickPriceCaps.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, maxPrice: cap })}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    filters.maxPrice === cap
                      ? "bg-[#102B35] text-white border-[#102B35]"
                      : "bg-[#F7F9F8] border-[#E5EBE8] text-[#718096] hover:text-[#18252B]"
                  }`}
                >
                  Under ₹{cap}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, maxPrice: 1000 })}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                  filters.maxPrice >= 1000
                    ? "bg-[#102B35] text-white border-[#102B35]"
                    : "bg-[#F7F9F8] border-[#E5EBE8] text-[#718096] hover:text-[#18252B]"
                }`}
              >
                All Prices
              </button>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={20}
              max={1000}
              step={10}
              value={filters.maxPrice}
              onChange={(e) =>
                onFiltersChange({ ...filters, maxPrice: Number(e.target.value) })
              }
              className="w-full accent-[#17A890] cursor-pointer"
            />
          </div>

          {/* 3. Category Filter */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">
              Department / Category
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isSelected = filters.categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      onFiltersChange({ ...filters, categoryId: cat.id })
                    }
                    className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#17A890] text-white border-[#17A890]"
                        : "bg-[#F7F9F8] border-[#E5EBE8] text-[#718096] hover:border-slate-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Brand Filter */}
          {availableBrands.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">
                Brand
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, selectedBrand: "" })}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    filters.selectedBrand === ""
                      ? "bg-[#102B35] text-white border-[#102B35]"
                      : "bg-[#F7F9F8] border-[#E5EBE8] text-[#718096]"
                  }`}
                >
                  All Brands
                </button>
                {availableBrands.map((brand) => {
                  const isSelected = filters.selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() =>
                        onFiltersChange({ ...filters, selectedBrand: brand })
                      }
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#102B35] text-white border-[#102B35]"
                          : "bg-[#F7F9F8] border-[#E5EBE8] text-[#718096] hover:text-[#18252B]"
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E5EBE8] bg-[#F7F9F8] flex items-center gap-2.5">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#CBD5E1] bg-white text-[#18252B] font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
