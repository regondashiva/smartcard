"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/utils";
import { QuantityControl } from "./quantity-control";
import { Trash2, Package, Tag, AlertTriangle } from "lucide-react";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const { product, quantity } = item;
  const [imageError, setImageError] = useState(false);
  const maxStock = product.stockCount ? Math.min(product.stockCount, 99) : 99;
  const lineTotal = product.price * quantity;

  const isLowStock =
    product.inStock && product.stockCount && product.stockCount <= 5;

  return (
    <div className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 transition-colors hover:bg-slate-50/70 group">
      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-[#E5EBE8] shadow-2xs group-hover:border-[#17A890]/40 transition-colors"
      >
        {!imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition-transform group-hover:scale-105 duration-200 ${
              !product.inStock ? "grayscale opacity-50" : ""
            }`}
            sizes="72px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            <Package className="w-6 h-6" />
          </div>
        )}

        {product.offerLabel && (
          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-bold px-1 py-0.2 rounded shadow-2xs">
            {product.offerLabel}
          </span>
        )}
      </Link>

      {/* Product Info Column */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-[#17A890] uppercase tracking-wider">
            {product.brand}
          </span>
          {isLowStock && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200">
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>Only {product.stockCount} left</span>
            </span>
          )}
        </div>

        <Link
          href={`/products/${product.id}`}
          className="text-xs sm:text-sm font-bold text-[#102B35] hover:text-[#17A890] transition-colors line-clamp-1 block"
        >
          {product.name}
        </Link>

        <p className="text-[11px] text-[#718096]">
          {product.unit} {product.weight ? `• ${product.weight}` : ""} •{" "}
          <span className="font-semibold text-[#18252B]">
            {formatCurrency(product.price)}
          </span>{" "}
          each
        </p>
      </div>

      {/* Controls & Line Total Column */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-black text-[#102B35]">
            {formatCurrency(lineTotal)}
          </span>

          {/* Remove Button */}
          <button
            type="button"
            onClick={onRemove}
            className="w-7 h-7 rounded-xl bg-transparent hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label={`Remove ${product.name} from cart`}
            title="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quantity Controls */}
        <QuantityControl
          quantity={quantity}
          maxStock={maxStock}
          onIncrease={() => onUpdateQuantity(quantity + 1)}
          onDecrease={() => onUpdateQuantity(quantity - 1)}
          size="sm"
        />
      </div>
    </div>
  );
}
