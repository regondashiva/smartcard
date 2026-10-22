"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { X, Star, ShoppingBag, Plus, Minus, Tag, Barcode, CheckCircle2 } from "lucide-react";

import { CartItem } from "@/types/cart";

interface ProductPreviewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductPreviewModal({ product, onClose }: ProductPreviewModalProps) {
  const { items, addItem, updateQuantity } = useCart();

  if (!product) return null;

  const cartItem = items.find((i: CartItem) => i.product.id === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-title"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#E5EBE8] overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200">
        {/* Image header with close button */}
        <div className="relative w-full h-56 bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 448px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close product preview"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#18252B] flex items-center justify-center hover:bg-white shadow transition-transform active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Offer & Stock badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
            {product.offerLabel && (
              <span className="inline-flex items-center gap-1 bg-[#D97706] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                <Tag className="w-3 h-3" />
                {product.offerLabel}
              </span>
            )}
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                product.inStock
                  ? "bg-[#16865C] text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Barcode badge at bottom left of image */}
          <div className="absolute bottom-3 left-3.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5 border border-white/10">
            <Barcode className="w-3.5 h-3.5 text-[#17A890]" />
            <span>EAN: {product.barcode}</span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <span className="text-xs font-semibold text-[#17A890] uppercase tracking-wider">
              {product.brand}
            </span>
            <h2 id="product-title" className="text-lg font-bold text-[#18252B] mt-0.5 leading-snug">
              {product.name}
            </h2>
            <p className="text-xs text-[#718096] mt-0.5 font-medium">
              Pack Size: {product.unit}
            </p>
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between py-2 border-y border-[#E5EBE8]">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#102B35]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[#718096] line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-[#F7F9F8] px-2.5 py-1 rounded-full border border-[#E5EBE8]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-[#18252B]">{product.rating}</span>
              <span className="text-[11px] text-[#718096]">({product.ratingCount})</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
                Description
              </h3>
              <p className="text-xs text-[#18252B] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Nutrition / Highlights */}
          {product.nutritionHighlights && product.nutritionHighlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                Highlights & Nutrition
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {product.nutritionHighlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#17A890]/10 text-[#102B35] text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#17A890]/20"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#17A890]" />
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 border-t border-[#E5EBE8] bg-[#F7F9F8] flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-[#718096]">Unit Price</p>
            <p className="text-base font-bold text-[#102B35] leading-none">
              {formatCurrency(product.price)}
            </p>
          </div>

          {currentQty > 0 ? (
            <div className="flex items-center bg-white border border-[#17A890] rounded-xl p-1 shadow-xs">
              <button
                onClick={() => updateQuantity(product.id, currentQty - 1)}
                className="w-8 h-8 rounded-lg bg-[#17A890]/10 text-[#17A890] hover:bg-[#17A890] hover:text-white flex items-center justify-center transition-colors font-bold"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-[#18252B]">
                {currentQty}
              </span>
              <button
                onClick={() => updateQuantity(product.id, currentQty + 1)}
                className="w-8 h-8 rounded-lg bg-[#17A890] text-white hover:bg-[#128673] flex items-center justify-center transition-colors font-bold"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(product)}
              disabled={!product.inStock}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm ${
                product.inStock
                  ? "bg-[#17A890] text-white hover:bg-[#128673]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
