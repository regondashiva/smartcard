"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
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
  Copy,
  Sparkles,
  Store,
  Clock,
  ArrowRight,
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
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const qrPayload = JSON.stringify({
      orderId: confirmation.orderId,
      exitCode: confirmation.exitCode,
      amount: confirmation.amountPaid,
      store: confirmation.storeName,
    });

    QRCode.toDataURL(qrPayload, {
      width: 200,
      margin: 1,
      color: {
        dark: "#102B35",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [confirmation]);

  const formattedDate = new Date(confirmation.paidAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const formattedTime = new Date(confirmation.paidAt).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );

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

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(confirmation.orderId).catch(() => {});
    setCopiedOrderId(true);
    showToast("Order ID copied");
    setTimeout(() => setCopiedOrderId(false), 2000);
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

  const totalItems = confirmation.items.reduce(
    (acc, i) => acc + i.quantity,
    0
  );

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 pb-12">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#102B35] text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Success Hero Card */}
      <div className="bg-white rounded-3xl border border-[#E2EBE6] shadow-sm overflow-hidden">
        {/* Top Header - Deep Teal Brand Gradient */}
        <div className="relative bg-gradient-to-b from-[#0A3D35] via-[#0F4E44] to-[#12584E] text-white px-5 pt-6 pb-8 text-center overflow-hidden">
          {/* Confetti Particles */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <span className="absolute top-3 left-8 w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span className="absolute top-8 left-20 w-1.5 h-2.5 rounded bg-amber-300 rotate-45" />
            <span className="absolute top-4 right-12 w-2 h-2 rounded-full bg-teal-200" />
            <span className="absolute top-14 right-6 w-2 h-1 rounded bg-emerald-400 -rotate-12" />
          </div>

          {/* Navigation Bar */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={onClearAndGoHome}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Return to Home"
            >
              <Home className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
              SmartCart AI Checkout
            </span>

            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Share Receipt"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Center Checkmark */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-18 h-18 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg ring-6 ring-emerald-400/25 mb-3">
              <Check className="w-9 h-9 text-white stroke-[3.5]" />
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              Payment Successful!
            </h1>
            <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
              Your self-checkout bill has been paid and verified.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold text-white">
              <span>Paid {formatCurrency(paiseToRupees(confirmation.amountPaid))}</span>
              <span>•</span>
              <span className="font-mono text-emerald-200">
                {confirmation.orderId.substring(0, 10)}
              </span>
            </div>
          </div>
        </div>

        {/* Store & Metadata Bar */}
        <div className="p-4 bg-[#F8FAF9] border-b border-[#E9EFEA] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#DCE4E0] flex items-center justify-center text-[#17A890] shrink-0 shadow-2xs">
              <Store className="w-5 h-5 text-[#0F4E44]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#102B35] truncate">
                {confirmation.storeName || "SmartCart Supermarket"}
              </p>
              <p className="text-[11px] text-[#718096] truncate">
                {confirmation.cartTag || "SmartCart #18"} · {formattedDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyOrderId}
            className="flex items-center gap-1 text-[11px] font-bold text-[#17A890] hover:text-[#0F4E44] bg-white border border-[#DCE4E0] px-2.5 py-1.5 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>{copiedOrderId ? "Copied" : "Copy ID"}</span>
          </button>
        </div>

        {/* Digital Exit Gate Pass (Smart Pass Style) */}
        <div className="p-5 space-y-4">
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-50/50 to-white p-4 text-center space-y-3 relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200">
              <QrCode className="w-3 h-3" />
              <span>Digital Store Exit Pass</span>
            </div>

            <p className="text-xs font-bold text-[#102B35]">
              Scan this QR Code at the SmartCart Exit Turnstile
            </p>

            {/* QR Code Container */}
            <div className="flex justify-center">
              <div className="p-2.5 bg-white rounded-2xl border-2 border-slate-100 shadow-md">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Exit QR Code"
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-50 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Exit Passcode */}
            <div className="bg-white rounded-xl border border-emerald-200 p-2.5 max-w-xs mx-auto flex items-center justify-between">
              <span className="text-[11px] text-[#718096] font-semibold">
                Exit Passcode:
              </span>
              <span className="text-base font-black tracking-widest text-[#102B35] font-mono">
                {confirmation.exitCode || "SC-9821"}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5A736E] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#17A890]" />
              <span>Gate pass active for 15 minutes</span>
            </div>
          </div>

          {/* Quick Metrics (3 Cards) */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#F8FAF9] border border-[#E9EFEA] rounded-2xl p-3 text-center">
              <span className="text-[10px] text-[#718096] block uppercase font-semibold">
                Items
              </span>
              <span className="text-xs font-bold text-[#102B35] mt-0.5 block">
                {totalItems} {totalItems === 1 ? "unit" : "units"}
              </span>
            </div>

            <div className="bg-[#F8FAF9] border border-[#E9EFEA] rounded-2xl p-3 text-center">
              <span className="text-[10px] text-[#718096] block uppercase font-semibold">
                Amount Paid
              </span>
              <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                {formatCurrency(paiseToRupees(confirmation.amountPaid))}
              </span>
            </div>

            <div className="bg-[#F8FAF9] border border-[#E9EFEA] rounded-2xl p-3 text-center">
              <span className="text-[10px] text-[#718096] block uppercase font-semibold">
                Status
              </span>
              <span className="text-xs font-bold text-emerald-600 mt-0.5 block">
                Verified ✓
              </span>
            </div>
          </div>

          {/* Primary View Detailed Receipt Button */}
          <Link
            href={`/receipts/${confirmation.orderId}?screen=receipt`}
            className="w-full py-4 px-5 rounded-2xl bg-[#0F4E44] hover:bg-[#0A3D35] text-white flex items-center justify-between font-bold text-sm shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span>View Full Digital Receipt</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/80" />
          </Link>

          {/* Secondary Action Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="py-3 px-3 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF4F1] border border-[#E2EBE6] flex items-center justify-center gap-2 text-xs font-bold text-[#102B35] transition-colors cursor-pointer"
            >
              {downloading ? (
                <div className="w-4 h-4 border-2 border-[#0F4E44] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-[#0F4E44]" />
              )}
              <span>Download Invoice</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="py-3 px-3 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF4F1] border border-[#E2EBE6] flex items-center justify-center gap-2 text-xs font-bold text-[#102B35] transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#0F4E44]" />
              <span>Share Receipt</span>
            </button>
          </div>

          {/* Done / Return to Home Button */}
          <button
            type="button"
            onClick={onClearAndGoHome}
            className="w-full py-3.5 px-4 rounded-2xl bg-white border border-[#DCE4E0] hover:bg-[#F8FAF9] text-[#102B35] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Home className="w-4 h-4 text-[#17A890]" />
            <span>Done · Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
