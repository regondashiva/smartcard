"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart-store";
import { PRODUCTS } from "@/data/products";
import {
  ArrowLeft,
  ScanLine,
  Camera,
  WifiOff,
  ShoppingBag,
  Flashlight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ScanPage() {
  const { session, addItem, startSession } = useCart();
  const [torchOn, setTorchOn] = useState(false);
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);

  const handleSimulateScan = () => {
    if (!session.isActive) {
      startSession();
    }
    setIsScanningSimulated(true);
    setTimeout(() => {
      // Pick a random product to simulate scan
      const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      addItem(randomProduct, 1);
      setIsScanningSimulated(false);
    }, 900);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#102B35]">Barcode & QR Scanner</h1>
            <p className="text-xs text-[#718096]">Point camera at product barcode</p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
          Module 4 Placeholder
        </span>
      </div>

      {/* Simulated Camera Viewfinder Container */}
      <div className="relative aspect-4/5 w-full bg-[#102B35] rounded-3xl overflow-hidden shadow-xl border-2 border-[#17A890]/40 flex flex-col items-center justify-between p-6 text-white">
        {/* Subtle camera view background grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#17A890_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Controls */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-slate-300 border border-white/10">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Hardware Not Connected</span>
          </div>

          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${
              torchOn
                ? "bg-amber-400 text-slate-900 border-amber-300 shadow-md"
                : "bg-black/40 text-white border-white/10 hover:bg-black/60"
            }`}
            aria-label="Toggle flashlight"
          >
            <Flashlight className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Reticle */}
        <div className="relative z-10 w-64 h-64 border-2 border-dashed border-[#17A890] rounded-2xl flex flex-col items-center justify-center p-4 text-center">
          {/* Laser scanning line animation */}
          <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#17A890] to-transparent shadow-[0_0_8px_#17A890] animate-pulse" />

          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-md" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-md" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-md" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-br-md" />

          <Camera className="w-10 h-10 text-[#17A890]/80 mb-2" />
          <p className="text-xs font-bold text-white tracking-wide">
            {isScanningSimulated ? "Decoding Barcode..." : "Align barcode within frame"}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
            EAN-13, UPC-A, and QR code recognition
          </p>
        </div>

        {/* Bottom Scanner Action */}
        <div className="relative z-10 w-full flex flex-col items-center gap-2">
          <button
            onClick={handleSimulateScan}
            disabled={isScanningSimulated}
            className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
          >
            <ScanLine className="w-4 h-4" />
            <span>
              {isScanningSimulated ? "Scanning..." : "Simulate Barcode Scan (Demo Test)"}
            </span>
          </button>

          <p className="text-[10px] text-slate-400 text-center">
            Camera API stream & real-time barcode engine activates in Module 4.
          </p>
        </div>
      </div>

      {/* Quick navigation actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href="/"
          className="bg-white border border-[#E5EBE8] hover:bg-slate-50 text-[#18252B] font-bold text-xs py-2.5 px-4 rounded-xl text-center transition-colors"
        >
          Return to Home
        </Link>
        <Link
          href="/cart"
          className="bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-2.5 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#17A890]" />
          <span>View Cart</span>
        </Link>
      </div>
    </div>
  );
}
