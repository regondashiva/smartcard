"use client";

import React from "react";
import { useCart } from "@/store/cart-store";
import { MOCK_STORES } from "@/data/products";
import { StoreLocation } from "@/types/cart";
import { MapPin, Check, X, Clock, Navigation } from "lucide-react";

interface StoreSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoreSelectorModal({ isOpen, onClose }: StoreSelectorModalProps) {
  const { selectedStore, switchStore } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#E5EBE8] overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-modal-title"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E5EBE8] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#17A890]/10 flex items-center justify-center text-[#17A890]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 id="store-modal-title" className="text-base font-bold text-[#18252B]">
                Select Supermarket Store
              </h2>
              <span className="text-[11px] font-medium text-[#718096] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                Demo Location Data
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#718096] hover:bg-black/5 hover:text-[#18252B] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store List */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {MOCK_STORES.map((store: StoreLocation) => {
            const isSelected = selectedStore.id === store.id;
            return (
              <button
                key={store.id}
                onClick={() => {
                  switchStore(store);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? "border-[#17A890] bg-[#17A890]/5 ring-1 ring-[#17A890]"
                    : "border-[#E5EBE8] bg-white hover:border-[#17A890]/50 hover:bg-slate-50/50"
                }`}
              >
                <div
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-[#17A890] text-white"
                      : "border border-[#CBD5E1] text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm text-[#18252B] truncate">
                      {store.name}
                    </h3>
                    <span className="text-xs font-medium text-[#17A890] flex items-center gap-1 shrink-0">
                      <Navigation className="w-3 h-3" />
                      {store.distance}
                    </span>
                  </div>

                  <p className="text-xs text-[#718096] mt-1 leading-snug">
                    {store.address}, {store.city}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-[#718096]">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Open Now
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {store.hours}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 py-3 border-t border-[#E5EBE8] bg-[#F7F9F8] text-[11px] text-[#718096] flex items-center justify-between">
          <span>In-store barcode scanning is simulated for these locations.</span>
          <button
            onClick={onClose}
            className="font-semibold text-[#17A890] hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
