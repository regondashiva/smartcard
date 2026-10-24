"use client";

import React, { useState } from "react";
import {
  PaymentMethodId,
  BillSummary,
  UpiPaymentInput,
  CardPaymentInput,
  NetBankingInput,
} from "@/types/checkout";
import {
  PAYMENT_METHODS,
  NETBANKING_BANKS,
  paiseToRupees,
} from "@/lib/checkout-service";
import { formatCurrency } from "@/lib/utils";
import {
  ChevronRight,
  Lock,
  ArrowLeft,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Banknote,
} from "lucide-react";

// ─── Brand Badges ───────────────────────────────────────────────────────────

function MethodBrandIcon({ id }: { id: string }) {
  if (id === "wallet_gpay") {
    return (
      <div className="w-10 h-10 rounded-2xl bg-[#EA4335]/5 border border-[#EA4335]/20 flex items-center justify-center shrink-0">
        <span className="font-black text-xs text-[#1A73E8]">
          G<span className="text-[#EA4335]">P</span><span className="text-[#FBBC05]">a</span><span className="text-[#34A853]">y</span>
        </span>
      </div>
    );
  }

  if (id === "wallet_phonepe") {
    return (
      <div className="w-10 h-10 rounded-2xl bg-[#5f259f]/10 border border-[#5f259f]/20 flex items-center justify-center shrink-0">
        <span className="font-black text-xs text-[#5f259f]">पे</span>
      </div>
    );
  }

  if (id === "wallet_paytm") {
    return (
      <div className="w-10 h-10 rounded-2xl bg-[#00BAF2]/10 border border-[#00BAF2]/25 flex items-center justify-center shrink-0">
        <span className="font-black text-[11px] text-[#002E6E]">Paytm</span>
      </div>
    );
  }

  if (id === "upi") {
    return (
      <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#17A890] shrink-0 font-black text-xs">
        UPI
      </div>
    );
  }

  if (id === "card") {
    return (
      <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#102B35] shrink-0">
        <CreditCard className="w-5 h-5 text-[#102B35]" />
      </div>
    );
  }

  if (id === "netbanking") {
    return (
      <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
        <Building2 className="w-5 h-5 text-amber-600" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#718096] shrink-0">
      <Wallet className="w-5 h-5" />
    </div>
  );
}

// ─── UPI Inline Form ─────────────────────────────────────────────────────────

function UpiInlineForm({
  value,
  onChange,
}: {
  value: UpiPaymentInput;
  onChange: (v: UpiPaymentInput) => void;
}) {
  const popularHandles = ["@okhdfcbank", "@okaxis", "@oksbi", "@ybl", "@paytm"];

  const handleSuffixClick = (suffix: string) => {
    const base = value.vpa.split("@")[0] || "username";
    onChange({ vpa: `${base}${suffix}` });
  };

  return (
    <div className="pt-3 px-4 pb-4 border-t border-[#F0F4F2] space-y-3 bg-[#FAFBFB]">
      <div>
        <label className="block text-xs font-bold text-[#102B35] mb-1">
          Enter your UPI ID / VPA
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="mobilenumber@upi"
            value={value.vpa}
            onChange={(e) => onChange({ vpa: e.target.value })}
            className="w-full text-sm font-medium border border-[#DCE4E0] rounded-xl px-3.5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#A0AEC0]"
            autoComplete="off"
            spellCheck={false}
          />
          {value.vpa.includes("@") && (
            <span className="absolute right-3.5 top-3.5 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Valid
            </span>
          )}
        </div>
      </div>

      <div>
        <span className="text-[10px] font-semibold text-[#718096] block mb-1.5">
          Quick handle autofill:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {popularHandles.map((handle) => (
            <button
              key={handle}
              type="button"
              onClick={() => handleSuffixClick(handle)}
              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-white border border-[#DCE4E0] text-[#102B35] hover:border-[#17A890] hover:text-[#17A890] transition-colors"
            >
              {handle}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-[#718096] flex items-center gap-1 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#17A890]" />
        Payment collect request will be sent directly to your UPI app.
      </p>
    </div>
  );
}

// ─── Card Form ───────────────────────────────────────────────────────────────

function CardInlineForm({
  value,
  onChange,
}: {
  value: CardPaymentInput;
  onChange: (v: CardPaymentInput) => void;
}) {
  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(clean)) return "Mastercard";
    if (/^60|^65|^81|^82/.test(clean)) return "RuPay";
    if (/^3[47]/.test(clean)) return "AMEX";
    return null;
  };

  const detectedBrand = getCardBrand(value.cardNumber);

  return (
    <div className="space-y-3.5 pt-3 px-4 pb-4 border-t border-[#F0F4F2] bg-[#FAFBFB]">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-[#102B35]">Card Number</label>
          {detectedBrand && (
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {detectedBrand}
            </span>
          )}
        </div>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          value={value.cardNumber}
          onChange={(e) =>
            onChange({ ...value, cardNumber: formatCardNumber(e.target.value) })
          }
          className="w-full text-sm border border-[#DCE4E0] rounded-xl px-3.5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#A0AEC0] font-mono tracking-wider"
          maxLength={19}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#102B35]">Expiry Date</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM / YY"
            value={value.expiry}
            onChange={(e) =>
              onChange({ ...value, expiry: formatExpiry(e.target.value) })
            }
            className="w-full text-sm border border-[#DCE4E0] rounded-xl px-3.5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#A0AEC0] font-mono"
            maxLength={5}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#102B35]">CVV / CVC</label>
          <input
            type="password"
            inputMode="numeric"
            placeholder="•••"
            value={value.cvv}
            onChange={(e) =>
              onChange({
                ...value,
                cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
              })
            }
            className="w-full text-sm border border-[#DCE4E0] rounded-xl px-3.5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#A0AEC0] font-mono"
            maxLength={4}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#102B35]">Cardholder Name</label>
        <input
          type="text"
          placeholder="Name on card"
          value={value.nameOnCard}
          onChange={(e) => onChange({ ...value, nameOnCard: e.target.value })}
          className="w-full text-sm border border-[#DCE4E0] rounded-xl px-3.5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition placeholder:text-[#A0AEC0]"
          autoComplete="cc-name"
        />
      </div>

      <p className="text-[10px] text-[#718096] flex items-center gap-1.5 pt-1">
        <Lock className="w-3.5 h-3.5 text-[#17A890]" />
        Secured by 256-Bit SSL &amp; PCI-DSS compliance. Details are never stored.
      </p>
    </div>
  );
}

// ─── Netbanking Form ─────────────────────────────────────────────────────────

function NetbankingInlineForm({
  value,
  onChange,
}: {
  value: NetBankingInput;
  onChange: (v: NetBankingInput) => void;
}) {
  return (
    <div className="pt-3 px-4 pb-4 border-t border-[#F0F4F2] space-y-3 bg-[#FAFBFB]">
      <label className="block text-xs font-bold text-[#102B35]">
        Select Your Bank
      </label>
      <div className="grid grid-cols-2 gap-2">
        {NETBANKING_BANKS.map((bank) => (
          <button
            key={bank.code}
            type="button"
            onClick={() => onChange({ bankCode: bank.code })}
            className={`text-left text-xs px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
              value.bankCode === bank.code
                ? "border-[#17A890] bg-[#17A890]/10 font-bold text-[#102B35] ring-2 ring-[#17A890]/20"
                : "border-[#DCE4E0] bg-white text-[#4A5568] hover:border-[#17A890]/40"
            }`}
          >
            {bank.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Payment Method Step Component ─────────────────────────────────────

interface PaymentMethodStepProps {
  bill: BillSummary;
  onBack: () => void;
  onPay: (input: {
    method: PaymentMethodId;
    upi?: UpiPaymentInput;
    card?: CardPaymentInput;
    netbanking?: NetBankingInput;
  }) => void;
}

export function PaymentMethodStep({
  bill,
  onBack,
  onPay,
}: PaymentMethodStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(
    "wallet_gpay" // default to Google Pay for instant checkout
  );
  const [upiInput, setUpiInput] = useState<UpiPaymentInput>({ vpa: "" });
  const [cardInput, setCardInput] = useState<CardPaymentInput>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [netbankingInput, setNetbankingInput] = useState<NetBankingInput>({
    bankCode: "",
  });

  const totalRupees = paiseToRupees(bill.totalPaise);
  const savingsRupees = paiseToRupees(bill.savingsPaise);

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
    return true; // 1-tap wallets (Google Pay, PhonePe, Paytm)
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

  const popular = PAYMENT_METHODS.filter((m) => m.isPopular);
  const others = PAYMENT_METHODS.filter((m) => !m.isPopular);

  const renderMethodCard = (method: (typeof PAYMENT_METHODS)[number]) => {
    const isSelected = selectedMethod === method.id;

    return (
      <div
        key={method.id}
        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
          isSelected
            ? "border-[#17A890] shadow-[0_4px_16px_rgba(23,168,144,0.12)] ring-1 ring-[#17A890]"
            : "border-[#E2EBE6] hover:border-[#CBDCD4] shadow-2xs"
        }`}
      >
        <button
          type="button"
          onClick={() => setSelectedMethod(isSelected ? null : method.id)}
          className={`w-full flex items-center gap-3.5 px-4 py-3.5 cursor-pointer text-left transition-colors ${
            isSelected ? "bg-[#F0FAF7]/60" : "hover:bg-[#F8FAF9]"
          }`}
        >
          <MethodBrandIcon id={method.id} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#102B35]">
                {method.label}
              </span>
              {method.isPopular && (
                <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Fast Pay
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#718096] truncate mt-0.5">
              {method.description}
            </p>
          </div>

          {/* Radio check indicator */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
              isSelected
                ? "bg-[#17A890] text-white ring-2 ring-[#17A890]/25"
                : "border-2 border-[#CBD5E1]"
            }`}
          >
            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </button>

        {/* Dynamic forms for selected item */}
        {isSelected && method.id === "upi" && (
          <UpiInlineForm value={upiInput} onChange={setUpiInput} />
        )}
        {isSelected && method.id === "card" && (
          <CardInlineForm value={cardInput} onChange={setCardInput} />
        )}
        {isSelected && method.id === "netbanking" && (
          <NetbankingInlineForm
            value={netbankingInput}
            onChange={setNetbankingInput}
          />
        )}
        {isSelected &&
          (method.id === "wallet_gpay" ||
            method.id === "wallet_phonepe" ||
            method.id === "wallet_paytm") && (
            <div className="px-4 pb-3.5 pt-2 border-t border-[#F0F4F2] bg-[#FAFBFB]">
              <div className="flex items-center gap-2 text-[11px] text-[#4A5568]">
                <Smartphone className="w-3.5 h-3.5 text-[#17A890] shrink-0" />
                <span>
                  Tap <strong>Pay Securely</strong> below to authorize via {method.label}.
                </span>
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Total Payable Card (Polished Fintech Gradient) */}
      <div className="rounded-2xl bg-gradient-to-br from-[#102B35] to-[#0A1E26] text-white p-4 shadow-md border border-[#1B3F4D]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
              Total to Pay
            </span>
            <div className="text-2xl font-black tracking-tight text-white mt-0.5">
              {formatCurrency(totalRupees)}
            </div>
          </div>

          {savingsRupees > 0 && (
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Saved {formatCurrency(savingsRupees)}
              </span>
              <span className="text-[10px] text-white/60 block mt-1">
                {bill.totalUnits} items in cart
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Fast Pay Methods */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
            Recommended (Instant UPI)
          </h2>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Zero Charges
          </span>
        </div>
        <div className="space-y-2">{popular.map(renderMethodCard)}</div>
      </div>

      {/* More Payment Options */}
      <div className="space-y-2">
        <div className="px-1">
          <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
            Cards &amp; Net Banking
          </h2>
        </div>
        <div className="space-y-2">{others.map(renderMethodCard)}</div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E2EBE6] p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider block">
              Total Payable
            </span>
            <span className="text-xl font-black text-[#102B35]">
              {formatCurrency(totalRupees)}
            </span>
          </div>

          <button
            type="button"
            disabled={!canPay}
            onClick={handlePay}
            className={`flex-1 py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer ${
              canPay
                ? "bg-gradient-to-r from-[#17A890] to-[#0f8b76] hover:from-[#149580] hover:to-[#0c7a67] text-white shadow-[#17A890]/25"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>
              {canPay
                ? `Pay ${formatCurrency(totalRupees)} Securely`
                : "Select Payment Method"}
            </span>
            {canPay && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        </div>
      </div>
    </div>
  );
}
