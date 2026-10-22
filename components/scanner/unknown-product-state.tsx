"use client";

import React from "react";
import Link from "next/link";
import {
  PackageX,
  RotateCcw,
  Keyboard,
  ArrowRight,
  Barcode,
  Info,
  X,
  QrCode,
} from "lucide-react";

interface UnknownProductStateProps {
  scannedCode: string;
  detectedFormat?: string;
  isOpen: boolean;
  onScanAgain: () => void;
  onOpenManualEntry: () => void;
  onClose: () => void;
}

export function UnknownProductState({
  scannedCode,
  detectedFormat,
  isOpen,
  onScanAgain,
  onOpenManualEntry,
  onClose,
}: UnknownProductStateProps) {
  if (!isOpen) return null;

  const isUrlOrExternalQr =
    scannedCode.startsWith("http://") ||
    scannedCode.startsWith("https://") ||
    scannedCode.startsWith("WIFI:") ||
    scannedCode.includes("mailto:");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-[#E5EBE8] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unknown-product-title"
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-[#E5EBE8] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
              Item Lookup Result
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#718096] hover:text-[#18252B] hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4 overflow-y-auto no-scrollbar">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
            {isUrlOrExternalQr ? (
              <QrCode className="w-8 h-8 text-amber-600" />
            ) : (
              <PackageX className="w-8 h-8 text-amber-600" />
            )}
          </div>

          <div className="space-y-1.5">
            <h2
              id="unknown-product-title"
              className="text-lg font-black text-[#102B35]"
            >
              Product Not Found
            </h2>
            <p className="text-xs text-[#718096] max-w-xs mx-auto leading-relaxed">
              We couldn&apos;t find this barcode in the current store catalogue.
            </p>
          </div>

          {/* Barcode / QR display pill */}
          <div className="p-3 bg-[#F7F9F8] border border-[#E5EBE8] rounded-2xl max-w-xs mx-auto text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#718096] uppercase flex items-center gap-1">
                <Barcode className="w-3 h-3 text-[#17A890]" />
                <span>Scanned Code</span>
              </span>
              {detectedFormat && (
                <span className="text-[9px] font-mono text-[#17A890] bg-[#17A890]/10 px-1.5 py-0.2 rounded font-semibold">
                  {detectedFormat}
                </span>
              )}
            </div>
            <p className="text-xs font-mono font-bold text-[#102B35] break-all select-all">
              {scannedCode}
            </p>
          </div>

          {/* Explanatory notes */}
          {isUrlOrExternalQr ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-2 text-left">
              <Info className="w-4 h-4 text-[#17A890] shrink-0 mt-0.5" />
              <p className="leading-snug text-[11px]">
                This QR code contains external data/URL rather than a supermarket SKU barcode. Only valid product barcodes can be added to your SmartCart.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-2 text-left">
              <Info className="w-4 h-4 text-[#17A890] shrink-0 mt-0.5" />
              <p className="leading-snug text-[11px]">
                The barcode is unrecognized in this store location. You can try scanning again with clearer lighting, enter the digits manually, or browse the store catalogue.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={onScanAgain}
              className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Scan Again</span>
            </button>

            <button
              type="button"
              onClick={onOpenManualEntry}
              className="w-full bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#18252B] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5 text-[#17A890]" />
              <span>Enter Barcode Manually</span>
            </button>

            <Link
              href="/explore"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#102B35] hover:text-[#17A890] transition-colors"
            >
              <span>Return to Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
