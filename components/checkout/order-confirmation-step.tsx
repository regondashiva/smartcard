"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { OrderConfirmation } from "@/types/checkout";
import { formatCurrency } from "@/lib/utils";
import { paiseToRupees } from "@/lib/checkout-service";
import {
  CheckCircle2,
  Receipt,
  Home,
  ShoppingBag,
  Share2,
  Copy,
} from "lucide-react";

// ─── QR Code (CSS-only simplified receipt QR) ─────────────────────────────────
// In production use a real QR library. This renders the receipt data as a
// scannable-looking visual without any external dependency.

function ReceiptQr({ data, exitCode }: { data: string; exitCode: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Exit gate badge */}
      <div className="bg-[#102B35] text-white rounded-2xl px-6 py-3 text-center">
        <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">
          Exit Gate Code
        </p>
        <p className="text-3xl font-black tracking-[0.3em] mt-0.5">{exitCode}</p>
        <p className="text-[10px] text-white/60 mt-1">
          Show this code at the exit scanner
        </p>
      </div>

      {/* QR placeholder — real QR lib would go here */}
      <div className="w-40 h-40 bg-white border-2 border-[#E5EBE8] rounded-2xl p-3 relative overflow-hidden">
        {/* Simulated QR pattern using CSS grid */}
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='134' height='134'%3E%3Crect width='134' height='134' fill='white'/%3E%3Crect x='0' y='0' width='40' height='40' fill='%23102B35'/%3E%3Crect x='4' y='4' width='32' height='32' fill='white'/%3E%3Crect x='8' y='8' width='24' height='24' fill='%23102B35'/%3E%3Crect x='94' y='0' width='40' height='40' fill='%23102B35'/%3E%3Crect x='98' y='4' width='32' height='32' fill='white'/%3E%3Crect x='102' y='8' width='24' height='24' fill='%23102B35'/%3E%3Crect x='0' y='94' width='40' height='40' fill='%23102B35'/%3E%3Crect x='4' y='98' width='32' height='32' fill='white'/%3E%3Crect x='8' y='102' width='24' height='24' fill='%23102B35'/%3E%3Crect x='48' y='4' width='8' height='8' fill='%23102B35'/%3E%3Crect x='60' y='4' width='8' height='8' fill='%23102B35'/%3E%3Crect x='72' y='4' width='8' height='8' fill='%23102B35'/%3E%3Crect x='80' y='4' width='8' height='8' fill='%23102B35'/%3E%3Crect x='48' y='16' width='8' height='8' fill='%23102B35'/%3E%3Crect x='60' y='16' width='8' height='8' fill='%23102B35'/%3E%3Crect x='72' y='20' width='8' height='8' fill='%23102B35'/%3E%3Crect x='48' y='28' width='16' height='8' fill='%23102B35'/%3E%3Crect x='70' y='28' width='20' height='8' fill='%23102B35'/%3E%3Crect x='4' y='48' width='8' height='8' fill='%23102B35'/%3E%3Crect x='16' y='48' width='8' height='8' fill='%23102B35'/%3E%3Crect x='28' y='48' width='8' height='8' fill='%23102B35'/%3E%3Crect x='48' y='48' width='16' height='8' fill='%23102B35'/%3E%3Crect x='68' y='48' width='8' height='8' fill='%23102B35'/%3E%3Crect x='80' y='48' width='8' height='8' fill='%23102B35'/%3E%3Crect x='94' y='48' width='8' height='8' fill='%23102B35'/%3E%3Crect x='110' y='48' width='8' height='8' fill='%23102B35'/%3E%3Crect x='122' y='48' width='8' height='8' fill='%23102B35'/%3E%3Crect x='4' y='60' width='8' height='8' fill='%23102B35'/%3E%3Crect x='20' y='60' width='8' height='8' fill='%23102B35'/%3E%3Crect x='48' y='60' width='8' height='8' fill='%23102B35'/%3E%3Crect x='62' y='60' width='16' height='8' fill='%23102B35'/%3E%3Crect x='80' y='60' width='16' height='8' fill='%23102B35'/%3E%3Crect x='100' y='60' width='8' height='8' fill='%23102B35'/%3E%3Crect x='120' y='60' width='12' height='8' fill='%23102B35'/%3E%3Crect x='4' y='72' width='8' height='8' fill='%23102B35'/%3E%3Crect x='14' y='72' width='20' height='8' fill='%23102B35'/%3E%3Crect x='48' y='72' width='8' height='8' fill='%23102B35'/%3E%3Crect x='60' y='72' width='8' height='8' fill='%23102B35'/%3E%3Crect x='72' y='72' width='8' height='8' fill='%23102B35'/%3E%3Crect x='96' y='72' width='20' height='8' fill='%23102B35'/%3E%3Crect x='122' y='72' width='8' height='8' fill='%23102B35'/%3E%3Crect x='48' y='84' width='8' height='8' fill='%23102B35'/%3E%3Crect x='62' y='84' width='16' height='8' fill='%23102B35'/%3E%3Crect x='82' y='84' width='8' height='8' fill='%23102B35'/%3E%3Crect x='96' y='84' width='8' height='8' fill='%23102B35'/%3E%3Crect x='108' y='84' width='8' height='8' fill='%23102B35'/%3E%3Crect x='120' y='84' width='8' height='8' fill='%23102B35'/%3E%3Crect x='48' y='96' width='20' height='8' fill='%23102B35'/%3E%3Crect x='74' y='96' width='8' height='8' fill='%23102B35'/%3E%3Crect x='48' y='108' width='8' height='8' fill='%23102B35'/%3E%3Crect x='62' y='108' width='8' height='8' fill='%23102B35'/%3E%3Crect x='72' y='108' width='8' height='8' fill='%23102B35'/%3E%3Crect x='84' y='108' width='8' height='8' fill='%23102B35'/%3E%3Crect x='96' y='108' width='8' height='8' fill='%23102B35'/%3E%3Crect x='112' y='108' width='8' height='8' fill='%23102B35'/%3E%3Crect x='48' y='122' width='8' height='8' fill='%23102B35'/%3E%3Crect x='60' y='122' width='20' height='8' fill='%23102B35'/%3E%3Crect x='84' y='122' width='8' height='8' fill='%23102B35'/%3E%3Crect x='96' y='96' width='8' height='8' fill='%23102B35'/%3E%3Crect x='106' y='96' width='8' height='8' fill='%23102B35'/%3E%3Crect x='120' y='96' width='12' height='8' fill='%23102B35'/%3E%3Crect x='96' y='108' width='8' height='8' fill='%23102B35'/%3E%3Crect x='110' y='108' width='8' height='8' fill='%23102B35'/%3E%3Crect x='126' y='108' width='8' height='8' fill='%23102B35'/%3E%3Crect x='96' y='120' width='12' height='8' fill='%23102B35'/%3E%3Crect x='116' y='120' width='8' height='8' fill='%23102B35'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          aria-label="Receipt QR Code"
        />
      </div>
      <p className="text-[10px] text-[#718096] text-center">
        Scan at store exit gate or show exit code above
      </p>
    </div>
  );
}

