"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllOrders } from "@/lib/receipt-service";
import { OrderHistoryItem } from "@/types/receipt";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Receipt,
  QrCode,
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  Store,
  Filter,
  TrendingUp,
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Load orders from client storage / service
    try {
      const items = getAllOrders();
      setOrders(items);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "ready") {
      return matchesSearch && order.orderStatus === "ready_for_exit";
    }
    if (statusFilter === "exited") {
      return matchesSearch && order.orderStatus === "exited";
    }
    return matchesSearch;
  });

  const readyForExitCount = orders.filter(
    (o) => o.orderStatus === "ready_for_exit"
  ).length;

  return (
    <div className="max-w-md mx-auto min-h-screen p-4 pb-20 space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pb-2 border-b border-[#E5EBE8] pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-black text-[#102B35]">
              Order History & Receipts
            </h1>
            <p className="text-[10px] text-[#718096]">
              Verified purchases & exit credentials
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/my-shopping"
            className="text-xs font-bold text-[#17A890] hover:underline flex items-center gap-1"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Insights</span>
          </Link>
          <Link
            href="/explore"
            className="w-8 h-8 rounded-xl bg-white border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#F7F9F8] transition-colors"
            title="Browse catalogue"
          >
            <ShoppingBag className="w-4 h-4 text-[#17A890]" />
          </Link>
        </div>
      </header>

      {/* Active Exit Pass Alert Banner (if any order is ready for exit) */}
      {readyForExitCount > 0 && (
        <div className="bg-gradient-to-r from-[#102B35] to-[#17A890] text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Exit Pass Active</p>
              <p className="text-[10px] text-white/80">
                {readyForExitCount} {readyForExitCount === 1 ? "order" : "orders"} cleared for store exit
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter("ready")}
            className="text-[11px] font-bold bg-white text-[#102B35] px-2.5 py-1.5 rounded-lg shadow-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            View Pass
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order ID or store…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-white border border-[#E5EBE8] rounded-xl pl-9 pr-3 py-2.5 text-[#102B35] placeholder:text-[#B0BEC5] focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition"
          />
        </div>

        {/* Filter Pills */}
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
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("ready")}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-[11px] flex items-center gap-1 ${
              statusFilter === "ready"
                ? "bg-[#17A890] text-white shadow-xs"
                : "bg-white border border-[#E5EBE8] text-[#718096] hover:bg-[#F7F9F8]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Ready for Exit ({orders.filter((o) => o.orderStatus === "ready_for_exit").length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("exited")}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-[11px] ${
              statusFilter === "exited"
                ? "bg-[#102B35] text-white shadow-xs"
                : "bg-white border border-[#E5EBE8] text-[#718096] hover:bg-[#F7F9F8]"
            }`}
          >
            Exited & Completed ({orders.filter((o) => o.orderStatus === "exited").length})
          </button>
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
              <div className="h-8 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5EBE8] p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-[#718096] flex items-center justify-center mx-auto">
            <Receipt className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-[#102B35]">No Orders Found</h2>
            <p className="text-xs text-[#718096]">
              {searchQuery
                ? "No purchases match your search criteria."
                : "Complete a shopping session to view digital receipts and exit passes."}
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-block bg-[#17A890] hover:bg-[#128673] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isReady = order.orderStatus === "ready_for_exit";
            const isExited = order.orderStatus === "exited";
            const dateStr = new Date(order.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

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
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#718096] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dateStr}
                  </span>
                </div>

                {/* Store & Items info */}
                <div className="flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-[#102B35] flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-[#17A890]" />
                      <span className="truncate max-w-[190px]">{order.storeName}</span>
                    </p>
                    <p className="text-[10px] text-[#718096]">
                      {order.itemCount} {order.itemCount === 1 ? "item" : "items"} • Exit Code:{" "}
                      <span className="font-mono font-bold text-[#102B35]">
                        {order.exitCode}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-[#718096]">Total Paid</p>
                    <p className="text-sm font-black text-[#102B35]">
                      {formatCurrency(order.finalAmount)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0F4F2]">
                  <Link
                    href={`/receipts/${order.orderId}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#E5EBE8] text-xs font-bold text-[#102B35] hover:bg-[#F7F9F8] transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#17A890]" />
                    <span>View Receipt</span>
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
