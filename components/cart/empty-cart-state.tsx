"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ScanLine,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";

interface EmptyCartStateProps {
  onStartSession?: () => void;
  isSessionActive?: boolean;
}

export function EmptyCartState({
  onStartSession,
  isSessionActive = false,
}: EmptyCartStateProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#E5EBE8] p-8 sm:p-10 text-center space-y-5 shadow-xs my-2">
      {/* Icon Illustration */}
      <div className="relative w-20 h-20 rounded-3xl bg-[#17A890]/10 text-[#17A890] flex items-center justify-center mx-auto border border-[#17A890]/20 shadow-xs">
        <ShoppingBag className="w-10 h-10" />
        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#102B35] text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
          0
        </span>
      </div>

      {/* Copy */}
      <div className="space-y-1.5 max-w-xs mx-auto">
        <h2 className="text-lg font-black text-[#102B35]">
          Your cart is waiting
        </h2>
        <p className="text-xs text-[#718096] leading-relaxed">
          Scan a product barcode in the supermarket aisle or explore the store catalogue to start your smart checkout experience.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-sm mx-auto w-full">
        <Link
          href="/explore"
          className="w-full sm:w-auto flex-1 bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-3 px-5 rounded-xl inline-flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
        >
          <Search className="w-4 h-4" />
          <span>Explore Products</span>
        </Link>

        <Link
          href="/scan"
          className="w-full sm:w-auto flex-1 bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-3 px-5 rounded-xl inline-flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
        >
          <ScanLine className="w-4 h-4 text-[#17A890]" />
          <span>Scan a Product</span>
        </Link>
      </div>

      {/* Quick session helper if not active */}
      {!isSessionActive && onStartSession && (
        <div className="pt-2 border-t border-[#E5EBE8] text-xs text-[#718096]">
          <span>Heading to the aisles? </span>
          <button
            type="button"
            onClick={onStartSession}
            className="font-bold text-[#17A890] hover:underline cursor-pointer inline-flex items-center gap-0.5"
          >
            <span>Start a demo cart session</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
