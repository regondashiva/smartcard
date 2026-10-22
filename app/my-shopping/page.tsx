"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFullOrders } from "@/lib/receipt-service";
import {
  getSpendingInsights,
  getFrequentlyPurchasedProducts,
  getPersonalizedRecommendations,
} from "@/lib/analytics-service";
import {
  DateRangeFilter,
  FrequentlyPurchasedProduct,
  ProductRecommendation,
  SpendingSummary,
} from "@/types/analytics";
import { DigitalReceipt } from "@/types/receipt";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { SpendingChart } from "@/components/analytics/spending-chart";
import { CategorySpendingCard } from "@/components/analytics/category-spending-card";
import { BuyAgainCarousel } from "@/components/analytics/buy-again-carousel";
import { RecommendedGrid } from "@/components/analytics/recommended-grid";
import {
  ArrowLeft,
  TrendingUp,
  Receipt,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Clock,
  PieChart,
  Tag,
  Store,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function MyShoppingDashboardPage() {
  const router = useRouter();
  const { items } = useCart();

  const [orders, setOrders] = useState<DigitalReceipt[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<DateRangeFilter>("30d");
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<SpendingSummary | null>(null);
  const [buyAgainProducts, setBuyAgainProducts] = useState<
    FrequentlyPurchasedProduct[]
  >([]);
  const [recommendations, setRecommendations] = useState<
    ProductRecommendation[]
  >([]);

  useEffect(() => {
    try {
      const allOrders = getFullOrders();
      setOrders(allOrders);

      const cartProductIds = items.map((i) => i.product.id);
      const buyAgain = getFrequentlyPurchasedProducts(allOrders);
      const recs = getPersonalizedRecommendations(allOrders, cartProductIds);

      setBuyAgainProducts(buyAgain);
      setRecommendations(recs);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [items]);

  useEffect(() => {
    if (orders.length >= 0) {
      const insights = getSpendingInsights(orders, selectedPeriod);
      setSummary(insights);
    }
  }, [orders, selectedPeriod]);

  if (loading || !summary) {
    return (
      <div className="max-w-md mx-auto min-h-screen p-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#17A890] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[#718096]">
          Loading shopping insights…
        </p>
      </div>
    );
  }

  const periodButtons: { id: DateRangeFilter; label: string }[] = [
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
    { id: "1y", label: "This Year" },
    { id: "all", label: "All Time" },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen p-4 pb-20 space-y-5">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-2 border-b border-[#E5EBE8] pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-black text-[#102B35] flex items-center gap-1.5">
              <span>My Shopping &amp; Insights</span>
              <TrendingUp className="w-4 h-4 text-[#17A890]" />
            </h1>
            <p className="text-[10px] text-[#718096]">
              Spending patterns, reorders &amp; recommendations
            </p>
          </div>
        </div>

        <Link
          href="/orders/history"
          className="text-xs font-bold text-[#17A890] hover:underline flex items-center gap-1"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>All Orders</span>
        </Link>
      </header>

      {/* Time-Period Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {periodButtons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setSelectedPeriod(btn.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-[11px] ${
              selectedPeriod === btn.id
                ? "bg-[#102B35] text-white shadow-xs"
                : "bg-white border border-[#E5EBE8] text-[#718096] hover:bg-[#F7F9F8]"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total Spent */}
        <div className="bg-white rounded-2xl border border-[#E5EBE8] p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] text-[#718096] font-semibold uppercase block">
            Total Spent ({summary.periodLabel})
          </span>
          <p className="text-xl font-black text-[#102B35]">
            {formatCurrency(summary.totalSpent)}
          </p>
          <p className="text-[9px] text-[#718096]">
            {summary.totalItemsBought} {summary.totalItemsBought === 1 ? "unit" : "units"} purchased
          </p>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-2xl border border-[#E5EBE8] p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] text-[#718096] font-semibold uppercase block">
            Completed Trips
          </span>
          <p className="text-xl font-black text-[#102B35]">
            {summary.completedOrdersCount}
          </p>
          <p className="text-[9px] text-emerald-700 font-bold">
            100% verified exit rate
          </p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white rounded-2xl border border-[#E5EBE8] p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] text-[#718096] font-semibold uppercase block">
            Avg Order Value
          </span>
          <p className="text-xl font-black text-[#102B35]">
            {formatCurrency(summary.averageOrderValue)}
          </p>
          <p className="text-[9px] text-[#718096]">Per supermarket trip</p>
        </div>

        {/* Total Savings */}
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] text-emerald-800 font-semibold uppercase block">
            Total Store Savings
          </span>
          <p className="text-xl font-black text-emerald-900">
            {formatCurrency(summary.totalSavings)}
          </p>
          <p className="text-[9px] text-emerald-700 font-bold">
            SmartClub offer discounts
          </p>
        </div>
      </div>

      {/* Top Category Callout Banner */}
      {summary.topCategory && (
        <div className="bg-gradient-to-r from-[#102B35] to-[#17A890] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">
              Most Frequently Purchased Category
            </span>
            <p className="text-sm font-bold">
              {summary.topCategory.categoryName}
            </p>
            <p className="text-[10px] text-white/80">
              {formatCurrency(summary.topCategory.amount)} spent (
              {summary.topCategory.percentage}% of total spend)
            </p>
          </div>
          <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
            {summary.topCategory.percentage}%
          </span>
        </div>
      )}

      {/* Spending Trend Chart Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#17A890]" />
            <span>Spending Over Time</span>
          </h3>
          <span className="text-[10px] text-[#718096]">
            {summary.periodLabel}
          </span>
        </div>

        <SpendingChart
          trends={summary.trends}
          totalSpent={summary.totalSpent}
        />
      </div>

      {/* Category Spending Breakdown */}
      <CategorySpendingCard
        categories={summary.categories}
        totalSpent={summary.totalSpent}
      />

      {/* Frequently Purchased / Buy Again Carousel */}
      <BuyAgainCarousel products={buyAgainProducts} />

      {/* Personalized Recommendations */}
      <RecommendedGrid recommendations={recommendations} />

      {/* Link to Full Orders History */}
      <div className="pt-2">
        <Link
          href="/orders/history"
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-white border border-[#E5EBE8] text-[#102B35] hover:bg-[#F7F9F8] flex items-center justify-between transition-all shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#17A890]" />
            <span>View Complete Purchase History &amp; Receipts</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </Link>
      </div>
    </div>
  );
}
