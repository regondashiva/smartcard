"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FrequentlyPurchasedProduct } from "@/types/analytics";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import {
  RotateCcw,
  Plus,
  Check,
  ShoppingBag,
  Clock,
  Sparkles,
} from "lucide-react";

interface BuyAgainCarouselProps {
  products: FrequentlyPurchasedProduct[];
}

export function BuyAgainCarousel({ products }: BuyAgainCarouselProps) {
  const { addItem, showToast, items } = useCart();

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-5 text-center space-y-2 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#17A890] flex items-center justify-center mx-auto">
          <RotateCcw className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-[#102B35]">No Purchase History Yet</p>
        <p className="text-[11px] text-[#718096]">
          Items you buy will appear here for fast, one-tap reordering on your next store visit.
        </p>
        <Link
          href="/explore"
          className="inline-block text-xs font-bold text-[#17A890] hover:underline pt-1"
        >
          Explore Catalogue &rarr;
        </Link>
      </div>
    );
  }

  const handleAddToCart = (item: FrequentlyPurchasedProduct) => {
    if (!item.inStock) return;
    addItem(item.product, 1);
    showToast(
      "Added to Cart",
      `1 × ${item.productName} added to your SmartCart.`,
      "success"
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-[#17A890]" />
          <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
            Buy Again • Frequently Purchased
          </h3>
        </div>
        <span className="text-[10px] text-[#718096] bg-white px-2 py-0.5 rounded-full border border-[#E5EBE8]">
          {products.length} products
        </span>
      </div>

      {/* Horizontal Scrollable Row */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
        {products.map((item) => {
          const inCartCount =
            items.find((i) => i.product.id === item.productId)?.quantity || 0;

          return (
            <div
              key={item.productId}
              className="w-44 shrink-0 bg-white rounded-2xl border border-[#E5EBE8] p-3 flex flex-col justify-between shadow-2xs hover:border-[#17A890]/40 transition-all space-y-2.5"
            >
              {/* Product Thumbnail & Frequency Badge */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-[#F0F4F2]">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="160px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}

                {/* Times purchased badge */}
                <div className="absolute top-1.5 left-1.5 bg-[#102B35]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-0.5">
                  <RotateCcw className="w-2.5 h-2.5 text-[#17A890]" />
                  <span>Bought {item.timesPurchased}×</span>
                </div>
              </div>

              {/* Product Title & Brand */}
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] font-semibold text-[#718096] uppercase block truncate">
                  {item.brand}
                </span>
                <Link
                  href={`/products/${item.productId}`}
                  className="text-xs font-bold text-[#102B35] hover:text-[#17A890] line-clamp-2 leading-tight transition-colors"
                >
                  {item.productName}
                </Link>
                <span className="text-[10px] text-slate-400 block">{item.unit}</span>
              </div>

              {/* Pricing & Add to Cart Action */}
              <div className="pt-1 border-t border-[#F0F4F2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#102B35]">
                    {formatCurrency(item.currentPrice)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.currentPrice && (
                    <span className="text-[9px] text-[#718096] line-through block">
                      {formatCurrency(item.originalPrice)}
                    </span>
                  )}
                </div>

                {item.inStock ? (
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
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
                ) : (
                  <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-lg">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
