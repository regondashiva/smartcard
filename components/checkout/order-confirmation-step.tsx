"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { OrderConfirmation } from "@/types/checkout";
import { formatCurrency } from "@/lib/utils";
import { paiseToRupees } from "@/lib/checkout-service";
import { getOrderById } from "@/lib/receipt-service";
import { downloadReceiptPdf } from "@/lib/receipt-pdf";
import {
  Check,
  ShoppingBag,
  Calendar,
  FileText,
  Download,
  Share2,
  Mail,
  QrCode,
  ChevronRight,
  Home,
  CheckCircle2,
} from "lucide-react";

interface OrderConfirmationStepProps {
  confirmation: OrderConfirmation;
  onClearAndGoHome: () => void;
}

export function OrderConfirmationStep({
  confirmation,
  onClearAndGoHome,
}: OrderConfirmationStepProps) {
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const formattedDate = new Date(confirmation.paidAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(confirmation.paidAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const receipt = getOrderById(confirmation.orderId);
      if (receipt) {
        await downloadReceiptPdf(receipt);
        showToast("PDF Receipt downloaded");
      } else {
        window.print();
      }
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const text = `SmartCart AI · Order ${confirmation.orderId} · Total: ${formatCurrency(
      paiseToRupees(confirmation.amountPaid)
    )} · Exit Code: ${confirmation.exitCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `SmartCart Receipt - ${confirmation.orderId}`,
          text,
          url: `${window.location.origin}/receipts/${confirmation.orderId}`,
        });
        return;
      } catch {
        // Fallback
      }
    }

    navigator.clipboard.writeText(text).catch(() => {});
    showToast("Receipt copied to clipboard");
  };

  const totalItems = confirmation.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E5EBE8] relative">
      {/* Toast Alert */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#102B35] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header - Deep Teal Gradient */}
      <div className="relative bg-gradient-to-b from-[#063831] via-[#09473F] to-[#0A4D45] text-white px-5 pt-8 pb-10 overflow-hidden">
        {/* Subtle Confetti Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <span className="absolute top-4 left-10 w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          <span className="absolute top-10 left-24 w-1 h-2 rounded bg-amber-300 rotate-45" />
          <span className="absolute top-6 right-14 w-1.5 h-1.5 rounded-full bg-teal-200" />
          <span className="absolute top-18 right-8 w-2 h-1 rounded bg-emerald-400 -rotate-12" />
        </div>

        {/* Header Action Bar */}
        <div className="relative flex items-center justify-between z-10">
          <button
            type="button"
            onClick={onClearAndGoHome}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClearAndGoHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>

        {/* Center Success Badge */}
        <div className="relative z-10 flex flex-col items-center text-center mt-4 space-y-3">
          <div className="w-20 h-20 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg ring-6 ring-emerald-400/25">
            <Check className="w-10 h-10 text-white stroke-[3.5]" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Payment Successful!
            </h2>
            <p className="text-xs text-white/80 mt-1 leading-relaxed max-w-xs mx-auto">
              Thank you for shopping with SmartCart AI
              <br />
              Your order has been placed successfully.
            </p>
          </div>
        </div>
      </div>

      {/* White Overlapping Content Card */}
      <div className="bg-white -mt-5 rounded-t-3xl px-5 pt-5 pb-8 space-y-4 z-20 relative">
        {/* Store Card */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E9EFEA]">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#DCE7E1] bg-white">
            <Image
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80"
              alt={confirmation.storeName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-[#102B35] truncate">
              {confirmation.storeName || "Green Valley Supermarket"}
            </h3>
            <p className="text-[11px] text-[#718096] truncate">
              Indiranagar, Bengaluru · Cart #{confirmation.cartTag || "12"}
            </p>
          </div>
        </div>

        {/* 3 Summary Badges */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Date */}
          <div className="bg-[#F8FAF9] border border-[#E9EFEA] rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0B443B] mb-2 shadow-2xs">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-[#102B35] leading-tight">
              {formattedDate}
            </span>
            <span className="text-[10px] text-[#718096] mt-0.5">{formattedTime}</span>
          </div>

          {/* Receipt No */}
          <div className="bg-[#F8FAF9] border border-[#E9EFEA] rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0B443B] mb-2 shadow-2xs">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] text-[#718096] uppercase font-semibold">
              Receipt No.
            </span>
            <span className="text-[11px] font-bold text-[#102B35] truncate max-w-full mt-0.5 font-mono">
              {confirmation.orderId.substring(0, 10)}
            </span>
          </div>

          {/* Items & Total */}
          <div className="bg-[#F8FAF9] border border-[#E9EFEA] rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0B443B] mb-2 shadow-2xs">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-[#102B35] leading-tight">
              {totalItems} items
            </span>
            <span className="text-[11px] font-bold text-[#0B443B] mt-0.5">
              {formatCurrency(paiseToRupees(confirmation.amountPaid))}
            </span>
          </div>
        </div>

        {/* View Receipt Primary Button */}
        <Link
          href={`/receipts/${confirmation.orderId}?screen=receipt`}
          className="w-full py-4 px-5 rounded-2xl bg-[#0B443B] hover:bg-[#07362E] text-white flex items-center justify-between font-bold text-sm shadow-md transition-all active:scale-[0.99] text-center"
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-emerald-300" />
            <span>View Receipt</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/80" />
        </Link>

        {/* 3 Secondary Action Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="py-3 px-2 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF4F1] border border-[#E2EBE6] flex flex-col items-center justify-center gap-1.5 text-center text-[#102B35] transition-colors cursor-pointer"
          >
            {downloading ? (
              <div className="w-4 h-4 border-2 border-[#0B443B] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-[#0B443B]" />
            )}
            <span className="text-[11px] font-bold">Download PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-3 px-2 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF4F1] border border-[#E2EBE6] flex flex-col items-center justify-center gap-1.5 text-center text-[#102B35] transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#0B443B]" />
            <span className="text-[11px] font-bold">Share</span>
          </button>

          <Link
            href={`/receipts/${confirmation.orderId}?screen=success`}
            className="py-3 px-2 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF4F1] border border-[#E2EBE6] flex flex-col items-center justify-center gap-1.5 text-center text-[#102B35] transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#0B443B]" />
            <span className="text-[11px] font-bold">Email Receipt</span>
          </Link>
        </div>

        {/* Ready to Exit Mint Banner */}
        <Link
          href={`/receipts/${confirmation.orderId}?screen=details`}
          className="p-3.5 rounded-2xl bg-[#EBF8F4] hover:bg-[#DDF3EC] border border-[#C6ECE0] flex items-center justify-between transition-colors shadow-2xs block"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4F3E8] border border-[#BCEBDC] flex items-center justify-center text-[#083D35] shrink-0">
              <QrCode className="w-5 h-5 text-[#0B443B]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#083D35]">Ready to Exit?</p>
              <p className="text-[10px] text-[#4A726B] leading-tight">
                Show your exit QR code at the exit gate.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#083D35] shrink-0" />
        </Link>
      </div>
    </div>
  );
}
