"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductComparison } from "@/types/assistant";
import { useCart } from "@/store/cart-store";
import {
  Check,
  ShoppingCart,
  Star,
  ExternalLink,
  Scale,
  Sparkles,
} from "lucide-react";

interface ProductComparisonCardProps {
  comparison: ProductComparison;
}

export function ProductComparisonCard({ comparison }: ProductComparisonCardProps) {
  const { items, cheaperProductId, comparisonSummary, tradeoffs } = comparison;
  const [prodA, prodB] = items;
  const { addItem, items: cartItems } = useCart();
  const [addedA, setAddedA] = useState(false);
  const [addedB, setAddedB] = useState(false);

  const cartItemA = cartItems.find((i) => i.product.id === prodA.product.id);
  const cartItemB = cartItems.find((i) => i.product.id === prodB.product.id);

  const handleAddA = () => {
    if (!prodA.product.inStock) return;
    addItem(prodA.product, 1);
    setAddedA(true);
    setTimeout(() => setAddedA(false), 1800);
  };

  const handleAddB = () => {
    if (!prodB.product.inStock) return;
    addItem(prodB.product, 1);
    setAddedB(true);
    setTimeout(() => setAddedB(false), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-sm space-y-4 my-2">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#E5EBE8] pb-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#17A890]/15 flex items-center justify-center text-[#17A890]">
          <Scale className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#102B35]">Side-by-Side Product Comparison</h4>
          <p className="text-[10px] text-slate-500">Verified catalogue attributes & live pricing</p>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Product A */}
        <div
          className={`rounded-xl border p-3 flex flex-col justify-between ${
            cheaperProductId === prodA.product.id
              ? "border-[#17A890] bg-[#17A890]/5"
              : "border-[#E5EBE8] bg-[#F7F9F8]"
          }`}
        >
          <div>
            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-white mb-2">
              <Image
                src={prodA.product.imageUrl}
                alt={prodA.product.name}
                fill
                sizes="150px"
                className="object-cover"
              />
              {cheaperProductId === prodA.product.id && (
                <span className="absolute top-1.5 left-1.5 bg-[#17A890] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                  Lower Price
                </span>
              )}
            </div>

            <span className="text-[10px] font-bold uppercase text-slate-400">
              {prodA.brand}
            </span>
            <h5 className="text-xs font-bold text-[#102B35] line-clamp-2 leading-tight mb-1">
              {prodA.product.name}
            </h5>

            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mb-2">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{prodA.rating}</span>
            </div>

            {/* Spec rows */}
            <div className="space-y-1 text-[10px] text-slate-600 border-t border-[#E5EBE8] pt-2 mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Pack:</span>
                <span className="font-semibold text-[#102B35]">{prodA.packSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stock:</span>
                <span className={`font-semibold ${prodA.inStock ? "text-emerald-600" : "text-red-500"}`}>
                  {prodA.inStock ? "In Stock" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-black text-[#102B35] mb-2">
              ₹{prodA.price}
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={handleAddA}
                disabled={!prodA.inStock}
                className={`w-full py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                  !prodA.inStock
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : addedA
                    ? "bg-emerald-600 text-white"
                    : cartItemA
                    ? "bg-[#102B35] text-white"
                    : "bg-[#17A890] text-white hover:bg-[#138975]"
                }`}
              >
                {addedA ? (
                  <>
                    <Check className="w-2.5 h-2.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-2.5 h-2.5" />
                    <span>{cartItemA ? `In Cart (${cartItemA.quantity})` : "Add"}</span>
                  </>
                )}
              </button>
              <Link
                href={`/products/${prodA.product.id}`}
                className="w-full py-1 text-center text-[10px] font-semibold text-[#17A890] hover:underline flex items-center justify-center gap-0.5"
              >
                <span>View Details</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Product B */}
        <div
          className={`rounded-xl border p-3 flex flex-col justify-between ${
            cheaperProductId === prodB.product.id
              ? "border-[#17A890] bg-[#17A890]/5"
              : "border-[#E5EBE8] bg-[#F7F9F8]"
          }`}
        >
          <div>
            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-white mb-2">
              <Image
                src={prodB.product.imageUrl}
                alt={prodB.product.name}
                fill
                sizes="150px"
                className="object-cover"
              />
              {cheaperProductId === prodB.product.id && (
                <span className="absolute top-1.5 left-1.5 bg-[#17A890] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                  Lower Price
                </span>
              )}
            </div>

            <span className="text-[10px] font-bold uppercase text-slate-400">
              {prodB.brand}
            </span>
            <h5 className="text-xs font-bold text-[#102B35] line-clamp-2 leading-tight mb-1">
              {prodB.product.name}
            </h5>

            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mb-2">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{prodB.rating}</span>
            </div>

            {/* Spec rows */}
            <div className="space-y-1 text-[10px] text-slate-600 border-t border-[#E5EBE8] pt-2 mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Pack:</span>
                <span className="font-semibold text-[#102B35]">{prodB.packSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stock:</span>
                <span className={`font-semibold ${prodB.inStock ? "text-emerald-600" : "text-red-500"}`}>
                  {prodB.inStock ? "In Stock" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-black text-[#102B35] mb-2">
              ₹{prodB.price}
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={handleAddB}
                disabled={!prodB.inStock}
                className={`w-full py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                  !prodB.inStock
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : addedB
                    ? "bg-emerald-600 text-white"
                    : cartItemB
                    ? "bg-[#102B35] text-white"
                    : "bg-[#17A890] text-white hover:bg-[#138975]"
                }`}
              >
                {addedB ? (
                  <>
                    <Check className="w-2.5 h-2.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-2.5 h-2.5" />
                    <span>{cartItemB ? `In Cart (${cartItemB.quantity})` : "Add"}</span>
                  </>
                )}
              </button>
              <Link
                href={`/products/${prodB.product.id}`}
                className="w-full py-1 text-center text-[10px] font-semibold text-[#17A890] hover:underline flex items-center justify-center gap-0.5"
              >
                <span>View Details</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trade-offs & Summary */}
      <div className="bg-[#102B35]/5 rounded-xl p-3 border border-[#102B35]/10 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#102B35]">
          <Sparkles className="w-3.5 h-3.5 text-[#17A890]" />
          <span>Key Insights & Neutral Trade-offs</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          {comparisonSummary}
        </p>
        <ul className="space-y-1 text-[10px] text-slate-500 list-disc pl-4">
          {tradeoffs.map((t, idx) => (
            <li key={idx}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
