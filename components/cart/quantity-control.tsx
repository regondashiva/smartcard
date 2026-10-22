"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  maxStock?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function QuantityControl({
  quantity,
  maxStock = 99,
  onIncrease,
  onDecrease,
  disabled = false,
  size = "md",
}: QuantityControlProps) {
  const isMin = quantity <= 1;
  const isMax = quantity >= maxStock;

  const buttonSizeClass =
    size === "sm" ? "w-6 h-6 rounded-lg text-xs" : "w-7 h-7 rounded-xl text-sm";
  const iconSizeClass = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <div
      className="inline-flex items-center bg-[#F7F9F8] border border-[#CBD5E1] rounded-2xl p-0.5 shadow-2xs select-none"
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || isMin}
        className={`${buttonSizeClass} bg-white text-[#102B35] hover:bg-slate-100 flex items-center justify-center font-bold shadow-2xs transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer`}
        aria-label="Decrease item quantity"
      >
        <Minus className={iconSizeClass} />
      </button>

      <span
        className="w-7 text-center font-bold text-xs sm:text-sm text-[#102B35] font-mono"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled || isMax}
        className={`${buttonSizeClass} bg-[#17A890] text-white hover:bg-[#128673] flex items-center justify-center font-bold shadow-2xs transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer`}
        aria-label="Increase item quantity"
      >
        <Plus className={iconSizeClass} />
      </button>
    </div>
  );
}