// ─── Copy helper ─────────────────────────────────────────────────────────────

function useCopy() {
  const [copied, setCopied] = React.useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// ─── Main component ───────────────────────────────────────────────────────────

interface OrderConfirmationStepProps {
  confirmation: OrderConfirmation;
  onClearAndGoHome: () => void;
}

const METHOD_LABEL: Record<string, string> = {
  upi: "UPI",
  card: "Debit / Credit Card",
  netbanking: "Net Banking",
  wallet_gpay: "Google Pay",
  wallet_phonepe: "PhonePe",
  wallet_paytm: "Paytm",
};

export function OrderConfirmationStep({
  confirmation,
  onClearAndGoHome,
}: OrderConfirmationStepProps) {
  const { copied, copy } = useCopy();

  const formattedDate = new Date(confirmation.paidAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-4">
      {/* Success header */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-xs px-6 py-8 flex flex-col items-center gap-4 text-center">
        {/* Success icon with ring */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 stroke-[1.5]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#17A890] flex items-center justify-center border-2 border-white">
            <span className="text-white text-[9px] font-black">✓</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Payment Successful
          </span>
          <h2 className="text-xl font-black text-[#102B35] mt-2">
            {formatCurrency(paiseToRupees(confirmation.amountPaid))}
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Paid via {METHOD_LABEL[confirmation.paymentMethod]} · {formattedDate}
          </p>
        </div>
      </div>

      {/* Exit QR */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-xs px-5 py-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-[#17A890]" />
          <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
            Exit Receipt &amp; QR
          </h3>
        </div>
        <ReceiptQr data={confirmation.receiptQrData} exitCode={confirmation.exitCode} />
      </div>

      {/* Transaction details */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-xs p-5 space-y-3">
        <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider border-b border-[#E5EBE8] pb-2">
          Transaction Details
        </h3>
        {[
          { label: "Order ID", value: confirmation.orderId },
          { label: "Transaction ID", value: confirmation.transactionId },
          { label: "Store", value: confirmation.storeName },
          { label: "Cart", value: confirmation.cartTag },
          { label: "Items", value: `${confirmation.items.length} product${confirmation.items.length !== 1 ? "s" : ""}` },
          { label: "Total Units", value: String(confirmation.items.reduce((a, i) => a + i.quantity, 0)) },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <span className="text-[11px] text-[#718096] shrink-0">{label}</span>
            <span className="text-[11px] font-semibold text-[#18252B] text-right font-mono break-all">
              {value}
            </span>
          </div>
        ))}

        {/* Copy txn button */}
        <button
          type="button"
          onClick={() => copy(confirmation.transactionId)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#E5EBE8] text-[11px] font-semibold text-[#718096] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy Transaction ID"}
        </button>
      </div>

      {/* Primary Module 8 Exit Pass and Digital Receipt Actions */}
      <div className="space-y-2">
        <Link
          href={`/orders/${confirmation.orderId}/exit-pass`}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#17A890] hover:bg-[#128673] text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] text-center"
        >
          <Receipt className="w-4 h-4" />
          <span>Open Exit Pass &amp; Gate QR</span>
        </Link>

        <Link
          href={`/receipts/${confirmation.orderId}`}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-white border border-[#E5EBE8] text-[#102B35] hover:bg-[#F7F9F8] flex items-center justify-center gap-2 transition-all text-center shadow-2xs"
        >
          <Receipt className="w-4 h-4 text-[#17A890]" />
          <span>View Digital Tax Receipt</span>
        </Link>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() =>
            navigator.share?.({
              title: "SmartCart Receipt",
              text: `Order ${confirmation.orderId} · ${formatCurrency(paiseToRupees(confirmation.amountPaid))} · ${confirmation.storeName}`,
            }).catch(() => {})
          }
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E5EBE8] bg-white text-xs font-bold text-[#102B35] hover:bg-[#F7F9F8] transition-colors cursor-pointer shadow-xs"
        >
          <Share2 className="w-4 h-4" />
          Share Receipt
        </button>
        <Link
          href="/explore"
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E5EBE8] bg-white text-xs font-bold text-[#102B35] hover:bg-[#F7F9F8] transition-colors shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop Again
        </Link>
      </div>

      {/* Go home (clears cart) */}
      <button
        type="button"
        onClick={onClearAndGoHome}
        className="w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#102B35] hover:bg-[#0B1D24] text-white shadow-md transition-all active:scale-[0.99] cursor-pointer"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </button>
    </div>
  );
}
