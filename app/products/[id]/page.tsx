"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/types/product";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/home/product-card";
import {
  ArrowLeft,
  ShoppingCart,
  Tag,
  Star,
  Barcode,
  Package,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  PackageX,
} from "lucide-react";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { items, addItem, updateQuantity, getItemCount } = useCart();
  const cartItemCount = getItemCount();

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Find product from dataset
  const product = PRODUCTS.find((p) => p.id === id);

  // If product not found
  if (!product) {
    return (
      <div className="max-w-md mx-auto py-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-[#718096] flex items-center justify-center mx-auto border border-[#E5EBE8]">
          <PackageX className="w-8 h-8 text-[#718096]" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[#102B35]">
            Product Not Found
          </h1>
          <p className="text-xs text-[#718096] mt-1">
            The requested item does not exist or has been removed from the catalogue.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/explore"
            className="px-5 py-2.5 rounded-xl bg-[#17A890] hover:bg-[#128673] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalogue</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discount percent
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Find category display name
  const categoryName =
    CATEGORIES.find((c) => c.id === product.category)?.name || product.category;

  // Related products from same category, excluding current item
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Max selectable quantity (capped at 10 or stockCount)
  const maxStock = product.stockCount ? Math.min(product.stockCount, 10) : 10;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold text-[#102B35] truncate max-w-[200px]">
          {product.brand}
        </span>

        {/* Live Cart Action */}
        <Link
          href="/cart"
          className="relative w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] flex items-center justify-center text-[#18252B] hover:bg-slate-50 transition-colors shadow-2xs"
          aria-label={`View cart (${cartItemCount} items)`}
        >
          <ShoppingCart className="w-4 h-4 text-[#102B35]" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#D97706] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Product Image Area */}
      <div className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden shadow-md border border-[#E5EBE8] bg-slate-50">
        {!imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`object-cover ${!product.inStock ? "grayscale opacity-60" : ""}`}
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <Package className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-500">{product.name}</p>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
          {product.offerLabel && (
            <span className="inline-flex items-center gap-1 bg-[#D97706] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              <Tag className="w-3 h-3" />
              {product.offerLabel}
            </span>
          )}
          {discountPercent && (
            <span className="bg-[#16865C] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Barcode & Shelf Location Overlay */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
          <div className="bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
            <Barcode className="w-3.5 h-3.5 text-[#17A890]" />
            <span>EAN: {product.barcode}</span>
          </div>

          {product.shelfLocation && (
            <div className="bg-black/75 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/10">
              <MapPin className="w-3 h-3 text-[#17A890]" />
              <span>{product.shelfLocation}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-sm space-y-4">
        {/* Brand, Name & Pack Size */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#17A890] uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-[11px] font-semibold text-[#718096] bg-[#F7F9F8] px-2 py-0.5 rounded-full border border-[#E5EBE8]">
              {categoryName}
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-black text-[#102B35] mt-1 leading-snug">
            {product.name}
          </h1>

          <p className="text-xs text-[#718096] mt-0.5 font-medium">
            Pack Size: {product.unit} {product.weight ? `• ${product.weight}` : ""}
          </p>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between py-2.5 border-y border-[#E5EBE8]">
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-black text-[#102B35]">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-[#718096] line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-[#F7F9F8] px-2.5 py-1 rounded-xl border border-[#E5EBE8]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-[#18252B]">{product.rating}</span>
            <span className="text-[11px] text-[#718096]">({product.ratingCount})</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              product.inStock ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span
            className={`text-xs font-bold ${
              product.inStock ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {product.inStock
              ? product.stockCount && product.stockCount <= 10
                ? `Low Stock: Only ${product.stockCount} left in aisle`
                : "In Stock at Selected Store"
              : "Currently Out of Stock"}
          </span>
        </div>

        {/* Quantity Stepper */}
        {product.inStock && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-[#18252B]">Select Quantity</span>
            <div className="flex items-center bg-[#F7F9F8] border border-[#CBD5E1] rounded-2xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-xl bg-white text-[#102B35] hover:bg-slate-100 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors disabled:opacity-40 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-[#102B35] font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(maxStock, prev + 1))}
                disabled={quantity >= maxStock}
                className="w-8 h-8 rounded-xl bg-[#17A890] text-white hover:bg-[#128673] flex items-center justify-center font-bold text-sm shadow-2xs transition-colors disabled:opacity-40 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Description Section */}
        {product.description && (
          <div className="pt-2 border-t border-[#E5EBE8] space-y-1">
            <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider">
              Product Overview
            </h2>
            <p className="text-xs text-[#18252B] leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Nutrition / Product Highlights */}
        {product.nutritionHighlights && product.nutritionHighlights.length > 0 && (
          <div className="pt-2 border-t border-[#E5EBE8] space-y-1.5">
            <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider">
              Key Highlights
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {product.nutritionHighlights.map((highlight, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-[#17A890]/10 text-[#102B35] text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[#17A890]/20"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#17A890]" />
                  <span>{highlight}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products ("You may also like") */}
      {relatedProducts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#17A890]">
                <Sparkles className="w-3.5 h-3.5" />
                <h2 className="text-sm font-bold text-[#102B35]">
                  You May Also Like
                </h2>
              </div>
              <p className="text-[11px] text-[#718096]">
                Similar fresh picks in {categoryName}
              </p>
            </div>
            <Link
              href="/explore"
              className="text-xs font-bold text-[#17A890] hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} compact />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EBE8] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] p-3">
        <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-[#718096] block">
              Total ({quantity} {quantity === 1 ? "unit" : "units"})
            </span>
            <span className="text-lg font-black text-[#102B35] leading-none">
              {formatCurrency(product.price * quantity)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {addedSuccess && (
              <Link
                href="/cart"
                className="py-2.5 px-3 rounded-xl bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>View Cart</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#17A890]" />
              </Link>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                product.inStock
                  ? "bg-[#17A890] hover:bg-[#128673] text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{product.inStock ? "Add to SmartCart" : "Out of Stock"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
