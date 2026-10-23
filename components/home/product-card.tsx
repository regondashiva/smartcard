"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Plus, Minus, Tag, Star, Package, ShoppingBag } from "lucide-react";
import { CartItem } from "@/types/cart";

export interface ProductCardProps {
  product: Product;
  onPreview?: (product: Product) => void;
  compact?: boolean;
  priority?: boolean;
}

export function ProductCard({
  product,
  onPreview,
  compact = false,
  priority = false,
}: ProductCardProps) {
  const router = useRouter();
  const { items, addItem, updateQuantity } = useCart();
  const [imageError, setImageError] = useState(false);

  const cartItem = items.find((item: CartItem) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked inside the stepper / button, do not navigate
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }
    if (onPreview) {
      onPreview(product);
    } else {
      router.push(`/products/${product.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border border-[#E5EBE8] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-[#17A890]/40 cursor-pointer ${
        compact ? "w-44 shrink-0" : "w-full"
      }`}
      role="article"
      aria-label={`${product.name} by ${product.brand}`}
    >
      {/* Product Image and Badges */}
      <div className="relative w-full aspect-4/3 bg-slate-100 overflow-hidden">
        {!imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              !product.inStock ? "grayscale opacity-60" : ""
            }`}
            sizes="(max-width: 640px) 176px, 240px"
            priority={priority}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center">
            <Package className="w-8 h-8 text-slate-300 mb-1" />
            <span className="text-[10px] font-bold text-slate-500 line-clamp-1">
              {product.brand}
            </span>
          </div>
        )}

        {/* Offer Tag */}
        {product.offerLabel && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 bg-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              <Tag className="w-2.5 h-2.5" />
              {product.offerLabel}
            </span>
          </div>
        )}

        {/* Out of Stock overlay badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center p-2">
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow">
              Out of Stock
            </span>
          </div>
        )}

        {/* Rating pill */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-md text-[10px] font-bold text-[#18252B] flex items-center gap-1 shadow-xs border border-black/5">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#17A890] uppercase tracking-wider block truncate">
            {product.brand}
          </span>
          <h3 className="text-xs font-bold text-[#18252B] line-clamp-2 mt-0.5 leading-snug group-hover:text-[#102B35]">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#718096] mt-0.5 font-medium">
            {product.unit}
          </p>
        </div>

        {/* Price and Add to Cart Stepper */}
        <div className="mt-3 pt-2.5 border-t border-[#E5EBE8] flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#102B35] leading-none">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-[#718096] line-through mt-0.5 leading-none">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stepper / Add button */}
          <div>
            {quantity > 0 ? (
              <div
                className="flex items-center bg-[#17A890]/10 border border-[#17A890] rounded-xl p-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-6 h-6 rounded-lg bg-white text-[#17A890] hover:bg-[#17A890] hover:text-white flex items-center justify-center text-xs font-bold transition-colors shadow-xs"
                  aria-label={`Decrease ${product.name} quantity`}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-[#102B35]">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-6 h-6 rounded-lg bg-[#17A890] text-white hover:bg-[#128673] flex items-center justify-center text-xs font-bold transition-colors shadow-xs"
                  aria-label={`Increase ${product.name} quantity`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addItem(product);
                }}
                disabled={!product.inStock}
                className={`text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 shadow-xs active:scale-95 ${
                  product.inStock
                    ? "bg-[#17A890] hover:bg-[#128673] text-white"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
