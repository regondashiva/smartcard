"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Barcode,
  Search,
  Sparkles,
  AlertCircle,
  Package,
  QrCode,
  ArrowRight,
} from "lucide-react";

interface ManualBarcodeEntryProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBarcode: (barcode: string) => void;
  isLookingUp?: boolean;
}

// Convenient demo presets from the supermarket catalogue for testing without physical barcodes
const DEMO_PRESETS = [
  {
    name: "Amul Toned Milk 500ml",
    barcode: "8901262010053",
    tag: "Dairy",
  },
  {
    name: "Farm Fresh Brown Eggs (6pcs)",
    barcode: "8906093840192",
    tag: "Dairy & Eggs",
  },
  {
    name: "Epigamia Greek Yogurt 120g",
    barcode: "8906077380027",
    tag: "Dairy",
  },
  {
    name: "Aashirvaad Shudh Chakki Atta 5kg",
    barcode: "8901030383848",
    tag: "Staples",
  },
  {
    name: "Fortune Sunflower Oil 1L",
    barcode: "8906007281057",
    tag: "Cooking Oils",
  },
  {
    name: "Tata Salt Vacuum Evaporated 1kg",
    barcode: "8901058852331",
    tag: "Staples",
  },
  {
    name: "Dettol Liquid Handwash 200ml",
    barcode: "8901396386017",
    tag: "Personal Care",
  },
  {
    name: "Cadbury Dairy Milk Silk 150g",
    barcode: "7622201440268",
    tag: "Snacks",
  },
];

export function ManualBarcodeEntry({
  isOpen,
  onClose,
  onSubmitBarcode,
  isLookingUp = false,
}: ManualBarcodeEntryProps) {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBarcodeInput("");
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidateAndSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = barcodeInput.trim();

    if (!trimmed) {
      setValidationError("Please enter a barcode number.");
      return;
    }

    // Barcodes are typically 6-32 alphanumeric or numeric characters
    if (trimmed.length < 6 || trimmed.length > 36) {
      setValidationError("Barcode must be between 6 and 36 characters.");
      return;
    }

    setValidationError(null);
    onSubmitBarcode(trimmed);
  };

  const handleSelectPreset = (code: string) => {
    setBarcodeInput(code);
    setValidationError(null);
    onSubmitBarcode(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-[#E5EBE8] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-entry-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5EBE8] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#17A890]/10 text-[#17A890] flex items-center justify-center">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="manual-entry-title"
                className="text-base font-bold text-[#102B35]"
              >
                Manual Barcode Entry
              </h2>
              <p className="text-xs text-[#718096]">
                Enter digits below product barcode
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#718096] hover:text-[#18252B] hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close manual entry dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto no-scrollbar">
          {/* Barcode Input Form */}
          <form onSubmit={handleValidateAndSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="barcode-input-field"
                className="text-xs font-bold text-[#18252B] flex items-center justify-between"
              >
                <span>Barcode / SKU Number</span>
                <span className="text-[11px] text-[#718096] font-normal">
                  EAN-13, UPC, Code 128
                </span>
              </label>

              <div className="relative">
                <input
                  id="barcode-input-field"
                  type="text"
                  autoFocus
                  placeholder="e.g. 8901262010053"
                  value={barcodeInput}
                  onChange={(e) => {
                    setBarcodeInput(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={`w-full px-4 py-3 pl-10 pr-10 text-sm font-mono bg-white border rounded-xl outline-none transition-all placeholder:text-slate-400 text-[#18252B] ${
                    validationError
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-[#CBD5E1] focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20"
                  }`}
                  aria-invalid={!!validationError}
                  aria-describedby={
                    validationError ? "barcode-error-msg" : undefined
                  }
                />

                <Barcode className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                {barcodeInput && (
                  <button
                    type="button"
                    onClick={() => setBarcodeInput("")}
                    className="w-6 h-6 rounded-full bg-slate-100 text-[#718096] hover:text-[#18252B] absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
                    aria-label="Clear input text"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {validationError && (
                <p
                  id="barcode-error-msg"
                  className="text-xs text-red-600 flex items-center gap-1 font-medium pt-0.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{validationError}</span>
                </p>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLookingUp}
              className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4" />
              <span>{isLookingUp ? "Looking up..." : "Lookup Product"}</span>
            </button>
          </form>

          {/* Quick Demo Barcodes Section */}
          <div className="pt-2 border-t border-[#E5EBE8] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#102B35] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#17A890]" />
                <span>Quick Supermarket Presets</span>
              </span>
              <span className="text-[10px] text-[#718096] bg-slate-100 px-2 py-0.5 rounded-full">
                Tap to Test
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_PRESETS.map((item) => (
                <button
                  key={item.barcode}
                  type="button"
                  onClick={() => handleSelectPreset(item.barcode)}
                  className="p-2.5 text-left rounded-xl border border-[#E5EBE8] hover:border-[#17A890] bg-white hover:bg-[#F7F9F8] transition-all group flex items-center justify-between gap-2 shadow-2xs cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#18252B] truncate group-hover:text-[#17A890] transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-mono text-[#718096]">
                      {item.barcode}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#17A890] shrink-0 transition-colors" />
                </button>
              ))}
            </div>

            {/* Test Edge Cases */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset("9999999999999")}
                className="flex-1 p-2 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-slate-400" />
                <span>Test Unknown Barcode</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset("https://smartcart.ai/promo/wifi")}
                className="flex-1 p-2 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-slate-400" />
                <span>Test Unsupported QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F7F9F8] border-t border-[#E5EBE8] text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#718096] hover:text-[#18252B] transition-colors cursor-pointer"
          >
            Cancel & Return to Camera
          </button>
        </div>
      </div>
    </div>
  );
}
