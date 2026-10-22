"use client";

import React, { useState } from "react";
import { PaymentMethodId, BillSummary, UpiPaymentInput, CardPaymentInput, NetBankingInput } from "@/types/checkout";
import { PAYMENT_METHODS, NETBANKING_BANKS, paiseToRupees } from "@/lib/checkout-service";
import { formatCurrency } from "@/lib/utils";
import {
  ChevronRight,
  Lock,
  ArrowLeft,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
} from "lucide-react";

// ─── Method icon map ─────────────────────────────────────────────────────────

function MethodIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  if (iconKey === "upi")
    return (
      <div className={`rounded-lg bg-[#5D3FD3]/10 text-[#5D3FD3] flex items-center justify-center font-black text-[10px] ${className}`}>
        UPI
      </div>
    );
  if (iconKey === "gpay")
    return (
      <div className={`rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[10px] ${className}`}>
        GPay
      </div>
    );
  if (iconKey === "phonepe")
    return (
      <div className={`rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-black text-[10px] ${className}`}>
        PhPe
      </div>
    );
  if (iconKey === "paytm")
    return (
      <div className={`rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-black text-[10px] ${className}`}>
        Paytm
      </div>
    );
  if (iconKey === "card")
    return (
      <div className={`rounded-lg bg-[#102B35]/10 text-[#102B35] flex items-center justify-center ${className}`}>
        <CreditCard className="w-4 h-4" />
      </div>
    );
  if (iconKey === "netbanking")
    return (
      <div className={`rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center ${className}`}>
        <Building2 className="w-4 h-4" />
      </div>
    );
  return (
    <div className={`rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center ${className}`}>
      <Wallet className="w-4 h-4" />
    </div>
  );
}

// ─── UPI Form ────────────────────────────────────────────────────────────────

function UpiForm({ value, onChange }: { value: UpiPaymentInput; onChange: (v: UpiPaymentInput) => void }) {
  return (
    <div className="space-y-3 pt-3 px-4 pb-4 border-t border-[#F0F4F2]">
      <label className="block text-xs font-semibold text-[#102B35]">
        UPI ID
      </label>
      <input
        type="text"
        placeholder="yourname@upi"
        value={value.vpa}
        onChange={(e) => onChange({ vpa: e.target.value })}
        className="w-full text-sm border border-[#E5EBE8] rounded-xl px-3.5 py-3 bg-[#F7F9F8] focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#B0BEC5]"
        autoComplete="off"
        spellCheck={false}
      />
      <p className="text-[10px] text-[#718096]">
        Enter your registered UPI ID. You'll receive a collect request on your UPI app.
      </p>
    </div>
  );
}

// ─── Card Form ───────────────────────────────────────────────────────────────

