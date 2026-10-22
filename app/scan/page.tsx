"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart-store";
import { BarcodeScanner } from "@/components/scanner/barcode-scanner";
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const { selectedStore, getItemCount, session } = useCart();
  const cartItemCount = getItemCount();

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#102B35] leading-tight">
              Scan a Product
            </h1>
            <p className="text-[11px] text-[#718096] flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-[#17A890]" />
              <span className="truncate max-w-[180px] sm:max-w-xs">
                {selectedStore.name}
              </span>
            </p>
          </div>
        </div>

        {/* Live Cart Link */}
        <Link
          href="/cart"
          className="relative w-9 h-9 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#18252B] hover:bg-slate-50 transition-colors shadow-2xs"
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

      {/* Active Session Status Callout */}
      {session.isActive ? (
        <div className="bg-[#102B35] text-white px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16865C] animate-pulse" />
            <span className="font-semibold">{session.cartTag} Session Active</span>
          </div>
          <span className="text-[11px] text-[#17A890] font-mono">
            {session.id}
          </span>
        </div>
      ) : (
        <div className="bg-[#17A890]/10 border border-[#17A890]/30 text-[#102B35] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#17A890] shrink-0" />
            <span>Scanning an item automatically initializes your SmartCart</span>
          </div>
        </div>
      )}

      {/* Main Barcode Scanner Component */}
      <BarcodeScanner />

      {/* Supermarket Scanning Guidelines & Tips */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-4.5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#102B35]">
          <Info className="w-4 h-4 text-[#17A890]" />
          <span>Self-Checkout Scanning Tips</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#718096]">
          <div className="bg-[#F7F9F8] p-3 rounded-2xl border border-[#E5EBE8] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#18252B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#17A890]" />
              <span>Distance & Angle</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Hold camera 10–15 cm away, parallel to the printed barcode label.
            </p>
          </div>

          <div className="bg-[#F7F9F8] p-3 rounded-2xl border border-[#E5EBE8] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#18252B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#17A890]" />
              <span>Lighting & Glare</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Use the built-in torch toggle in dim aisles or adjust angle to avoid reflections.
            </p>
          </div>

          <div className="bg-[#F7F9F8] p-3 rounded-2xl border border-[#E5EBE8] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#18252B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#17A890]" />
              <span>Customer Confirmed</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Verify weight, quantity, and price before confirming addition to basket.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
