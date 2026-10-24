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
        cartTag: session.cartTag || "SmartCart #18",
        storeId: selectedStore.id || session.storeId || "STORE-01",
        storeName: selectedStore.name || session.storeName || "SmartCart Supermarket",
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
      <div className="max-w-md mx-auto min-h-screen p-6 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#17A890] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#718096]">Loading secure checkout…</p>
      </div>
    );
  }

  // Final Confirmation: FULL COVER EDGE-TO-EDGE EXPERIENCE
  if (step === "confirmation" && confirmation) {
    return (
      <div
        className="-mx-4 -mt-3 min-h-screen"
        style={{ marginBottom: "calc(-5rem - env(safe-area-inset-bottom, 16px))" }}
      >
        <OrderConfirmationStep
          confirmation={confirmation}
          onClearAndGoHome={handleClearAndGoHome}
        />
      </div>
    );
  }

  // If cart is empty and not on confirmation
  if (items.length === 0 && !confirmation && step !== "confirmation") {
    return (
      <div className="max-w-md mx-auto min-h-[80vh] px-4 py-12 flex flex-col justify-center items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#17A890]/10 text-[#17A890] flex items-center justify-center shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-black text-[#102B35]">Your Cart is Empty</h1>
          <p className="text-xs text-[#718096] max-w-xs mx-auto leading-relaxed">
            Scan items in the supermarket aisle or browse our catalogue to begin self-checkout.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          <Link
            href="/explore"
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-[#17A890] hover:bg-[#128673] text-white shadow-md transition-all active:scale-[0.99] text-center"
          >
            Browse Products &amp; Deals
          </Link>
          <Link
            href="/scan"
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-white border border-[#E2EBE6] text-[#102B35] hover:bg-[#F8FAF9] transition-all text-center"
          >
            Scan Aisle Barcodes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-20">
      {/* Full-Bleed Sticky Checkout Header */}
      <header className="-mx-4 -mt-3 px-4 py-3 sticky top-0 z-30 bg-white/95 backdrop-blur-md flex items-center justify-between border-b border-[#E2EBE6] shadow-2xs">
        <div className="flex items-center gap-2.5">
          {step === "payment" ? (
            <button
              type="button"
              onClick={() => setStep("review")}
              className="w-9 h-9 rounded-2xl bg-[#F8FAF9] border border-[#DCE4E0] flex items-center justify-center text-[#102B35] hover:bg-[#F0F4F2] transition-colors cursor-pointer shadow-2xs"
              aria-label="Back to order review"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : step === "review" ? (
            <Link
              href="/cart"
              className="w-9 h-9 rounded-2xl bg-[#F8FAF9] border border-[#DCE4E0] flex items-center justify-center text-[#102B35] hover:bg-[#F0F4F2] transition-colors shadow-2xs"
              aria-label="Back to cart"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : null}

          <div>
            <h1 className="text-sm font-black text-[#102B35] flex items-center gap-1.5 leading-tight">
              <span>Self-Checkout</span>
              <Lock className="w-3.5 h-3.5 text-[#17A890]" />
            </h1>
            <p className="text-[10px] text-[#718096] flex items-center gap-1 font-medium mt-0.5">
              <Store className="w-3 h-3 text-[#17A890]" />
              <span className="truncate max-w-[160px] sm:max-w-xs">
                {selectedStore.name || "SmartCart Supermarket"}
              </span>
              <span>•</span>
              <span className="font-bold text-[#102B35]">
                {session.cartTag || "SmartCart #18"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL</span>
        </div>
      </header>

      {/* Stepper (Steps 1, 2, 3) */}
      <CheckoutStepper currentStep={step} />

      {/* Step Content */}
      <div className="transition-all duration-200">
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
            method={selectedMethod || "wallet_gpay"}
          />
        )}
      </div>
    </div>
  );
}
