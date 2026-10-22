"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingListProposal, ShoppingListItemProposal } from "@/types/assistant";
import { useCart } from "@/store/cart-store";
import {
  ListChecks,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface ShoppingListProposalCardProps {
  proposal: ShoppingListProposal;
}

export function ShoppingListProposalCard({ proposal }: ShoppingListProposalCardProps) {
  const { addItem, showToast } = useCart();
  const [items, setItems] = useState<ShoppingListItemProposal[]>(proposal.items);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Compute live totals based on customer adjustments
  const currentTotal = items.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);
  const budget = proposal.budget;
  const budgetRemaining = budget ? budget - currentTotal : undefined;
  const fitsBudget = budget ? currentTotal <= budget : true;

  const handleUpdateQty = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = Math.max(1, item.quantity + delta);
            return {
              ...item,
              quantity: nextQty,
              lineTotal: nextQty * item.unitPrice,
            };
          }
          return item;
        })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleAddAllToCart = () => {
    if (items.length === 0) return;

    items.forEach((item) => {
      addItem(item.product, item.quantity);
    });

    setIsAdded(true);
    showToast(
      "Shopping List Added",
      `Added ${items.length} items (Total: ₹${currentTotal}) to your cart`,
      "success"
    );
  };

  if (isDismissed) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 text-center text-xs text-slate-500">
        Proposed shopping list was dismissed.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-sm space-y-4 my-2">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#E5EBE8] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#17A890]/15 flex items-center justify-center text-[#17A890]">
            <ListChecks className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#102B35]">{proposal.title}</h4>
            <p className="text-[10px] text-slate-500">Interactive Proposal • Review before adding</p>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
        >
          Dismiss
        </button>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400">
          All items removed from this proposed list.
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#F7F9F8] border border-[#E5EBE8]"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      {item.product.brand}
                    </span>
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-slate-400 hover:text-[#17A890]"
                      aria-label="View product details"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                  <h5 className="text-[11px] font-bold text-[#102B35] truncate">
                    {item.product.name}
                  </h5>
                  <span className="text-[10px] text-slate-500">
                    ₹{item.unitPrice} each • {item.product.unit}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center border border-[#E5EBE8] bg-white rounded-lg p-0.5">
                  <button
                    onClick={() => handleUpdateQty(item.product.id, -1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-[#102B35] disabled:opacity-30"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-[#102B35]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQty(item.product.id, 1)}
                    aria-label="Increase quantity"
                    className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-[#102B35]"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                <div className="w-12 text-right">
                  <span className="text-xs font-black text-[#102B35]">
                    ₹{item.lineTotal}
                  </span>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.product.id)}
                  aria-label="Remove item"
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Budget Summary Calculation */}
      <div className="bg-[#102B35]/5 rounded-xl p-3 border border-[#102B35]/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Estimated List Total:</span>
          <span className="text-sm font-black text-[#102B35]">₹{currentTotal}</span>
        </div>

        {budget !== undefined && (
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#102B35]/10">
            <span className="text-slate-500">Specified Budget:</span>
            <span className="font-bold text-slate-700">₹{budget}</span>
          </div>
        )}

        {budgetRemaining !== undefined && (
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Remaining Cushion:</span>
            <span
              className={`font-black ${
                fitsBudget ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {fitsBudget ? `₹${budgetRemaining} remaining` : `Exceeds by ₹${Math.abs(budgetRemaining)}`}
            </span>
          </div>
        )}

        <div className="flex items-start gap-1.5 pt-1 text-[10px] text-slate-500">
          <AlertCircle className="w-3 h-3 text-[#17A890] shrink-0 mt-0.5" />
          <span>
            {proposal.notes ||
              "Estimated total is based on current shelf prices. Items will be added directly into your unified SmartCart."}
          </span>
        </div>
      </div>

      {/* Confirmation Button */}
      <div>
        <button
          onClick={handleAddAllToCart}
          disabled={items.length === 0 || isAdded}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            isAdded
              ? "bg-emerald-600 text-white"
              : items.length === 0
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-[#17A890] text-white hover:bg-[#138975] shadow-md hover:shadow-lg"
          }`}
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add Selected Items to Cart (₹{currentTotal})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
