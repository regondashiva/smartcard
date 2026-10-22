"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/home/product-card";
import { PackageX, RotateCcw } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
  isLoading?: boolean;
}

export function ProductGrid({
  products,
  onResetFilters,
  isLoading = false,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E5EBE8] overflow-hidden aspect-3/4 flex flex-col justify-between p-3"
          >
            <div className="w-full aspect-4/3 bg-slate-200 rounded-xl" />
            <div className="space-y-2 mt-2">
              <div className="w-1/2 h-3 bg-slate-200 rounded" />
              <div className="w-3/4 h-4 bg-slate-200 rounded" />
              <div className="w-1/3 h-3 bg-slate-200 rounded" />
            </div>
            <div className="w-full h-8 bg-slate-200 rounded-xl mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-8 text-center space-y-3 shadow-xs my-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-[#718096] flex items-center justify-center mx-auto border border-[#E5EBE8]">
          <PackageX className="w-7 h-7 text-[#718096]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#18252B]">
            No Matching Supermarket Products
          </h3>
          <p className="text-xs text-[#718096] mt-1 max-w-xs mx-auto">
            Try adjusting your search query, increasing the price range, or selecting another category.
          </p>
        </div>
        {onResetFilters && (
          <div className="pt-1">
            <button
              onClick={onResetFilters}
              className="px-4 py-2 rounded-xl bg-[#17A890] hover:bg-[#128673] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
