"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductRecommendation } from "@/types/analytics";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  Plus,
  Check,
  Star,
  ShoppingBag,
  Tag,
} from "lucide-react";

interface RecommendedGridProps {
  recommendations: ProductRecommendation[];
}

export function RecommendedGrid({ recommendations }: RecommendedGridProps) {
  const { addItem, showToast, items } = useCart();

  if (recommendations.length === 0) {
    return null;
  }

  const handleAddToCart = (rec: ProductRecommendation) => {
    if (!rec.product.inStock) return;
    addItem(rec.product, 1);
    showToast(
      "Added to Cart",
      `1 × ${rec.product.name} added to your SmartCart.`,
      "success"
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#17A890]" />
          <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
            Recommended for You
          </h3>
        </div>
        <span className="text-[10px] text-[#718096] bg-white px-2 py-0.5 rounded-full border border-[#E5EBE8]">
          Personalized
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {recommendations.map((rec) => {
          const inCartCount =
            items.find((i) => i.product.id === rec.product.id)?.quantity || 0;

          return (
            <div
              key={rec.product.id}
              className="bg-white rounded-2xl border border-[#E5EBE8] p-3 flex flex-col justify-between shadow-xs hover:border-[#17A890]/40 transition-all space-y-2.5"
            >
              {/* Product Thumbnail & Recommendation Reason Tag */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-[#F0F4F2]">
                {rec.product.imageUrl ? (
                  <Image
                    src={rec.product.imageUrl}
                    alt={rec.product.name}
                    fill
                    sizes="180px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}

                {/* Offer tag if present */}
                {rec.product.offerLabel && (
                  <div className="absolute top-1.5 left-1.5 bg-[#E11D48] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                    {rec.product.offerLabel}
                  </div>
                )}
              </div>

              {/* Recommendation Reason Callout */}
              <div className="bg-[#17A890]/10 border border-[#17A890]/20 rounded-lg px-2 py-1">
                <p className="text-[9px] font-bold text-[#102B35] leading-tight line-clamp-1 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#17A890] shrink-0" />
                  <span>{rec.reason}</span>
                </p>
              </div>

              {/* Title & Brand */}
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] font-semibold text-[#718096] uppercase block truncate">
                  {rec.product.brand}
                </span>
                <Link
                  href={`/products/${rec.product.id}`}
                  className="text-xs font-bold text-[#102B35] hover:text-[#17A890] line-clamp-2 leading-tight transition-colors"
                >
                  {rec.product.name}
                </Link>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>{rec.product.unit}</span>
                  {rec.product.rating && (
                    <>
                      <span>•</span>
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                        {rec.product.rating}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Price & Add Button */}
              <div className="pt-1 border-t border-[#F0F4F2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#102B35]">
                    {formatCurrency(rec.product.price)}
                  </span>
                  {rec.product.originalPrice &&
                    rec.product.originalPrice > rec.product.price && (
                      <span className="text-[9px] text-[#718096] line-through block">
                        {formatCurrency(rec.product.originalPrice)}
                      </span>
                    )}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(rec)}
                  className="h-8 px-2.5 rounded-xl bg-[#17A890] hover:bg-[#128673] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Add to SmartCart"
                >
                  {inCartCount > 0 ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{inCartCount}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
