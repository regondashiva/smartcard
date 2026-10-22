"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getFullOrders } from "@/lib/receipt-service";
import { DigitalReceipt } from "@/types/receipt";
import { DateRangeFilter } from "@/types/analytics";
import { filterOrdersByDate } from "@/lib/analytics-service";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Receipt,
  QrCode,
  Search,
  Filter,
  Clock,
  Store,
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [allOrders, setAllOrders] = useState<DigitalReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "cancelled" | "pending"
  >("all");
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>("all");

  useEffect(() => {
    try {
      const orders = getFullOrders();
      setAllOrders(orders);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter orders
  const filteredOrders = allOrders.filter((order) => {
    // 1. Search filter
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) =>
        i.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    // 2. Status filter
    if (statusFilter === "completed") {
      if (order.orderStatus !== "ready_for_exit" && order.orderStatus !== "exited") {
        return false;
      }
    } else if (statusFilter === "cancelled") {
      if (order.orderStatus !== "cancelled") return false;
    } else if (statusFilter === "pending") {
      if (order.paymentStatus !== "pending") return false;
    }

    // 3. Date filter
    if (dateFilter !== "all") {
      const orderTime = new Date(order.purchaseDate).getTime();
      const now = Date.now();
      const days =
        dateFilter === "7d"
          ? 7
          : dateFilter === "30d"
          ? 30
          : dateFilter === "90d"
          ? 90
          : 365;
      if (orderTime < now - days * 24 * 60 * 60 * 1000) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-md mx-auto min-h-screen p-4 pb-20 space-y-4">
      {/* Header */}
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
            <h1 className="text-base font-black text-[#102B35]">
              Purchase History
            </h1>
            <p className="text-[10px] text-[#718096]">
              Detailed store invoices &amp; item records
            </p>
          </div>
        </div>

        <Link
          href="/my-shopping"
          className="text-xs font-bold text-[#17A890] hover:underline flex items-center gap-1"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Insights</span>
        </Link>
      </header>

      {/* Spending Insights CTA Card */}
      <div className="bg-gradient-to-r from-[#102B35] to-[#17A890] text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-bold">Shopping Analytics &amp; Reorders</p>
          <p className="text-[10px] text-white/80">
            View monthly category spend and 1-tap reordering
          </p>
        </div>
        <Link
          href="/my-shopping"
          className="bg-white text-[#102B35] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs hover:bg-slate-100 transition-colors shrink-0"
        >
          View Dashboard
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by product, order ID, or store…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-white border border-[#E5EBE8] rounded-xl pl-9 pr-3 py-2.5 text-[#102B35] placeholder:text-[#B0BEC5] focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-[11px] ${
            statusFilter === "all"
              ? "bg-[#102B35] text-white shadow-xs"
              : "bg-white border border-[#E5EBE8] text-[#718096] hover:bg-[#F7F9F8]"
          }`}
        >
          All ({allOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("completed")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-[11px] ${
            statusFilter === "completed"
              ? "bg-[#17A890] text-white shadow-xs"
              : "bg-white border border-[#E5EBE8] text-[#718096] hover:bg-[#F7F9F8]"
          }`}
        >
          Completed
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("pending")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-[11px] ${
            statusFilter === "pending"
              ? "bg-[#102B35] text-white shadow-xs"
              : "bg-white border border-[#E5EBE8] text-[#718096] hover:bg-[#F7F9F8]"
          }`}
        >
          Pending
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("cancelled")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-[11px] ${
            statusFilter === "cancelled"
              ? "bg-[#102B35] text-white shadow-xs"
              : "bg-white border border-[#E5EBE8] text-[#718096] hover:bg-[#F7F9F8]"
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Date Range Sub-Filter */}
      <div className="flex items-center justify-between text-[11px] bg-[#F7F9F8] p-2 rounded-xl border border-[#E5EBE8]">
        <span className="text-[#718096] font-medium flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#17A890]" />
          Date Filter:
        </span>
        <div className="flex items-center gap-1 font-bold">
          {(["all", "7d", "30d", "90d"] as DateRangeFilter[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDateFilter(r)}
              className={`px-2 py-0.5 rounded-md cursor-pointer transition ${
                dateFilter === r
                  ? "bg-[#102B35] text-white"
                  : "text-[#718096] hover:text-[#102B35]"
              }`}
            >
              {r === "all" ? "All" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3 py-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#E5EBE8] p-4 animate-pulse space-y-3"
            >
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
              <div className="h-10 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5EBE8] p-8 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-[#718096] flex items-center justify-center mx-auto">
            <Receipt className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-[#102B35]">
              No Purchases Found
            </h2>
            <p className="text-xs text-[#718096]">
              {searchQuery
                ? "No previous orders match your filter criteria."
                : "Your completed self-checkout purchases will appear here."}
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-block bg-[#17A890] hover:bg-[#128673] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const dateStr = new Date(order.purchaseDate).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            const isReady = order.orderStatus === "ready_for_exit";
            const isExited = order.orderStatus === "exited";

            return (
              <div
                key={order.orderId}
                className="bg-white rounded-2xl border border-[#E5EBE8] shadow-xs p-4 space-y-3 hover:border-[#17A890]/40 transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#102B35]">
                      {order.orderId}
                    </span>
                    {isReady ? (
                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Ready to Exit
                      </span>
                    ) : isExited ? (
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        Exited
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#718096] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dateStr}
                  </span>
                </div>

                {/* Product Thumbnails Preview */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div
                      key={item.productId || idx}
                      className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-[#E5EBE8] shrink-0"
                      title={`${item.quantity}× ${item.productName}`}
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 bg-[#102B35]/90 text-white text-[8px] font-bold px-1 rounded-tl">
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 rounded-xl bg-[#F7F9F8] border border-[#E5EBE8] flex items-center justify-center text-[10px] font-black text-[#718096] shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {/* Store and Amount Footer */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F0F4F2]">
                  <div>
                    <p className="text-[11px] font-bold text-[#102B35] flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-[#17A890]" />
                      <span className="truncate max-w-[180px]">
                        {order.storeName}
                      </span>
                    </p>
                    <p className="text-[10px] text-[#718096]">
                      {order.itemCount} items • {order.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#718096] block">Total</span>
                    <span className="text-sm font-black text-[#102B35]">
                      {formatCurrency(order.finalAmount)}
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0F4F2]">
                  <Link
                    href={`/receipts/${order.orderId}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#E5EBE8] text-xs font-bold text-[#102B35] hover:bg-[#F7F9F8] transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#17A890]" />
                    <span>Digital Receipt</span>
                  </Link>

                  <Link
                    href={`/orders/${order.orderId}/exit-pass`}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isReady
                        ? "bg-[#17A890] hover:bg-[#128673] text-white"
                        : "bg-[#102B35] hover:bg-[#0B1D24] text-white"
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{isReady ? "Show Exit QR" : "Exit Pass"}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
