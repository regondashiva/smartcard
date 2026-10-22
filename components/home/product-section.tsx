"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/home/product-card";
import { LucideIcon, Sparkles } from "lucide-react";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onPreview: (product: Product) => void;
  icon?: LucideIcon;
  variant?: "grid" | "carousel";
  emptyMessage?: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  onPreview,
  icon: Icon = Sparkles,
  variant = "grid",
  emptyMessage = "No products found in this category.",
}: ProductSectionProps) {
  if (products.length === 0) {
    return (
      <section className="bg-white rounded-2xl border border-[#E5EBE8] p-8 text-center space-y-2">
        <p className="text-sm font-semibold text-[#18252B]">{emptyMessage}</p>
        <p className="text-xs text-[#718096]">
          Try switching categories or searching with a different term.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#17A890]">
            <Icon className="w-3.5 h-3.5" />
            <h2 className="text-base font-bold text-[#102B35] tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs text-[#718096] mt-0.5">{subtitle}</p>
          )}
        </div>
        <span className="text-xs font-medium text-[#718096] hidden xs:inline">
          {products.length} {products.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Render Carousel or Grid */}
      {variant === "carousel" ? (
        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-0.5 no-scrollbar scroll-smooth">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPreview={onPreview}
              compact
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPreview={onPreview}
            />
          ))}
        </div>
      )}
    </section>
  );
}