function CardForm({ value, onChange }: { value: CardPaymentInput; onChange: (v: CardPaymentInput) => void }) {
  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);

  return (
    <div className="space-y-3 pt-3 px-4 pb-4 border-t border-[#F0F4F2]">
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#102B35]">Card Number</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          value={value.cardNumber}
          onChange={(e) => onChange({ ...value, cardNumber: formatCardNumber(e.target.value) })}
          className="w-full text-sm border border-[#E5EBE8] rounded-xl px-3.5 py-3 bg-[#F7F9F8] focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#B0BEC5] font-mono tracking-widest"
          maxLength={19}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#102B35]">Expiry</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM/YY"
            value={value.expiry}
            onChange={(e) => onChange({ ...value, expiry: formatExpiry(e.target.value) })}
            className="w-full text-sm border border-[#E5EBE8] rounded-xl px-3.5 py-3 bg-[#F7F9F8] focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#B0BEC5] font-mono"
            maxLength={5}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#102B35]">CVV</label>
          <input
            type="password"
            inputMode="numeric"
            placeholder="•••"
            value={value.cvv}
            onChange={(e) => onChange({ ...value, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            className="w-full text-sm border border-[#E5EBE8] rounded-xl px-3.5 py-3 bg-[#F7F9F8] focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#B0BEC5] font-mono"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#102B35]">Name on Card</label>
        <input
          type="text"
          placeholder="As printed on card"
          value={value.nameOnCard}
          onChange={(e) => onChange({ ...value, nameOnCard: e.target.value })}
          className="w-full text-sm border border-[#E5EBE8] rounded-xl px-3.5 py-3 bg-[#F7F9F8] focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#B0BEC5]"
          autoComplete="cc-name"
        />
      </div>
      <p className="text-[10px] text-[#718096] flex items-center gap-1">
        <Lock className="w-3 h-3" />
        Secured by 3D Secure 2.0. Your card details are never stored.
      </p>
    </div>
  );
}

// ─── Netbanking Form ─────────────────────────────────────────────────────────

function NetbankingForm({ value, onChange }: { value: NetBankingInput; onChange: (v: NetBankingInput) => void }) {
  return (
    <div className="pt-3 px-4 pb-4 border-t border-[#F0F4F2] space-y-3">
      <label className="block text-xs font-semibold text-[#102B35]">
        Select Bank
      </label>
      <div className="grid grid-cols-2 gap-2">
        {NETBANKING_BANKS.map((bank) => (
          <button
            key={bank.code}
            type="button"
            onClick={() => onChange({ bankCode: bank.code })}
            className={`text-left text-xs px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
              value.bankCode === bank.code
                ? "border-[#17A890] bg-[#17A890]/5 font-bold text-[#102B35]"
                : "border-[#E5EBE8] bg-[#F7F9F8] text-[#718096] hover:border-[#17A890]/40"
            }`}
          >
            {bank.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface PaymentMethodStepProps {
  bill: BillSummary;
  onBack: () => void;
  onPay: (input: { method: PaymentMethodId; upi?: UpiPaymentInput; card?: CardPaymentInput; netbanking?: NetBankingInput }) => void;
}

export function PaymentMethodStep({ bill, onBack, onPay }: PaymentMethodStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
  const [upiInput, setUpiInput] = useState<UpiPaymentInput>({ vpa: "" });
  const [cardInput, setCardInput] = useState<CardPaymentInput>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [netbankingInput, setNetbankingInput] = useState<NetBankingInput>({ bankCode: "" });

  const canPay = (() => {
    if (!selectedMethod) return false;
    if (selectedMethod === "upi") return upiInput.vpa.includes("@");
    if (selectedMethod === "card")
      return (
        cardInput.cardNumber.replace(/\s/g, "").length >= 16 &&
        cardInput.expiry.length === 5 &&
        cardInput.cvv.length >= 3 &&
        cardInput.nameOnCard.trim().length > 2
      );
    if (selectedMethod === "netbanking") return !!netbankingInput.bankCode;
    return true; // wallets
  })();

  const handlePay = () => {
    if (!selectedMethod || !canPay) return;
    onPay({
      method: selectedMethod,
      upi: selectedMethod === "upi" ? upiInput : undefined,
      card: selectedMethod === "card" ? cardInput : undefined,
      netbanking: selectedMethod === "netbanking" ? netbankingInput : undefined,
    });
  };

  // Group: popular first
  const popular = PAYMENT_METHODS.filter((m) => m.isPopular);
  const others = PAYMENT_METHODS.filter((m) => !m.isPopular);

  const renderMethodRow = (method: (typeof PAYMENT_METHODS)[number]) => {
    const isSelected = selectedMethod === method.id;
    return (
      <div key={method.id} className="bg-white rounded-2xl border border-[#E5EBE8] overflow-hidden transition-all">
        <button
          type="button"
          onClick={() =>
            setSelectedMethod(isSelected ? null : method.id)
          }
          className={`w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all ${
            isSelected ? "bg-[#F0FAF8]" : "hover:bg-[#F7F9F8]"
          }`}
        >
          <MethodIcon iconKey={method.iconKey} className="w-9 h-9 flex-shrink-0" />
          <div className="flex-1 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#102B35]">{method.label}</span>
              {method.isPopular && (
                <span className="text-[9px] font-bold bg-[#17A890]/10 text-[#17A890] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Popular
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#718096]">{method.description}</span>
          </div>
          {isSelected ? (
            <CheckCircle2 className="w-5 h-5 text-[#17A890] flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#B0BEC5] flex-shrink-0" />
          )}
        </button>

        {/* Inline forms */}
        {isSelected && method.id === "upi" && (
          <UpiForm value={upiInput} onChange={setUpiInput} />
        )}
        {isSelected && method.id === "card" && (
          <CardForm value={cardInput} onChange={setCardInput} />
        )}
        {isSelected && method.id === "netbanking" && (
          <NetbankingForm value={netbankingInput} onChange={setNetbankingInput} />
        )}
        {isSelected &&
          (method.id === "wallet_gpay" ||
            method.id === "wallet_phonepe" ||
            method.id === "wallet_paytm") && (
            <div className="px-4 pb-4 pt-3 border-t border-[#F0F4F2]">
              <p className="text-[11px] text-[#718096] leading-relaxed">
                You'll be redirected to {method.label} to authorise the payment.
                This is a demo — no real transaction will occur.
              </p>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Back */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#718096] hover:text-[#102B35] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Review Order
        </button>
        <span className="text-[11px] text-[#718096] bg-white px-2.5 py-1 rounded-full border border-[#E5EBE8]">
          Step 2 of 4
        </span>
      </div>

      {/* Amount chip */}
      <div className="bg-[#102B35] text-white rounded-2xl px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-medium text-white/70">Total Payable</span>
        <span className="text-xl font-black tracking-tight">
          {formatCurrency(paiseToRupees(bill.totalPaise))}
        </span>
      </div>

      {/* Popular methods */}
      <div>
        <h2 className="text-[10px] font-bold text-[#718096] uppercase tracking-wider px-1 mb-2">
          Popular
        </h2>
        <div className="space-y-2">
          {popular.map(renderMethodRow)}
        </div>
      </div>

      {/* Other methods */}
      <div>
        <h2 className="text-[10px] font-bold text-[#718096] uppercase tracking-wider px-1 mb-2">
          More Options
        </h2>
        <div className="space-y-2">
          {others.map(renderMethodRow)}
        </div>
      </div>

      {/* Pay CTA */}
      <button
        type="button"
        disabled={!canPay}
        onClick={handlePay}
        className={`w-full py-4 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer ${
          canPay
            ? "bg-[#17A890] hover:bg-[#128673] text-white"
            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
        }`}
      >
        <Lock className="w-4 h-4" />
        {canPay
          ? `Pay Securely · ${formatCurrency(paiseToRupees(bill.totalPaise))}`
          : "Select a Payment Method"}
      </button>
    </div>
  );
}
