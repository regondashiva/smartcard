"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { AssistantProductCard } from "@/types/assistant";
import { useCart } from "@/store/cart-store";
import {
  ShoppingCart,
  Check,
  Star,
  ExternalLink,
  Info,
} from "lucide-react";

interface ProductRecommendationCardProps {
  card: AssistantProductCard;
  onPreview?: (product: Product) => void;
}

export function ProductRecommendationCard({
  card,
  onPreview,
}: ProductRecommendationCardProps) {
  const { product, reason, badge } = card;
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  // Check if item is already in cart
  const cartItem = items.find((i) => i.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5EBE8] p-3 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Top Image + Badges */}
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-50 mb-2.5">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 240px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {badge && (
            <span className="absolute top-2 left-2 bg-[#17A890] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {badge}
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Brand & Name */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="font-semibold uppercase tracking-wider">{product.brand}</span>
          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>

        <h4 className="text-xs font-bold text-[#102B35] line-clamp-2 leading-snug mb-1">
          {product.name}
        </h4>

        <div className="text-[11px] text-slate-400 font-medium mb-2">
          {product.unit}
        </div>

        {/* Reason banner */}
        {reason && (
          <div className="bg-[#17A890]/10 border border-[#17A890]/20 rounded-md p-1.5 mb-2.5 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#17A890] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#102B35] leading-tight font-medium">
              {reason}
            </p>
          </div>
        )}
      </div>

      <div>
        {/* Price Row */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-base font-extrabold text-[#102B35]">
            ₹{product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-1.5">
          {onPreview ? (
            <button
              onClick={() => onPreview(product)}
              className="w-full py-1.5 px-2 rounded-lg border border-[#E5EBE8] bg-[#F7F9F8] hover:bg-[#EEF2F0] text-[11px] font-bold text-[#102B35] flex items-center justify-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Details</span>
            </button>
          ) : (
            <Link
              href={`/products/${product.id}`}
              className="w-full py-1.5 px-2 rounded-lg border border-[#E5EBE8] bg-[#F7F9F8] hover:bg-[#EEF2F0] text-[11px] font-bold text-[#102B35] flex items-center justify-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Details</span>
            </Link>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              !product.inStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white"
                : inCartQty > 0
                ? "bg-[#102B35] text-white hover:bg-[#0B1D24]"
                : "bg-[#17A890] text-white hover:bg-[#138975]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added!</span>
              </>
            ) : inCartQty > 0 ? (
              <>
                <ShoppingCart className="w-3 h-3" />
                <span>In Cart ({inCartQty})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
