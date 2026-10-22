"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, issueExitCredential } from "@/lib/receipt-service";
import { DigitalReceipt, ExitCredential, ExitPassStatus } from "@/types/receipt";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Receipt,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Store,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function ExitPassPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<DigitalReceipt | null>(null);
  const [credential, setCredential] = useState<ExitCredential | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [status, setStatus] = useState<ExitPassStatus>("ready");

  const loadData = () => {
    if (!params?.orderId) return;
    try {
      const data = getOrderById(params.orderId);
      if (data) {
        setOrder(data);
        if (!data.exitCredential) {
          const cred = issueExitCredential(params.orderId);
          setCredential(cred);
          setStatus(cred?.status || "ready");
        } else {
          setCredential(data.exitCredential);
          setStatus(data.exitStatus || data.exitCredential.status);
        }
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params?.orderId]);

  // Expiry countdown timer
  useEffect(() => {
    if (!credential?.expiresAt) return;

    const updateTimer = () => {
      const diff = Math.floor(
        (new Date(credential.expiresAt).getTime() - Date.now()) / 1000
      );
      if (diff <= 0) {
        setRemainingSeconds(0);
        if (status === "ready") {
          setStatus("expired");
        }
      } else {
        setRemainingSeconds(diff);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [credential?.expiresAt, status]);

  const handleRefreshCredential = async () => {
    if (!params?.orderId) return;
    setRefreshing(true);
    try {
      const cred = issueExitCredential(params.orderId);
      if (cred) {
        setCredential(cred);
        setStatus(cred.status);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen p-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#17A890] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[#718096]">Loading exit pass…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto min-h-screen p-4 flex flex-col justify-center items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-black text-[#102B35]">Exit Pass Unavailable</h1>
          <p className="text-xs text-[#718096]">
            Order {params?.orderId} does not exist or has no active exit pass.
          </p>
        </div>
        <Link
          href="/orders"
          className="bg-[#102B35] text-white text-xs font-bold py-3 px-5 rounded-xl"
        >
          View Order History
        </Link>
      </div>
    );
  }

  // QR Payload for camera scan by the exit gate kiosk
  const qrPayload = JSON.stringify({
    type: "SMARTCART_EXIT_CREDENTIAL_V1",
    token: credential?.token || "",
    orderId: order.orderId,
    exitCode: order.exitCode,
    storeId: order.storeId,
    issuedAt: credential?.issuedAt || order.purchaseDate,
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
            <h1 className="text-base font-black text-[#102B35] flex items-center gap-1.5">
              <span>Exit Validation Pass</span>
              <ShieldCheck className="w-4 h-4 text-[#17A890]" />
            </h1>
            <p className="text-[10px] text-[#718096] flex items-center gap-1">
              <Store className="w-3 h-3 text-[#17A890]" />
              <span className="truncate max-w-[200px]">{order.storeName}</span>
            </p>
          </div>
        </div>

        <Link
          href={`/receipts/${order.orderId}`}
          className="text-xs font-bold text-[#17A890] hover:underline flex items-center gap-1"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Receipt</span>
        </Link>
      </header>

      {/* Main Exit Pass Card */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-sm space-y-4">
        {/* Status Badge & Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#718096] block">
              ORDER {order.orderId}
            </span>
            <span className="text-xs font-black text-[#102B35]">
              {order.itemCount} {order.itemCount === 1 ? "Item" : "Items"} •{" "}
              {formatCurrency(order.finalAmount)}
            </span>
          </div>

          {/* Dynamic Status Badge */}
          {status === "ready" && (
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Ready to Exit
            </span>
          )}
          {status === "completed" && (
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Exit Cleared
            </span>
          )}
          {status === "expired" && (
            <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              Pass Expired
            </span>
          )}
          {status === "revoked" && (
            <span className="text-[10px] font-bold bg-red-100 text-red-900 border border-red-300 px-2.5 py-1 rounded-full">
              Revoked
            </span>
          )}
          {status === "payment_pending" && (
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
              Payment Pending
            </span>
          )}
        </div>

        {/* ─── High-Contrast QR Code Visual ─────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <div className="relative p-4 bg-white rounded-3xl border-2 border-[#102B35] shadow-lg flex items-center justify-center">
            {/* Scannable SVG QR pattern */}
            <div
              className={`w-52 h-52 transition-all ${
                status === "completed" || status === "expired" || status === "revoked"
                  ? "opacity-25 grayscale"
                  : "opacity-100"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Crect width='180' height='180' fill='white'/%3E%3Crect x='0' y='0' width='50' height='50' fill='%23102B35'/%3E%3Crect x='6' y='6' width='38' height='38' fill='white'/%3E%3Crect x='12' y='12' width='26' height='26' fill='%23102B35'/%3E%3Crect x='130' y='0' width='50' height='50' fill='%23102B35'/%3E%3Crect x='136' y='6' width='38' height='38' fill='white'/%3E%3Crect x='142' y='12' width='26' height='26' fill='%23102B35'/%3E%3Crect x='0' y='130' width='50' height='50' fill='%23102B35'/%3E%3Crect x='6' y='136' width='38' height='38' fill='white'/%3E%3Crect x='12' y='142' width='26' height='26' fill='%23102B35'/%3E%3Crect x='60' y='6' width='12' height='12' fill='%23102B35'/%3E%3Crect x='80' y='6' width='12' height='12' fill='%23102B35'/%3E%3Crect x='100' y='6' width='12' height='12' fill='%23102B35'/%3E%3Crect x='60' y='26' width='20' height='12' fill='%23102B35'/%3E%3Crect x='90' y='26' width='24' height='12' fill='%23102B35'/%3E%3Crect x='6' y='60' width='12' height='12' fill='%23102B35'/%3E%3Crect x='26' y='60' width='12' height='12' fill='%23102B35'/%3E%3Crect x='60' y='60' width='24' height='12' fill='%23102B35'/%3E%3Crect x='96' y='60' width='12' height='12' fill='%23102B35'/%3E%3Crect x='120' y='60' width='20' height='12' fill='%23102B35'/%3E%3Crect x='150' y='60' width='24' height='12' fill='%23102B35'/%3E%3Crect x='6' y='80' width='24' height='12' fill='%23102B35'/%3E%3Crect x='60' y='80' width='12' height='12' fill='%23102B35'/%3E%3Crect x='84' y='80' width='24' height='12' fill='%23102B35'/%3E%3Crect x='120' y='80' width='12' height='12' fill='%23102B35'/%3E%3Crect x='144' y='80' width='20' height='12' fill='%23102B35'/%3E%3Crect x='6' y='100' width='12' height='12' fill='%23102B35'/%3E%3Crect x='28' y='100' width='16' height='12' fill='%23102B35'/%3E%3Crect x='60' y='100' width='16' height='12' fill='%23102B35'/%3E%3Crect x='88' y='100' width='20' height='12' fill='%23102B35'/%3E%3Crect x='120' y='100' width='24' height='12' fill='%23102B35'/%3E%3Crect x='156' y='100' width='14' height='12' fill='%23102B35'/%3E%3Crect x='60' y='130' width='24' height='12' fill='%23102B35'/%3E%3Crect x='96' y='130' width='12' height='12' fill='%23102B35'/%3E%3Crect x='120' y='130' width='20' height='12' fill='%23102B35'/%3E%3Crect x='150' y='130' width='24' height='12' fill='%23102B35'/%3E%3Crect x='60' y='154' width='12' height='12' fill='%23102B35'/%3E%3Crect x='84' y='154' width='24' height='12' fill='%23102B35'/%3E%3Crect x='120' y='154' width='12' height='12' fill='%23102B35'/%3E%3Crect x='144' y='154' width='20' height='12' fill='%23102B35'/%3E%3C/svg%3E")`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              aria-label="Exit Gate QR Code"
            />

            {/* Completed Overlay */}
            {status === "completed" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-3xl p-4 text-center space-y-2 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-sm font-black text-[#102B35]">Exit Gate Cleared</p>
                <p className="text-[10px] text-[#718096]">
                  Thank you for shopping with SmartCart AI!
                </p>
              </div>
            )}

            {/* Expired Overlay */}
            {status === "expired" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 rounded-3xl p-4 text-center space-y-2 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-xs font-black text-red-700">Pass Expired</p>
                <p className="text-[10px] text-[#718096]">
                  Passes expire after 30 minutes for security
                </p>
                <button
                  type="button"
                  onClick={handleRefreshCredential}
                  disabled={refreshing}
                  className="bg-[#17A890] hover:bg-[#128673] text-white text-[11px] font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  <span>Refresh Pass</span>
                </button>
              </div>
            )}
          </div>

          {/* Gate Code Badge */}
          <div className="w-full bg-[#102B35] text-white rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider">
              Manual Gate Keypad Code
            </span>
            <p className="text-3xl font-black font-mono tracking-[0.3em] text-[#17A890]">
              {order.exitCode}
            </p>
            <p className="text-[10px] text-white/60">
              Type on keypad if overhead camera cannot read QR
            </p>
          </div>
        </div>

        {/* Expiry Countdown & Instructions */}
        {status === "ready" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs bg-[#F7F9F8] p-3 rounded-2xl border border-[#E5EBE8]">
              <span className="text-[#718096] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#17A890]" />
                Valid for:
              </span>
              <span className="font-mono font-bold text-[#102B35]">
                {formatCountdown(remainingSeconds)}
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs space-y-1 text-emerald-900">
              <p className="font-bold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Exit Gate Instructions:
              </p>
              <ul className="text-[10px] text-emerald-800 space-y-1 list-disc pl-4">
                <li>Walk towards the automated exit turnstile.</li>
                <li>Hold this QR screen facing the overhead scanner lens.</li>
                <li>Wait for the green light and audio chime to exit.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Security Credential Token Notice */}
        <div className="text-center pt-1 border-t border-[#F0F4F2]">
          <p className="text-[9px] font-mono text-[#B0BEC5] truncate">
            TOKEN: {credential?.token || "EX-SEC-VERIFIED"}
          </p>
        </div>
      </div>

      {/* Staff / Kiosk Demo Simulator Button */}
      <div className="bg-slate-50 border border-[#E5EBE8] rounded-2xl p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#102B35]">Store Exit Kiosk</p>
          <p className="text-[10px] text-[#718096]">
            Test gate validation scanner as store staff or kiosk
          </p>
        </div>
        <Link
          href={`/exit-scanner?code=${order.exitCode}`}
          className="bg-[#102B35] hover:bg-[#0B1D24] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-xs transition-colors"
        >
          <span>Open Scanner</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Action Links */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href={`/receipts/${order.orderId}`}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-white border border-[#E5EBE8] text-[#102B35] hover:bg-[#F7F9F8] flex items-center justify-center gap-1.5 transition-all text-center"
        >
          <Receipt className="w-3.5 h-3.5 text-[#17A890]" />
          <span>Full Tax Receipt</span>
        </Link>
        <Link
          href="/orders"
          className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-white border border-[#E5EBE8] text-[#102B35] hover:bg-[#F7F9F8] flex items-center justify-center gap-1.5 transition-all text-center"
        >
          <span>All Orders</span>
        </Link>
      </div>
    </div>
  );
}
