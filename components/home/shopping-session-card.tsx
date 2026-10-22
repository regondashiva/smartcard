"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  ScanLine,
  ArrowRight,
  Sparkles,
  WifiOff,
  CheckCircle2,
  StopCircle,
  Hash,
} from "lucide-react";

interface ShoppingSessionCardProps {
  onBrowseClick?: () => void;
}

export function ShoppingSessionCard({ onBrowseClick }: ShoppingSessionCardProps) {
  const { session, startSession, endSession, getItemCount, getSubtotal } = useCart();
  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  if (!session.isActive) {
    return (
      <div className="bg-gradient-to-br from-[#102B35] via-[#143743] to-[#174857] text-white rounded-2xl p-5 shadow-lg border border-[#17A890]/20 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#17A890]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#17A890]/20 border border-[#17A890]/30 flex items-center justify-center shrink-0 text-[#17A890]">
            <ShoppingBag className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-[#17A890] font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SmartCart Self-Checkout</span>
            </div>

            <h2 className="text-lg font-bold text-white mt-0.5 tracking-tight">
              Ready to shop smarter?
            </h2>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Scan product barcodes as you put them in your cart, track your live total, and skip billing queues entirely.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            onClick={startSession}
            className="flex-1 bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <ScanLine className="w-4 h-4" />
            <span>Start Shopping</span>
          </button>

          <button
            onClick={onBrowseClick}
            className="bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            No hardware required for test mode
          </span>
          <span className="font-medium text-slate-300">Tap to test workflow</span>
        </div>
      </div>
    );
  }

  // Active shopping session state
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border-2 border-[#17A890] relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Active status header bar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16865C] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16865C]" />
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#18252B]">
              Active Shopping Session
            </span>
            <span className="text-[11px] font-medium text-[#718096]">
              • In-Store
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
            <WifiOff className="w-3 h-3 text-amber-600" />
            Hardware Not Connected
          </span>
        </div>
      </div>

      {/* Session details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3">
        <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E5EBE8]">
          <span className="text-[10px] uppercase font-bold text-[#718096] flex items-center gap-1">
            <Hash className="w-3 h-3" />
            Session ID
          </span>
          <p className="text-xs font-mono font-bold text-[#102B35] mt-0.5 truncate">
            {session.id}
          </p>
          <span className="text-[10px] text-[#718096]">Demo Instance</span>
        </div>

        <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E5EBE8]">
          <span className="text-[10px] uppercase font-bold text-[#718096]">
            Assigned Cart
          </span>
          <p className="text-xs font-bold text-[#102B35] mt-0.5">
            {session.cartTag}
          </p>
          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" /> Paired
          </span>
        </div>

        <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E5EBE8]">
          <span className="text-[10px] uppercase font-bold text-[#718096]">
            Items in Cart
          </span>
          <p className="text-base font-black text-[#102B35] mt-0.5">
            {itemCount} <span className="text-xs font-normal text-[#718096]">pcs</span>
          </p>
          <span className="text-[10px] text-[#718096]">Auto-synced</span>
        </div>

        <div className="bg-[#17A890]/10 p-2.5 rounded-xl border border-[#17A890]/30">
          <span className="text-[10px] uppercase font-bold text-[#128673]">
            Current Total
          </span>
          <p className="text-base font-black text-[#102B35] mt-0.5">
            {formatCurrency(subtotal)}
          </p>
          <span className="text-[10px] text-[#128673] font-semibold">Taxes included</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-2 flex items-center gap-2">
        <Link
          href="/scan"
          className="flex-1 bg-[#17A890] hover:bg-[#128673] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <ScanLine className="w-4 h-4" />
          <span>Open Barcode Scanner</span>
        </Link>

        <button
          onClick={endSession}
          className="border border-[#CBD5E1] hover:border-red-300 hover:bg-red-50 text-[#718096] hover:text-red-700 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition-colors"
          title="End demo shopping session"
        >
          <StopCircle className="w-3.5 h-3.5" />
          <span>End</span>
        </button>
      </div>

      {/* Hardware disclaimer banner */}
      <div className="mt-2.5 text-[11px] text-[#718096] bg-[#F7F9F8] px-2.5 py-1.5 rounded-lg border border-[#E5EBE8] flex items-center justify-between">
        <span>SmartCart AI Hub: Demo session running locally.</span>
        <span className="font-semibold text-[#17A890]">Module 4 for QR camera</span>
      </div>
    </div>
  );
}
