"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart-store";
import {
  CheckoutStep,
  BillSummary,
  PaymentMethodId,
  OrderConfirmation,
  PaymentInput,
  UpiPaymentInput,
  CardPaymentInput,
  NetBankingInput,
} from "@/types/checkout";
import {
  buildBillSummary,
  revalidateCartTotal,
  processPayment,
} from "@/lib/checkout-service";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { OrderReviewStep } from "@/components/checkout/order-review-step";
import { PaymentMethodStep } from "@/components/checkout/payment-method-step";
import { PaymentProcessingStep } from "@/components/checkout/payment-processing-step";
import { OrderConfirmationStep } from "@/components/checkout/order-confirmation-step";
import {
  Lock,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Store,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, session, selectedStore, clearCart, endSession } = useCart();
  const [mounted, setMounted] = useState(false);

  const [step, setStep] = useState<CheckoutStep>("review");
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [revalidationError, setRevalidationError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [frozenBill, setFrozenBill] = useState<BillSummary | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute bill from live items or freeze when entering payment/processing/confirmation
  const liveBill = useMemo(() => buildBillSummary(items), [items]);
  const currentBill = frozenBill || liveBill;

  // Step 1 -> 2: Price revalidation guard
  const handleProceedToPayment = async () => {
    if (!currentBill || currentBill.lineItems.length === 0) return;
    setIsRevalidating(true);
    setRevalidationError(null);

    try {
      const result = await revalidateCartTotal(currentBill);
      if (!result.confirmed || result.serverTotalPaise !== currentBill.totalPaise) {
        setRevalidationError(
          "Cart total changed during revalidation. Please review your cart items before continuing."
        );
        return;
      }
      // Freeze bill for the rest of checkout
      setFrozenBill(currentBill);
      setStep("payment");
    } catch {
      setRevalidationError(
        "Could not verify current store prices. Please check your connection and try again."
      );
    } finally {
      setIsRevalidating(false);
    }
  };

  // Step 2 -> 3 -> 4: Payment processing
  const handlePay = async (input: {
    method: PaymentMethodId;
    upi?: UpiPaymentInput;
    card?: CardPaymentInput;
    netbanking?: NetBankingInput;
  }) => {
    if (!currentBill) return;
    setSelectedMethod(input.method);
    setStep("processing");

    // Format payment input according to PaymentInput union
    let paymentInput: PaymentInput;
    if (input.method === "upi" && input.upi) {
      paymentInput = { method: "upi", upi: input.upi };
    } else if (input.method === "card" && input.card) {
      paymentInput = { method: "card", card: input.card };
    } else if (input.method === "netbanking" && input.netbanking) {
      paymentInput = { method: "netbanking", netbanking: input.netbanking };
    } else {
      paymentInput = {
        method: input.method as "wallet_gpay" | "wallet_phonepe" | "wallet_paytm",
      };
    }

    try {
      const orderConf = await processPayment(currentBill, paymentInput, {
        id: session.id || "SESSION-DEMO",
        cartTag: session.cartTag || "SmartCart #12",
        storeId: selectedStore.id || session.storeId || "STORE-01",
        storeName: selectedStore.name || session.storeName || "SmartCart Flagship",
      });
      setConfirmation(orderConf);
      setStep("confirmation");
      // Clear cart items on payment completion
      clearCart();
    } catch {
      setRevalidationError("Payment processing failed. Please try again.");
      setStep("payment");
    }
  };

  const handleClearAndGoHome = () => {
    clearCart();
    endSession();
    router.push("/");
  };

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto min-h-screen p-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#17A890] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[#718096]">Loading checkout…</p>
      </div>
    );
  }

  // If cart is empty and not on confirmation
  if (items.length === 0 && !confirmation && step !== "confirmation") {
    return (
      <div className="max-w-md mx-auto min-h-screen p-4 space-y-6 flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#17A890]/10 text-[#17A890] flex items-center justify-center shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-black text-[#102B35]">Your SmartCart is Empty</h1>
          <p className="text-xs text-[#718096] max-w-xs mx-auto">
            Add products using the scanner or explore our store catalogue to proceed to self-checkout.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          <Link
            href="/explore"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#17A890] hover:bg-[#128673] text-white shadow-md transition-all active:scale-[0.99] text-center"
          >
            Browse Store Catalogue
          </Link>
          <Link
            href="/scan"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-white border border-[#E5EBE8] text-[#102B35] hover:bg-[#F7F9F8] transition-all text-center"
          >
            Scan Barcodes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen p-4 pb-20 space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {step === "payment" ? (
            <button
              type="button"
              onClick={() => setStep("review")}
              className="w-8 h-8 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
              aria-label="Back to order review"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : step === "review" ? (
            <Link
              href="/cart"
              className="w-8 h-8 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#F7F9F8] transition-colors"
              aria-label="Back to cart"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : null}

          <div>
            <h1 className="text-base font-black text-[#102B35] flex items-center gap-1.5">
              <span>Checkout</span>
              <Lock className="w-3.5 h-3.5 text-[#17A890]" />
            </h1>
            <p className="text-[10px] text-[#718096] flex items-center gap-1">
              <Store className="w-3 h-3 text-[#17A890]" />
              <span>{selectedStore.name || "SmartCart Flagship"}</span>
              <span>•</span>
              <span>{session.cartTag || "SmartCart #12"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL</span>
        </div>
      </header>

      {/* 4-Step Progress Indicator */}
      <CheckoutStepper currentStep={step} />

      {/* Step Content */}
      <main className="transition-all duration-200">
        {step === "review" && (
          <OrderReviewStep
            bill={currentBill}
            isRevalidating={isRevalidating}
            revalidationError={revalidationError}
            onProceed={handleProceedToPayment}
          />
        )}

        {step === "payment" && (
          <PaymentMethodStep
            bill={currentBill}
            onBack={() => setStep("review")}
            onPay={handlePay}
          />
        )}

        {step === "processing" && (
          <PaymentProcessingStep
            bill={currentBill}
            method={selectedMethod || "upi"}
          />
        )}

        {step === "confirmation" && confirmation && (
          <OrderConfirmationStep
            confirmation={confirmation}
            onClearAndGoHome={handleClearAndGoHome}
          />
        )}
      </main>
    </div>
  );
}
