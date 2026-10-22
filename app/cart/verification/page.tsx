"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart-store";
import { verificationService } from "@/lib/verification-service";
import {
  VerificationSummary,
  ItemVerificationResult,
  VerificationDiscrepancy,
  SimulationScenario,
  AssistanceRequest,
} from "@/types/verification";
import { VerificationDashboard } from "@/components/verification/verification-dashboard";
import { VerificationItemCard } from "@/components/verification/verification-item-card";
import { SimulationScenarioBar } from "@/components/verification/simulation-scenario-bar";
import { MismatchAlertSheet } from "@/components/verification/mismatch-alert-sheet";
import { StaffAssistanceModal } from "@/components/verification/staff-assistance-modal";
import { VerificationHistoryTimeline } from "@/components/verification/verification-history-timeline";
import {
  ArrowLeft,
  ShoppingCart,
  Lock,
  ScanLine,
  CheckCircle2,
  Info,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CartVerificationPage() {
  const router = useRouter();
  const { items, session, selectedStore, getItemCount, getSubtotal } = useCart();
  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  const [currentScenario, setCurrentScenario] = useState<SimulationScenario>(
    verificationService.getScenario()
  );
  const [isRetrying, setIsRetrying] = useState(false);
  const [selectedDiscrepancy, setSelectedDiscrepancy] =
    useState<VerificationDiscrepancy | null>(null);
  const [isAlertSheetOpen, setIsAlertSheetOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [activeAssistanceRequest, setActiveAssistanceRequest] =
    useState<AssistanceRequest | null>(null);

  // Evaluate cart items with verificationService
  const { summary, results } = useMemo(() => {
    verificationService.setScenario(currentScenario);
    return verificationService.evaluateCart(items);
  }, [items, currentScenario]);

  const eventHistory = verificationService.getEventHistory();

  const handleSelectScenario = (scenario: SimulationScenario) => {
    setCurrentScenario(scenario);
    verificationService.setScenario(scenario);
  };

  const handleRetryVerification = async () => {
    setIsRetrying(true);
    await verificationService.retryVerification(items);
    setIsRetrying(false);
  };

  const handleOpenDiscrepancy = (disc: VerificationDiscrepancy) => {
    setSelectedDiscrepancy(disc);
    setIsAlertSheetOpen(true);
  };

  const handleResolveDiscrepancy = (discId: string) => {
    verificationService.resolveDiscrepancy(discId, "attendant_cleared");
    setCurrentScenario("all_verified");
  };

  const handleRequestStaff = () => {
    const req = verificationService.requestStaffAssistance(
      selectedDiscrepancy?.id,
      session.cartTag
    );
    setActiveAssistanceRequest(req);
    setIsStaffModalOpen(true);
  };

  const handleCancelStaffRequest = () => {
    verificationService.clearAssistanceRequest();
    setActiveAssistanceRequest(null);
    setIsStaffModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors"
            aria-label="Back to Cart"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#102B35] leading-tight">
              Cart Verification
            </h1>
            <p className="text-[11px] text-[#718096]">
              {session.cartTag} • {selectedStore.name}
            </p>
          </div>
        </div>

        <Link
          href="/cart"
          className="relative w-9 h-9 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#18252B] hover:bg-slate-50 transition-colors shadow-2xs"
          aria-label={`View cart (${itemCount} items)`}
        >
          <ShoppingCart className="w-4 h-4 text-[#102B35]" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#D97706] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* 2. Simulation Scenario Bar for Testing */}
      <SimulationScenarioBar
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
      />

      {/* 3. Main Verification Dashboard */}
      <VerificationDashboard
        summary={summary}
        isRetrying={isRetrying}
        onRetry={handleRetryVerification}
        onRequestStaff={handleRequestStaff}
      />

      {/* 4. Product Verification Item Cards */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-[#18252B] uppercase tracking-wider">
            Item Scale Cross-Check
          </h2>
          <span className="text-[11px] text-[#718096]">
            {items.length} {items.length === 1 ? "product" : "products"} in basket
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E5EBE8] p-8 text-center text-xs text-[#718096] space-y-3">
            <p>Your basket is currently empty. Add products to test verification.</p>
            <Link
              href="/explore"
              className="px-4 py-2 bg-[#17A890] text-white font-bold rounded-xl inline-block"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const res = results.find((r) => r.productId === item.product.id);
              return (
                <VerificationItemCard
                  key={item.product.id}
                  item={item}
                  verificationResult={res}
                  onOpenDiscrepancy={() => {
                    if (res?.discrepancy) {
                      handleOpenDiscrepancy(res.discrepancy);
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Verification Activity Timeline */}
      <VerificationHistoryTimeline events={eventHistory} />

      {/* 6. Checkout Navigation CTA */}
      <div className="p-4 bg-white rounded-3xl border border-[#E5EBE8] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#718096] block">Cart Total</span>
            <span className="text-lg font-black text-[#102B35]">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
              summary.overallStatus === "verified"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {summary.overallStatus === "verified"
              ? "Scale Cleared for Exit"
              : "Verification Exception"}
          </span>
        </div>

        <Link
          href="/cart"
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] ${
            summary.overallStatus === "verified"
              ? "bg-[#17A890] hover:bg-[#128673] text-white"
              : "bg-[#102B35] hover:bg-[#0B1D24] text-white"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Return to Cart Summary</span>
        </Link>
      </div>

      {/* Modals & Bottom Sheets */}
      <MismatchAlertSheet
        discrepancy={selectedDiscrepancy}
        isOpen={isAlertSheetOpen}
        onClose={() => setIsAlertSheetOpen(false)}
        onRetry={handleRetryVerification}
        onResolve={handleResolveDiscrepancy}
        onRequestStaff={handleRequestStaff}
      />

      <StaffAssistanceModal
        isOpen={isStaffModalOpen}
        activeRequest={activeAssistanceRequest}
        cartTag={session.cartTag}
        onClose={() => setIsStaffModalOpen(false)}
        onCancelRequest={handleCancelStaffRequest}
      />
    </div>
  );
}
