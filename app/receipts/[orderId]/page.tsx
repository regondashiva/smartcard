"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getOrderById } from "@/lib/receipt-service";
import { DigitalReceipt } from "@/types/receipt";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Printer,
  Share2,
  Copy,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Store,
  Calendar,
  CreditCard,
  Tag,
  AlertCircle,
  Download,
  ShoppingBag,
} from "lucide-react";

export default function ReceiptPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const [receipt, setReceipt] = useState<DigitalReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!params?.orderId) return;
    try {
      const data = getOrderById(params.orderId);
      setReceipt(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [params?.orderId]);

  const handleCopyOrderId = () => {
    if (!receipt) return;
    navigator.clipboard.writeText(receipt.orderId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!receipt) return;
    if (navigator.share) {
      navigator
        .share({
          title: `SmartCart Digital Receipt — ${receipt.orderId}`,
          text: `SmartCart AI Tax Invoice for ${receipt.storeName} · Total: ${formatCurrency(
            receipt.finalAmount
          )} · Exit Code: ${receipt.exitCode}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopyOrderId();
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen p-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#17A890] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[#718096]">Retrieving digital receipt…</p>
      </div>
    );
  }

  // Unavailable receipt state
  if (!receipt) {
    return (
      <div className="max-w-md mx-auto min-h-screen p-4 flex flex-col justify-center items-center text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-xs">
          <h1 className="text-lg font-black text-[#102B35]">Receipt Unavailable</h1>
          <p className="text-xs text-[#718096] leading-relaxed">
            The requested order reference{" "}
            <span className="font-mono font-bold text-[#102B35]">
              {params?.orderId}
            </span>{" "}
            could not be found or verified on this device.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Link
            href="/orders"
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#102B35] text-white text-center hover:bg-[#0B1D24] transition-colors"
          >
            View My Order History
          </Link>
          <Link
            href="/explore"
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-white border border-[#E5EBE8] text-[#102B35] text-center hover:bg-[#F7F9F8] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(receipt.purchaseDate).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-md mx-auto min-h-screen p-4 pb-20 space-y-4">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between pb-1 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-[#102B35]">Digital Receipt</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
            title="Share Receipt"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#E5EBE8] text-xs font-bold text-[#102B35] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Exit Pass Banner (hidden when printing) */}
      {receipt.orderStatus === "ready_for_exit" && (
        <div className="bg-[#102B35] text-white rounded-2xl p-4 shadow-md flex items-center justify-between print:hidden">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Scale & Payment Cleared
            </span>
            <p className="text-xs font-bold">Present Exit Pass at Gate</p>
            <p className="text-[10px] text-white/70">
              Gate Code: <span className="font-mono font-bold text-white tracking-widest">{receipt.exitCode}</span>
            </p>
          </div>
          <Link
            href={`/orders/${receipt.orderId}/exit-pass`}
            className="bg-[#17A890] hover:bg-[#128673] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Exit QR</span>
          </Link>
        </div>
      )}

      {/* ─── The Printable Receipt Container ─────────────────────────────────── */}
      <div
        id="digital-receipt-printable"
        className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-xs space-y-4 print:border-none print:shadow-none print:p-0"
      >
        {/* Brand & Store Header */}
        <div className="text-center pb-3 border-b border-[#E5EBE8] space-y-1">
          <div className="inline-flex items-center gap-1.5 justify-center">
            <div className="w-6 h-6 rounded-lg bg-[#102B35] text-white flex items-center justify-center font-black text-xs">
              S
            </div>
            <span className="text-base font-black tracking-tight text-[#102B35]">
              SmartCart<span className="text-[#17A890]">AI</span>
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#102B35]">{receipt.storeName}</p>
          <p className="text-[10px] text-[#718096] max-w-xs mx-auto leading-tight">
            {receipt.storeAddress}
          </p>
          <p className="text-[9px] text-[#718096] font-mono">
            GSTIN: {receipt.storeGstin} • {receipt.cartTag}
          </p>
        </div>

        {/* Invoice & Metadata Bar */}
        <div className="bg-[#F7F9F8] rounded-2xl p-3 border border-[#E5EBE8] text-xs space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] text-[#718096] block uppercase tracking-wider">
                Order Reference
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-[#102B35]">
                  {receipt.orderId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="p-1 text-[#718096] hover:text-[#102B35] transition-colors print:hidden cursor-pointer"
                  title="Copy Order ID"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {copied && (
                  <span className="text-[9px] text-emerald-600 font-bold">Copied</span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#718096] block uppercase tracking-wider">
                Status
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                PAID & VERIFIED
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E5EBE8] text-[11px]">
            <div>
              <span className="text-[9px] text-[#718096] block">DATE & TIME</span>
              <span className="text-[#102B35] font-medium">{formattedDate}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[#718096] block">PAYMENT METHOD</span>
              <span className="text-[#102B35] font-medium">{receipt.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Itemized Products Table */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-[#718096] border-b border-[#E5EBE8] pb-1.5 uppercase tracking-wider">
            <span>Item / Qty</span>
            <span>Total</span>
          </div>

          <div className="divide-y divide-[#F0F4F2]">
            {receipt.items.map((item, index) => (
              <div key={item.productId || index} className="py-2.5 flex justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  {item.imageUrl && (
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-50 border border-[#E5EBE8] shrink-0 print:hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="32px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#102B35] leading-tight truncate">
                      {item.productName}
                    </p>
                    <p className="text-[10px] text-[#718096]">
                      {item.quantity} × {formatCurrency(item.unitPrice)}{" "}
                      <span className="text-slate-400">({item.unit})</span>
                      {item.originalPrice && item.originalPrice > item.unitPrice && (
                        <span className="line-through text-slate-400 ml-1">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-[#102B35]">
                    {formatCurrency(item.total)}
                  </p>
                  {item.itemDiscount && item.itemDiscount > 0 ? (
                    <p className="text-[9px] text-emerald-700 font-bold">
                      Saved {formatCurrency(item.itemDiscount)}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Summary Calculations */}
        <div className="space-y-1.5 pt-2 border-t border-[#E5EBE8] text-xs">
          <div className="flex justify-between text-[#718096]">
            <span>Gross Total (MRP)</span>
            <span>{formatCurrency(receipt.grossSubtotal)}</span>
          </div>

          {receipt.savings > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Store Offers & Discounts
              </span>
              <span>- {formatCurrency(receipt.savings)}</span>
            </div>
          )}

          <div className="flex justify-between text-[#718096]">
            <span>Net Subtotal</span>
            <span>{formatCurrency(receipt.netSubtotal)}</span>
          </div>

          <div className="flex justify-between text-[#718096] text-[11px]">
            <span>Goods & Services Tax (GST)</span>
            <span>Included in MRP</span>
          </div>

          <div className="flex justify-between text-[#718096] text-[11px]">
            <span>Self-Checkout Convenience Fee</span>
            <span className="text-emerald-700 font-bold">FREE</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t-2 border-[#102B35] text-sm font-black text-[#102B35]">
            <span>Total Paid (INR)</span>
            <span className="text-base text-[#102B35]">
              {formatCurrency(receipt.finalAmount)}
            </span>
          </div>
        </div>

        {/* Exit Pass Credentials Footer */}
        <div className="bg-[#102B35] text-white rounded-2xl p-3.5 text-center space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-white/70">
            Exit Gate Clearance Code
          </p>
          <p className="text-2xl font-black font-mono tracking-[0.25em]">
            {receipt.exitCode}
          </p>
          <p className="text-[9px] text-white/70">
            Valid at Indiranagar Store automated exit gates
          </p>
        </div>

        {/* Compliance Footer */}
        <div className="text-center pt-2 border-t border-[#F0F4F2] space-y-1">
          <p className="text-[10px] text-[#718096]">
            This is a computer-generated digital tax invoice issued by SmartCart AI.
          </p>
          <p className="text-[9px] text-[#B0BEC5]">
            Transaction Ref: {receipt.transactionId}
          </p>
        </div>
      </div>

      {/* Action Buttons (print:hidden) */}
      <div className="grid grid-cols-2 gap-2.5 print:hidden">
        <Link
          href={`/orders/${receipt.orderId}/exit-pass`}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#17A890] hover:bg-[#128673] text-white flex items-center justify-center gap-1.5 shadow-md transition-all text-center"
        >
          <QrCode className="w-4 h-4" />
          <span>Open Exit Pass</span>
        </Link>
        <Link
          href="/orders"
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-white border border-[#E5EBE8] text-[#102B35] hover:bg-[#F7F9F8] flex items-center justify-center gap-1.5 transition-all text-center"
        >
          <span>All Orders</span>
        </Link>
      </div>
    </div>
  );
}
