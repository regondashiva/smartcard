"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Search, X, Tag } from "lucide-react";

interface SearchBarProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({
  products,
  onSelectProduct,
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter products for the quick dropdown search
  const filteredProducts = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
        )
        .slice(0, 6)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Box */}
      <div
        className={`relative flex items-center bg-white rounded-2xl border transition-all shadow-xs ${
          isFocused
            ? "border-[#17A890] ring-3 ring-[#17A890]/20"
            : "border-[#E5EBE8] hover:border-[#17A890]/40"
        }`}
      >
        <div className="pl-4 pr-2 text-[#718096] flex items-center justify-center">
          <Search className="w-4 h-4 text-[#718096]" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search products, brands (e.g. Amul, Eggs, Tea)..."
          className="w-full py-3 pr-9 text-xs sm:text-sm text-[#18252B] placeholder:text-[#718096] bg-transparent focus:outline-hidden"
          aria-label="Search products and brands"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
            }}
            className="absolute right-3 p-1 rounded-full text-[#718096] hover:text-[#18252B] hover:bg-slate-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Live Search Results Dropdown */}
      {isFocused && searchQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#E5EBE8] shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-1 duration-150 max-h-80 overflow-y-auto">
          <div className="p-2 border-b border-[#E5EBE8] bg-[#F7F9F8] flex items-center justify-between text-[11px] text-[#718096]">
            <span>Matching Products ({filteredProducts.length})</span>
            <span>Tap to preview</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="divide-y divide-[#E5EBE8]">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    setIsFocused(false);
                  }}
                  className="w-full p-2.5 flex items-center gap-3 text-left hover:bg-[#17A890]/5 transition-colors cursor-pointer group"
                >
                  <div className="relative w-11 h-11 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-[#E5EBE8]">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#17A890] uppercase block">
                      {product.brand}
                    </span>
                    <p className="text-xs font-semibold text-[#18252B] truncate group-hover:text-[#102B35]">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-[#718096]">
                      {product.unit}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#102B35] block">
                      {formatCurrency(product.price)}
                    </span>
                    {product.offerLabel && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#D97706] bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                        <Tag className="w-2.5 h-2.5" />
                        {product.offerLabel}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-xs font-semibold text-[#18252B]">
                No products found for &quot;{searchQuery}&quot;
              </p>
              <p className="text-[11px] text-[#718096] mt-1">
                Try searching for milk, tea, eggs, bread, or snacks.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
