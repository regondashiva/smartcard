"use client";

import React from "react";
import { CartItem } from "@/types/cart";
import { CartItemRow } from "./cart-item-row";
import { RotateCcw, ShoppingBag } from "lucide-react";

interface CartItemListProps {
  items: CartItem[];
  lastRemovedItem: CartItem | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onUndoRemove: () => void;
}

export function CartItemList({
  items,
  lastRemovedItem,
  onUpdateQuantity,
  onRemoveItem,
  onUndoRemove,
}: CartItemListProps) {
  return (
    <div className="space-y-3">
      {/* Undo Banner if an item was just removed */}
      {lastRemovedItem && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-150">
          <span className="truncate pr-2">
            Removed &ldquo;<span className="font-semibold">{lastRemovedItem.product.name}</span>&rdquo;
          </span>
          <button
            type="button"
            onClick={onUndoRemove}
            className="text-xs font-bold text-[#17A890] hover:text-[#128673] flex items-center gap-1 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-[#E5EBE8] shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* Main Items Box */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] divide-y divide-[#E5EBE8] overflow-hidden shadow-xs">
        {items.map((item) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onUpdateQuantity={(newQty) =>
              onUpdateQuantity(item.product.id, newQty)
            }
            onRemove={() => onRemoveItem(item.product.id)}
          />
        ))}
      </div>
    </div>
  );
}
