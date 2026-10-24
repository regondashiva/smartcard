"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { OrderConfirmation } from "@/types/checkout";
import { formatCurrency } from "@/lib/utils";
import { paiseToRupees } from "@/lib/checkout-service";
import { getOrderById } from "@/lib/receipt-service";
import { downloadReceiptPdf } from "@/lib/receipt-pdf";
import {
  Check,
  ShoppingBag,
  Download,
  Share2,
  QrCode,
  ChevronRight,
  Home,
  CheckCircle2,
  Copy,
  Store,
  Clock,
  Sparkles,
  ShieldCheck,
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
  const [copiedPasscode, setCopiedPasscode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Real-time 15 min countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const qrPayload = JSON.stringify({
      orderId: confirmation.orderId,
      exitCode: confirmation.exitCode,
      amount: confirmation.amountPaid,
      store: confirmation.storeName,
      timestamp: confirmation.paidAt,
    });

    QRCode.toDataURL(qrPayload, {
      width: 240,
      margin: 1,
      color: {
        dark: "#083D33",
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

  const handleCopyPasscode = () => {
    navigator.clipboard.writeText(confirmation.exitCode || "SC-9821").catch(() => {});
    setCopiedPasscode(true);
    showToast("Exit passcode copied");
    setTimeout(() => setCopiedPasscode(false), 2000);
  };

  const handleShare = async () => {
    const text = `SmartCart AI · Order ${confirmation.orderId} · Total: ${formatCurrency(
      paiseToRupees(confirmation.amountPaid)
    )} · Exit Passcode: ${confirmation.exitCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `SmartCart Exit Pass - ${confirmation.orderId}`,
          text,
          url: `${window.location.origin}/receipts/${confirmation.orderId}`,
        });
        return;
      } catch {
        // Fallback
      }
    }

    navigator.clipboard.writeText(text).catch(() => {});
    showToast("Pass copied to clipboard");
  };

  const totalItems = confirmation.items.reduce(
    (acc, i) => acc + i.quantity,
    0
  );

  return (
    <div className="w-full min-h-screen bg-[#07362E] flex flex-col justify-between relative selection:bg-emerald-400 selection:text-emerald-950">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#102B35] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* ─── FULL COVER HERO CANOPY (Edge-to-Edge) ─── */}
      <div className="relative bg-gradient-to-b from-[#042821] via-[#073A31] to-[#0A4D42] text-white px-5 pt-5 pb-10 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top App Bar */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={onClearAndGoHome}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer shadow-xs border border-white/10"
            aria-label="Return to Home"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-white tracking-wide uppercase">
              Order Verified
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer shadow-xs border border-white/10"
            aria-label="Share Exit Pass"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Celebratory Success Hero */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-3.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-[#17A890] flex items-center justify-center shadow-[0_0_32px_rgba(16,185,129,0.45)] ring-4 ring-white/20">
              <Check className="w-10 h-10 text-white stroke-[3.5]" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Payment Successful!
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xs leading-relaxed">
            Your self-checkout bill is paid. Show the QR pass below at the store exit.
          </p>

          <div className="mt-3.5 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-xs">
            <span className="text-sm font-black text-white">
              Paid {formatCurrency(paiseToRupees(confirmation.amountPaid))}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-xs font-mono font-bold text-emerald-200">
              {confirmation.orderId.substring(0, 10)}
            </span>
          </div>
        </div>
      </div>

      {/* ─── FULL-WIDTH TICKET SHEET (Flows smoothly from below) ─── */}
      <div className="relative -mt-6 bg-white rounded-t-[32px] shadow-[0_-16px_36px_rgba(0,0,0,0.18)] px-5 pt-6 pb-12 flex-1 flex flex-col space-y-5">
        {/* Store & Cart Info Strip */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F4F2]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#F0FAF7] border border-emerald-100 flex items-center justify-center text-[#083D33] shrink-0">
              <Store className="w-5 h-5 text-[#083D33]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-[#102B35] truncate">
                {confirmation.storeName || "SmartCart Supermarket"}
              </h2>
              <p className="text-[11px] text-[#718096] truncate mt-0.5">
                {confirmation.cartTag || "SmartCart #18"} · {formattedDate}, {formattedTime}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyOrderId}
            className="flex items-center gap-1 text-[11px] font-bold text-[#083D33] hover:text-[#042821] bg-[#F4F8F6] border border-[#E2EBE6] px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Copy className="w-3 h-3 text-[#17A890]" />
            <span>{copiedOrderId ? "Copied" : "Copy ID"}</span>
          </button>
        </div>

        {/* ─── DIGITAL EXIT GATE PASS (Clean Airline/Event Pass Style) ─── */}
        <div className="text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200/80">
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Store Exit Pass</span>
          </div>

          <p className="text-xs font-bold text-[#102B35]">
            Scan this QR code at the automated exit turnstile
          </p>

          {/* Centered QR Frame with Scanning Brackets */}
          <div className="flex justify-center my-2">
            <div className="relative p-4 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#E2EBE6]">
              {/* Corner Accents */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#17A890] rounded-tl-lg" />
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#17A890] rounded-tr-lg" />
              <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#17A890] rounded-bl-lg" />
              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#17A890] rounded-br-lg" />

              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Exit QR Code"
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                />
              ) : (
                <div className="w-44 h-44 bg-slate-50 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-300" />
                </div>
              )}
            </div>
          </div>

          {/* Passcode & 1-Tap Copy */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-[#718096] font-semibold">
              Exit Passcode:
            </span>
            <button
              type="button"
              onClick={handleCopyPasscode}
              className="inline-flex items-center gap-1.5 bg-[#F4F8F6] hover:bg-[#E9F3EF] border border-[#DCE7E1] px-3 py-1 rounded-xl cursor-pointer active:scale-95 transition-all"
            >
              <span className="text-base font-black tracking-widest text-[#102B35] font-mono">
                {confirmation.exitCode || "SC-9821"}
              </span>
              <Copy className="w-3.5 h-3.5 text-[#17A890]" />
            </button>
          </div>

          {/* Live Countdown Timer */}
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/60">
            <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
            <span>Pass valid for {formatCountdown(timeLeft)} mins</span>
          </div>
        </div>

        {/* ─── SUMMARY STATS (3 Segment Pills) ─── */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="bg-[#FAFBFB] border border-[#E9EFEA] rounded-2xl p-3 text-center">
            <span className="text-[10px] text-[#718096] uppercase font-bold tracking-wider block">
              Cart Items
            </span>
            <span className="text-xs font-extrabold text-[#102B35] mt-0.5 block">
              {totalItems} {totalItems === 1 ? "unit" : "units"}
            </span>
          </div>

          <div className="bg-[#FAFBFB] border border-[#E9EFEA] rounded-2xl p-3 text-center">
            <span className="text-[10px] text-[#718096] uppercase font-bold tracking-wider block">
              Total Paid
            </span>
            <span className="text-xs font-extrabold text-emerald-700 mt-0.5 block">
              {formatCurrency(paiseToRupees(confirmation.amountPaid))}
            </span>
          </div>

          <div className="bg-[#FAFBFB] border border-[#E9EFEA] rounded-2xl p-3 text-center">
            <span className="text-[10px] text-[#718096] uppercase font-bold tracking-wider block">
              Turnstile
            </span>
            <span className="text-xs font-extrabold text-emerald-600 mt-0.5 block flex items-center justify-center gap-0.5">
              <Check className="w-3 h-3 stroke-[3]" /> Active
            </span>
          </div>
        </div>

        {/* ─── PRIMARY & SECONDARY ACTIONS ─── */}
        <div className="space-y-2.5 pt-2">
          {/* View Detailed Receipt */}
          <Link
            href={`/receipts/${confirmation.orderId}?screen=receipt`}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#083D33] to-[#0A4D42] hover:from-[#063028] hover:to-[#083D33] text-white flex items-center justify-between font-bold text-sm shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span>View Full Tax Invoice &amp; Receipt</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/70" />
          </Link>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="py-3 px-3 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF5F2] border border-[#E2EBE6] flex items-center justify-center gap-2 text-xs font-bold text-[#102B35] transition-colors cursor-pointer active:scale-95"
            >
              {downloading ? (
                <div className="w-4 h-4 border-2 border-[#083D33] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-[#083D33]" />
              )}
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="py-3 px-3 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF5F2] border border-[#E2EBE6] flex items-center justify-center gap-2 text-xs font-bold text-[#102B35] transition-colors cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4 text-[#083D33]" />
              <span>Share Pass</span>
            </button>
          </div>

          {/* Done / Return to Store Home */}
          <button
            type="button"
            onClick={onClearAndGoHome}
            className="w-full py-3.5 px-4 rounded-2xl bg-white border border-[#DCE4E0] hover:bg-[#F8FAF9] text-[#102B35] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            <Home className="w-4 h-4 text-[#17A890]" />
            <span>Done · Exit to Store Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
