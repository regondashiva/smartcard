"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, MapPin, ScanLine, ShoppingBag } from "lucide-react";
import { StoreLocation, ShoppingSession } from "@/types/cart";

interface CartHeaderProps {
  store: StoreLocation;
  itemCount: number;
  distinctCount: number;
  session: ShoppingSession;
  onClearCartClick: () => void;
}

export function CartHeader({
  store,
  itemCount,
  distinctCount,
  session,
  onClearCartClick,
}: CartHeaderProps) {
  const isSessionActive = session.isActive;

  return (
    <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8] gap-2">
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-[#102B35] leading-tight">
              My Smart Cart
            </h1>
            {isSessionActive && (
              <span className="inline-flex items-center gap-1 bg-[#16865C]/10 text-[#16865C] border border-[#16865C]/20 text-[10px] font-bold px-2 py-0.2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16865C] animate-pulse" />
                <span>Live</span>
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#718096] flex items-center gap-1 font-medium truncate max-w-[200px] sm:max-w-xs">
            <MapPin className="w-3 h-3 text-[#17A890] shrink-0" />
            <span className="truncate">{store.name}</span>
            <span>•</span>
            <span>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Link
          href="/scan"
          className="bg-[#17A890]/10 hover:bg-[#17A890]/20 text-[#17A890] border border-[#17A890]/30 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
          title="Scan items"
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Scan</span>
        </Link>

        {itemCount > 0 && (
          <button
            type="button"
            onClick={onClearCartClick}
            className="w-8 h-8 rounded-xl bg-white hover:bg-red-50 border border-[#E5EBE8] hover:border-red-200 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Clear cart"
            title="Clear entire cart"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
