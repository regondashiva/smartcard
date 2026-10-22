"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  Tag,
  Barcode,
  Package,
  RotateCcw,
  ChevronRight,
  ShieldAlert,
  MapPin,
} from "lucide-react";

interface ScanResultSheetProps {
  product: Product | null;
  scannedBarcode: string;
  isOpen: boolean;
  onClose: () => void;
  onScanAgain: () => void;
}

export function ScanResultSheet({
  product,
  scannedBarcode,
  isOpen,
  onClose,
  onScanAgain,
}: ScanResultSheetProps) {
  const { addItem, session, startSession, getItemCount, getSubtotal } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset state when a new product is loaded
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsAddedSuccess(false);
      setImageError(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const maxSelectableStock = product.stockCount
    ? Math.min(product.stockCount, 10)
    : 10;

  const handleAddToCart = () => {
    if (!product.inStock) return;

    // If session is not active, initiate demo session seamlessly
    if (!session.isActive) {
      startSession();
    }

    addItem(product, quantity);
    setIsAddedSuccess(true);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-[#E5EBE8] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-result-title"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E5EBE8] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
              Product Matched
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#718096] hover:text-[#18252B] hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close product sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto no-scrollbar">
          {/* Success Banner if added */}
          {isAddedSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900">
                  Added to Your SmartCart!
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {quantity}x {product.name} ({formatCurrency(product.price * quantity)})
                </p>
                <p className="text-[11px] text-emerald-600 mt-1">
                  Cart total: {getItemCount()} items • {formatCurrency(getSubtotal())}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={onScanAgain}
                  className="flex-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs py-2.5 px-3 rounded-xl border border-emerald-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scan Next Item</span>
                </button>

                <Link
                  href="/cart"
                  className="flex-1 bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#17A890]" />
                  <span>View Cart ({getItemCount()})</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Product Details Preview */
            <>
              <div className="flex gap-3.5">
                {/* Product Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 border border-[#E5EBE8] overflow-hidden shrink-0 shadow-xs">
                  {!imageError ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className={`object-cover ${
                        !product.inStock ? "grayscale opacity-50" : ""
                      }`}
                      sizes="112px"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <Package className="w-8 h-8" />
                    </div>
                  )}

                  {discountPercent && (
                    <span className="absolute top-1.5 left-1.5 bg-[#16865C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Info Column */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-[#17A890] uppercase tracking-wider">
                      {product.brand}
                    </span>
                    {product.offerLabel && (
                      <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                        <Tag className="w-2.5 h-2.5" />
                        {product.offerLabel}
                      </span>
                    )}
                  </div>

                  <h3
                    id="scan-result-title"
                    className="text-sm sm:text-base font-bold text-[#102B35] leading-snug line-clamp-2"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#718096]">
                    Size: {product.unit} {product.weight ? `• ${product.weight}` : ""}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-lg font-black text-[#102B35]">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-xs text-[#718096] line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Barcode & Shelf Location Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 bg-[#F7F9F8] border border-[#E5EBE8] text-[#18252B] font-mono px-2.5 py-1 rounded-lg">
                  <Barcode className="w-3.5 h-3.5 text-[#17A890]" />
                  <span>EAN: {product.barcode || scannedBarcode}</span>
                </span>

                {product.shelfLocation && (
                  <span className="inline-flex items-center gap-1 bg-[#F7F9F8] border border-[#E5EBE8] text-[#718096] px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3 h-3 text-[#17A890]" />
                    <span>{product.shelfLocation}</span>
                  </span>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div className="p-3 rounded-xl bg-[#F7F9F8] border border-[#E5EBE8] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#18252B]">
                  Store Availability
                </span>
                <span
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    product.inStock ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product.inStock ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {product.inStock
                    ? product.stockCount && product.stockCount <= 10
                      ? `Low Stock (${product.stockCount} left)`
                      : "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

              {/* Out of Stock Warning Notice if applicable */}
              {!product.inStock && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>
                    This product is currently out of stock in this supermarket branch.
                  </span>
                </div>
              )}

              {/* Quantity Stepper Selector (Only if in stock) */}
              {product.inStock && (
                <div className="pt-2 border-t border-[#E5EBE8] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#18252B] block">
                      Quantity to Add
                    </span>
                    <span className="text-[11px] text-[#718096]">
                      Item Total: {formatCurrency(product.price * quantity)}
                    </span>
                  </div>

                  <div className="flex items-center bg-[#F7F9F8] border border-[#CBD5E1] rounded-2xl p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-xl bg-white text-[#102B35] hover:bg-slate-100 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors disabled:opacity-40 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-bold text-sm text-[#102B35] font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(maxSelectableStock, q + 1))
                      }
                      disabled={quantity >= maxSelectableStock}
                      className="w-8 h-8 rounded-xl bg-[#17A890] text-white hover:bg-[#128673] flex items-center justify-center font-bold text-sm shadow-2xs transition-colors disabled:opacity-40 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isAddedSuccess && (
          <div className="p-4 bg-[#F7F9F8] border-t border-[#E5EBE8] space-y-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer ${
                product.inStock
                  ? "bg-[#17A890] hover:bg-[#128673] text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {product.inStock
                  ? `Confirm & Add to Cart • ${formatCurrency(
                      product.price * quantity
                    )}`
                  : "Item Out of Stock"}
              </span>
            </button>

            <button
              type="button"
              onClick={onScanAgain}
              className="w-full py-2.5 text-center text-xs font-bold text-[#718096] hover:text-[#18252B] transition-colors cursor-pointer"
            >
              Scan Another Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
