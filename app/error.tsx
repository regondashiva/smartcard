"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Headphones,
  ShoppingCart,
  HelpCircle,
} from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log safe error internally without displaying secrets
    console.error("[SmartCart Application Error]:", error?.message);
  }, [error]);

  return (
    <div className="min-h-[70vh] max-w-md mx-auto px-4 flex flex-col items-center justify-center text-center py-12 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
          Temporary Session Interruption
        </span>
        <h1 className="text-xl font-black text-[#102B35]">
          Something Unexpected Occurred
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          We experienced a brief hiccup while processing your shopping request. Your saved cart and orders remain secure.
        </p>
      </div>

      <div className="w-full space-y-2 pt-2">
        <button
          onClick={() => reset()}
          className="w-full py-3 bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="w-full py-2.5 bg-white hover:bg-slate-50 text-[#102B35] border border-[#E5EBE8] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4 text-[#17A890]" />
          <span>Return to Store Home</span>
        </Link>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href="/cart"
            className="py-2 bg-slate-50 hover:bg-slate-100 text-[#102B35] text-xs font-semibold rounded-xl border border-[#E5EBE8] flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#17A890]" />
            <span>My Cart</span>
          </Link>
          <Link
            href="/support"
            className="py-2 bg-slate-50 hover:bg-slate-100 text-[#102B35] text-xs font-semibold rounded-xl border border-[#E5EBE8] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Headphones className="w-3.5 h-3.5 text-[#17A890]" />
            <span>Store Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
