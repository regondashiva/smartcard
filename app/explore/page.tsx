"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/types/product";
import { useCart } from "@/store/cart-store";
import { CategoryChips } from "@/components/products/category-chips";
import { ProductSearch } from "@/components/products/product-search";
import { ProductSortMenu, SortOption } from "@/components/products/product-sort-menu";
import {
  ProductFilterSheet,
  FilterState,
} from "@/components/products/product-filter-sheet";
import { ProductGrid } from "@/components/products/product-grid";
import {
  ArrowLeft,
  ShoppingCart,
  SlidersHorizontal,
  MapPin,
  Sparkles,
} from "lucide-react";

const INITIAL_FILTERS: FilterState = {
  categoryId: "all",
  minPrice: 0,
  maxPrice: 1000,
  inStockOnly: false,
  offersOnly: false,
  selectedBrand: "",
};

export default function ExplorePage() {
  const { selectedStore, getItemCount } = useCart();
  const itemCount = getItemCount();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentSort, setCurrentSort] = useState<SortOption>("recommended");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Extract unique brands for filtering
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    PRODUCTS.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, []);

  // Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId !== "all") count++;
    if (filters.maxPrice < 1000) count++;
    if (filters.inStockOnly) count++;
    if (filters.offersOnly) count++;
    if (filters.selectedBrand !== "") count++;
    return count;
  }, [filters]);

  // Combined search, filter, and sort
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filtering
    const result = PRODUCTS.filter((product) => {
      // Category
      if (filters.categoryId !== "all" && product.category !== filters.categoryId) {
        return false;
      }

      // In Stock
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // Offers Only
      if (filters.offersOnly && !product.offerLabel) {
        return false;
      }

      // Max Price
      if (product.price > filters.maxPrice) {
        return false;
      }

      // Brand
      if (filters.selectedBrand && product.brand !== filters.selectedBrand) {
        return false;
      }

      // Search Query (Name, Brand, Category, Barcode, Tags)
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesBarcode = product.barcode.includes(q);
        const matchesTags =
          product.tags && product.tags.some((t) => t.toLowerCase().includes(q));

        if (
          !matchesName &&
          !matchesBrand &&
          !matchesCategory &&
          !matchesBarcode &&
          !matchesTags
        ) {
          return false;
        }
      }

      return true;
    });

    // 2. Sorting
    return result.sort((a, b) => {
      switch (currentSort) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "popular":
          return (b.popularityScore || b.ratingCount) - (a.popularityScore || a.ratingCount);
        case "recommended":
        default:
          // Prioritize recommended, then rating
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return b.rating - a.rating;
      }
    });
  }, [filters, searchQuery, currentSort]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery("");
    setCurrentSort("recommended");
  };

  return (
    <div className="space-y-4">
      {/* Catalogue Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Back to home screen"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#102B35] leading-tight">
              Explore Products
            </h1>
            <p className="text-[11px] text-[#718096] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#17A890]" />
              <span className="truncate">{selectedStore.name}</span>
            </p>
          </div>
        </div>

        {/* Live Cart Action */}
        <Link
          href="/cart"
          className="relative w-9 h-9 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#18252B] hover:bg-slate-50 transition-colors shadow-2xs"
          aria-label={`View cart with ${itemCount} items`}
        >
          <ShoppingCart className="w-4 h-4 text-[#102B35]" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#D97706] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Real-Time Search Bar */}
      <ProductSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredAndSortedProducts.length}
      />

      {/* Horizontal Category Chips */}
      <CategoryChips
        categories={CATEGORIES}
        selectedCategoryId={filters.categoryId}
        onSelectCategory={(catId) =>
          setFilters((prev) => ({ ...prev, categoryId: catId }))
        }
      />

      {/* Toolbar: Filter Trigger & Sorting Menu */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilterCount > 0
              ? "bg-[#17A890] text-white border-[#17A890] shadow-xs"
              : "bg-white border-[#E5EBE8] text-[#18252B] hover:border-[#17A890]/40 shadow-2xs"
          }`}
          aria-label="Open filter settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-[#17A890] text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#718096] hidden xs:inline">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "item" : "items"}
          </span>
          <ProductSortMenu
            currentSort={currentSort}
            onSortChange={setCurrentSort}
          />
        </div>
      </div>

      {/* Responsive Product Grid */}
      <ProductGrid
        products={filteredAndSortedProducts}
        onResetFilters={handleResetFilters}
      />

      {/* Filter Bottom Sheet Modal */}
      <ProductFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={handleResetFilters}
        categories={CATEGORIES}
        availableBrands={availableBrands}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
