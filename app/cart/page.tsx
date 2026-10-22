"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart-store";
import { CartHeader } from "@/components/cart/cart-header";
import { ShoppingSessionCard } from "@/components/cart/shopping-session-card";
import { CartItemList } from "@/components/cart/cart-item-list";
import { CartSummary } from "@/components/cart/cart-summary";
import { WeightMonitorCard } from "@/components/cart/weight-monitor-card";
import { CartStatusCard } from "@/components/cart/cart-status-card";
import { EmptyCartState } from "@/components/cart/empty-cart-state";
import { ClearCartDialog } from "@/components/cart/clear-cart-dialog";
import { ScanLine, ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    session,
    selectedStore,
    lastRemovedItem,
    removeItem,
    undoRemoveItem,
    updateQuantity,
    clearCart,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    getItemCount,
    getDistinctCount,
    getSubtotal,
    getSavings,
    getExpectedWeight,
  } = useCart();

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const itemCount = getItemCount();
  const distinctCount = getDistinctCount();
  const subtotal = getSubtotal();
  const savings = getSavings();
  const expectedWeight = getExpectedWeight();

  const handleConfirmClear = () => {
    clearCart();
    setIsClearModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* 1. Header */}
      <CartHeader
        store={selectedStore}
        itemCount={itemCount}
        distinctCount={distinctCount}
        session={session}
        onClearCartClick={() => setIsClearModalOpen(true)}
      />

      {/* 2. Shopping Session Card */}
      <ShoppingSessionCard
        session={session}
        store={selectedStore}
        itemCount={itemCount}
        onStartSession={startSession}
        onPauseSession={pauseSession}
        onResumeSession={resumeSession}
        onEndSession={endSession}
      />

      {/* Main Cart Body */}
      {items.length === 0 ? (
        /* Empty Cart State */
        <EmptyCartState
          onStartSession={startSession}
          isSessionActive={session.isActive}
        />
      ) : (
        /* Responsive Layout: 1 column on mobile, 2 columns on tablet/desktop */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Cart Items & Status (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Cart Status & Guidance */}
            <CartStatusCard
              itemCount={itemCount}
              distinctCount={distinctCount}
              isSessionActive={session.isActive}
            />

            {/* Cart Items List */}
            <CartItemList
              items={items}
              lastRemovedItem={lastRemovedItem}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onUndoRemove={undoRemoveItem}
            />

            {/* Quick Add more items bar */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E5EBE8] shadow-2xs text-xs">
              <span className="text-[#718096]">Need to scan more groceries?</span>
              <Link
                href="/scan"
                className="font-bold text-[#17A890] hover:text-[#128673] flex items-center gap-1 transition-colors"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Open Scanner</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hardware Weight Monitor & Bill Summary (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            {/* Weight Monitoring Card */}
            <WeightMonitorCard
              expectedWeight={expectedWeight}
              isHardwareConnected={session.isHardwareConnected}
            />

            {/* Live Bill Summary */}
            <CartSummary
              distinctCount={distinctCount}
              itemCount={itemCount}
              subtotal={subtotal}
              savings={savings}
            />
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Dialog */}
      <ClearCartDialog
        isOpen={isClearModalOpen}
        itemCount={itemCount}
        onConfirm={handleConfirmClear}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
}
