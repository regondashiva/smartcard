"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/cart-store";
import { CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  WifiOff,
  Tag,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    session,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getSavings,
    getItemCount,
    startSession,
  } = useCart();

  const subtotal = getSubtotal();
  const savings = getSavings();
  const itemCount = getItemCount();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#102B35]">My Smart Cart</h1>
            <p className="text-xs text-[#718096]">
              {itemCount} {itemCount === 1 ? "item" : "items"} added
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-[#17A890] px-2 py-0.5 rounded-full border border-teal-200">
          Module 5 Preview
        </span>
      </div>

      {/* Session State Callout */}
      {session.isActive ? (
        <div className="bg-[#102B35] text-white p-3 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16865C] animate-pulse" />
            <span className="font-semibold">{session.cartTag} Connected</span>
          </div>
          <span className="text-[11px] text-slate-300 font-mono">
            {session.id}
          </span>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>No shopping session active</span>
          </div>
          <button
            onClick={startSession}
            className="text-[11px] font-bold text-teal-800 underline hover:opacity-80"
          >
            Start Demo Session
          </button>
        </div>
      )}

      {/* Cart Items List */}
      {items.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#18252B]">
              Scanned Cart Items
            </span>
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>

          <div className="divide-y divide-[#E5EBE8] bg-white rounded-2xl border border-[#E5EBE8] overflow-hidden shadow-xs">
            {items.map((cartItem: CartItem) => {
              const { product, quantity } = cartItem;
              return (
              <div key={product.id} className="p-3.5 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-[#E5EBE8]">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#17A890] uppercase block">
                    {product.brand}
                  </span>
                  <h3 className="text-xs font-bold text-[#18252B] truncate">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-[#718096]">
                    {product.unit} • {formatCurrency(product.price)} each
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-black text-[#102B35]">
                    {formatCurrency(product.price * quantity)}
                  </span>

                  <div className="flex items-center bg-[#F7F9F8] border border-[#E5EBE8] rounded-xl p-0.5">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white text-[#17A890] hover:bg-[#17A890] hover:text-white flex items-center justify-center transition-colors shadow-2xs font-bold"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#18252B]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-[#17A890] text-white hover:bg-[#128673] flex items-center justify-center transition-colors shadow-2xs font-bold"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-2xl border border-[#E5EBE8] p-4 space-y-2.5 shadow-xs">
            <h3 className="text-xs font-bold text-[#18252B] uppercase tracking-wider">
              Live Bill Breakdown
            </h3>

            <div className="space-y-1.5 text-xs text-[#718096]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#18252B]">
                  {formatCurrency(subtotal + savings)}
                </span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Store Discounts
                  </span>
                  <span>-{formatCurrency(savings)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST & Tax</span>
                <span className="font-semibold text-emerald-700">Included</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5EBE8] flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#718096] block">To Pay</span>
                <span className="text-lg font-black text-[#102B35]">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Saved {formatCurrency(savings)}</span>
              </div>
            </div>
          </div>

          {/* Checkout placeholder note */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-[#718096] space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#102B35]">
              <Sparkles className="w-4 h-4 text-[#17A890]" />
              <span>Module 8: Digital UPI / Card Checkout</span>
            </div>
            <p className="leading-snug">
              Instant digital checkout and exit QR receipt generation will be integrated in subsequent modules.
            </p>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="bg-white rounded-3xl border border-[#E5EBE8] p-8 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#17A890] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#18252B]">
              Your Cart is Empty
            </h2>
            <p className="text-xs text-[#718096] mt-1 max-w-xs mx-auto">
              Scan product barcodes in the supermarket aisle or add items from the home screen.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
            <Link
              href="/"
              className="bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/scan"
              className="bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Scanner</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
