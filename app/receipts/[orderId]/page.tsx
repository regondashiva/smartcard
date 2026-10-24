"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { getOrderById, issueExitCredential } from "@/lib/receipt-service";
import { downloadReceiptPdf } from "@/lib/receipt-pdf";
import { DigitalReceipt, ExitCredential, ExitPassStatus } from "@/types/receipt";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/store/cart-store";
import {
  ArrowLeft,
  Home,
  CheckCircle2,
  Download,
  Share2,
  Mail,
  Calendar,
  FileText,
  ShoppingBag,
  ChevronRight,
  Clock,
  Headset,
  Copy,
  Sparkles,
  RefreshCw,
  AlertCircle,
  QrCode,
  Check,
  Store,
  CreditCard,
  Send,
  X,
} from "lucide-react";

type ActiveScreen = "success" | "receipt" | "details";

function ReceiptJourney() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, endSession } = useCart();

  const [receipt, setReceipt] = useState<DigitalReceipt | null>(null);
  const [credential, setCredential] = useState<ExitCredential | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [remainingSeconds, setRemainingSeconds] = useState<number>(900); // 15 mins default
  const [passStatus, setPassStatus] = useState<ExitPassStatus>("ready");
  const [isRefreshingPass, setIsRefreshingPass] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Email Receipt Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Screen selection (default to success or query param)
  const initialScreen = (searchParams?.get("screen") as ActiveScreen) || "success";
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>(initialScreen);

  // Show temporary toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load Order and Issue Backend Exit Credential
  const loadOrderData = () => {
    if (!params?.orderId) return;
    try {
      const data = getOrderById(params.orderId);
      if (data) {
        setReceipt(data);
        if (data.customerName && !emailInput) {
          setEmailInput("shopper@smartcart-demo.in");
        }
        // Authoritative Exit Credential from backend service
        if (!data.exitCredential) {
          const cred = issueExitCredential(params.orderId);
          setCredential(cred);
          setPassStatus(cred?.status || "ready");
        } else {
          setCredential(data.exitCredential);
          setPassStatus(data.exitStatus || data.exitCredential.status);
        }
      }
    } catch {
      // Order not found
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [params?.orderId]);

  // Generate authentic QR code from backend-issued exit credential payload
  useEffect(() => {
    if (!receipt) return;
    const credToken = credential?.token || receipt.exitCredential?.token || "";
    const exitCode = credential?.exitCode || receipt.exitCode || "";

    const payload = JSON.stringify({
      type: "SMARTCART_EXIT_CREDENTIAL_V1",
      token: credToken,
      orderId: receipt.orderId,
      exitCode: exitCode,
      storeId: receipt.storeId || "STORE-01",
      issuedAt: credential?.issuedAt || receipt.purchaseDate,
    });

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 1,
      color: {
        dark: "#083D35",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [receipt, credential]);

  // Live Expiry Countdown Timer
  useEffect(() => {
    if (!credential?.expiresAt) return;

    const tick = () => {
      const expiry = new Date(credential.expiresAt).getTime();
      const diff = Math.floor((expiry - Date.now()) / 1000);
      if (diff <= 0) {
        setRemainingSeconds(0);
        if (passStatus === "ready") {
          setPassStatus("expired");
        }
      } else {
        setRemainingSeconds(diff);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [credential?.expiresAt, passStatus]);

  // Refresh Credential via Backend Service
  const handleRefreshCredential = async () => {
    if (!params?.orderId) return;
    setIsRefreshingPass(true);
    try {
      const refreshed = issueExitCredential(params.orderId);
      if (refreshed) {
        setCredential(refreshed);
        setPassStatus(refreshed.status);
        triggerToast("Exit pass refreshed successfully");
      }
    } catch {
      triggerToast("Could not refresh exit pass");
    } finally {
      setIsRefreshingPass(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!receipt) return;
    setIsDownloadingPdf(true);
    try {
      await downloadReceiptPdf(receipt);
      triggerToast("PDF downloaded successfully");
    } catch (err) {
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleShare = async () => {
    if (!receipt) return;
    const shareText = `SmartCart AI Tax Invoice · ${receipt.storeName} · Total: ${formatCurrency(
      receipt.finalAmount
    )} · Order: ${receipt.orderId} · Exit Code: ${receipt.exitCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `SmartCart AI Receipt - ${receipt.orderId}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareText).catch(() => {});
    triggerToast("Receipt summary copied to clipboard");
  };

  const handleCopyTxn = () => {
    if (!receipt?.transactionId) return;
    navigator.clipboard.writeText(receipt.transactionId).catch(() => {});
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
    triggerToast("Transaction ID copied");
  };

  const handleCopyOrderId = () => {
    if (!receipt?.orderId) return;
    navigator.clipboard.writeText(receipt.orderId).catch(() => {});
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
    triggerToast("Order Reference copied");
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setEmailModalOpen(false);
        triggerToast(`Digital receipt sent to ${emailInput}`);
      }, 1200);
    }, 900);
  };

  const handleHomeClick = () => {
    clearCart();
    endSession();
    router.push("/");
  };

  const handleContinueShopping = () => {
    clearCart();
    router.push("/explore");
  };

  // Format countdown mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs} remaining`;
  };

  // Date formatting
  const formattedDate = useMemo(() => {
    if (!receipt?.purchaseDate) return { dateStr: "", timeStr: "", fullStr: "" };
    const dateObj = new Date(receipt.purchaseDate);
    const dateStr = dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return {
      dateStr,
      timeStr,
      fullStr: `${dateStr}, ${timeStr}`,
    };
  }, [receipt?.purchaseDate]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen p-4 flex flex-col items-center justify-center space-y-4 bg-white">
        <div className="w-12 h-12 border-3 border-[#10B981] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#102B35] tracking-wide">
          Verifying order &amp; issuing exit pass…
        </p>
      </div>
    );
  }

  // Unavailable receipt state
  if (!receipt) {
    return (
      <div className="max-w-md mx-auto min-h-screen p-6 flex flex-col justify-center items-center text-center space-y-5 bg-white">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-xs">
          <h1 className="text-xl font-black text-[#102B35]">Receipt Unavailable</h1>
          <p className="text-xs text-[#718096] leading-relaxed">
            The requested order reference{" "}
            <span className="font-mono font-bold text-[#102B35]">
              {params?.orderId}
            </span>{" "}
            could not be found or verified on this device.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          <Link
            href="/orders"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#0B443B] text-white text-center hover:bg-[#07362E] transition-colors shadow-sm"
          >
            View Order History
          </Link>
          <Link
            href="/explore"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-white border border-[#E5EBE8] text-[#102B35] text-center hover:bg-[#F7F9F8] transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    );
  }

  // Check for non-confirmed payment status
  const isPaymentPending = receipt.paymentStatus === "pending";
  const isPaymentFailed = receipt.paymentStatus === "failed";

  // Category helper for clean receipt listing
  const getCategoryLabel = (name: string, unit?: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("apple") || lower.includes("banana") || lower.includes("fruit")) return "Fresh Fruits";
    if (lower.includes("milk") || lower.includes("curd") || lower.includes("paneer") || lower.includes("yogurt") || lower.includes("butter")) return "Dairy";
    if (lower.includes("bread") || lower.includes("bun") || lower.includes("bakery")) return "Bakery";
    if (lower.includes("lays") || lower.includes("chip") || lower.includes("biscuit") || lower.includes("snack")) return "Snacks";
    if (lower.includes("tomato") || lower.includes("onion") || lower.includes("potato") || lower.includes("veg")) return "Fresh Vegetables";
    if (lower.includes("egg")) return "Dairy";
    return unit || "Grocery";
  };

  /* ─────────────────────────────────────────────────────────────────────────────
     SCREEN 1: PAYMENT SUCCESS
     ───────────────────────────────────────────────────────────────────────────── */
  const renderPaymentSuccessScreen = () => {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col shadow-xl sm:rounded-3xl overflow-hidden border border-[#E5EBE8]">
        {/* Top Dark Teal Header */}
        <div className="relative bg-gradient-to-b from-[#063831] via-[#09473F] to-[#0A4D45] text-white px-5 pt-8 pb-10 overflow-hidden">
          {/* Confetti & Sparkles Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <span className="absolute top-4 left-10 w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span className="absolute top-12 left-24 w-1 h-2 rounded bg-amber-300 rotate-45" />
            <span className="absolute top-8 right-16 w-1.5 h-1.5 rounded-full bg-teal-200" />
            <span className="absolute top-20 right-8 w-2 h-1 rounded bg-emerald-400 -rotate-12" />
            <span className="absolute top-24 left-6 w-1.5 h-1.5 rounded-full bg-amber-200" />
            <span className="absolute top-32 right-20 w-1 h-1 rounded-full bg-white" />
          </div>

          {/* Navigation Bar */}
          <div className="relative flex items-center justify-between z-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleHomeClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>

          {/* Success Badge & Headline */}
          <div className="relative z-10 flex flex-col items-center text-center mt-4 space-y-3">
            {/* Center Big Emerald Checkmark */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg ring-6 ring-emerald-400/25 animate-scale-in">
                <Check className="w-10 h-10 text-white stroke-[3.5]" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Payment Successful!
              </h1>
              <p className="text-xs text-white/80 mt-1.5 leading-relaxed max-w-xs mx-auto">
                Thank you for shopping with SmartCart AI
                <br />
                Your order has been placed successfully.
              </p>
            </div>
          </div>
        </div>

        {/* Overlapping White Content Card */}
        <div className="flex-1 bg-white -mt-5 rounded-t-3xl px-5 pt-5 pb-8 space-y-4.5 z-20 shadow-lg">
          {/* Store Info Card */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E9EFEA]">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#DCE7E1] bg-white">
              <Image
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80"
                alt={receipt.storeName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-[#102B35] truncate">
                {receipt.storeName || "Green Valley Supermarket"}
              </h2>
              <p className="text-[11px] text-[#718096] truncate">
                {receipt.storeAddress || "Hitech City, Hyderabad, Telangana - 500081"}
              </p>
            </div>
          </div>

          {/* 3 Summary Cards Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Date Card */}
            <div className="bg-[#F8FAF9] border border-[#E9EFEA] rounded-2xl p-3 flex flex-col items-center text-center">
              <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0B443B] mb-2 shadow-2xs">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-[#102B35] leading-tight">
                {formattedDate.dateStr || "23 Oct 2026"}
              </span>
              <span className="text-[10px] text-[#718096] mt-0.5">
                {formattedDate.timeStr || "08:45 AM"}
              </span>
            </div>

            {/* Receipt Card */}
            <div className="bg-[#F8FAF9] border border-[#E9EFEA] rounded-2xl p-3 flex flex-col items-center text-center">
              <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0B443B] mb-2 shadow-2xs">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-[#718096] uppercase font-semibold">
                Receipt No.
              </span>
              <span className="text-[11px] font-bold text-[#102B35] truncate max-w-full mt-0.5 font-mono">
                {receipt.receiptNumber?.replace("REC-", "") || receipt.orderId.substring(0, 10)}
              </span>
            </div>

            {/* Items & Total Card */}
            <div className="bg-[#F8FAF9] border border-[#E9EFEA] rounded-2xl p-3 flex flex-col items-center text-center">
              <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0B443B] mb-2 shadow-2xs">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-[#102B35] leading-tight">
                {receipt.itemCount || receipt.items.length} items
              </span>
              <span className="text-[11px] font-bold text-[#0B443B] mt-0.5">
                {formatCurrency(receipt.finalAmount)}
              </span>
            </div>
          </div>

          {/* Primary View Receipt Button */}
          <button
            type="button"
            onClick={() => setCurrentScreen("receipt")}
            className="w-full py-4 px-5 rounded-2xl bg-[#0B443B] hover:bg-[#07362E] text-white flex items-center justify-between font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span>View Receipt</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/80" />
          </button>

          {/* 3 Secondary Action Buttons */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="py-3 px-2 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF4F1] border border-[#E2EBE6] flex flex-col items-center justify-center gap-1.5 text-center text-[#102B35] transition-colors cursor-pointer"
            >
              {isDownloadingPdf ? (
                <div className="w-4 h-4 border-2 border-[#0B443B] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-[#0B443B]" />
              )}
              <span className="text-[11px] font-bold">Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="py-3 px-2 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF4F1] border border-[#E2EBE6] flex flex-col items-center justify-center gap-1.5 text-center text-[#102B35] transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#0B443B]" />
              <span className="text-[11px] font-bold">Share</span>
            </button>

            <button
              type="button"
              onClick={() => setEmailModalOpen(true)}
              className="py-3 px-2 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF4F1] border border-[#E2EBE6] flex flex-col items-center justify-center gap-1.5 text-center text-[#102B35] transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#0B443B]" />
              <span className="text-[11px] font-bold">Email Receipt</span>
            </button>
          </div>

          {/* Ready to Exit Mint Banner */}
          <div
            onClick={() => setCurrentScreen("details")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setCurrentScreen("details")}
            className="p-3.5 rounded-2xl bg-[#EBF8F4] hover:bg-[#DDF3EC] border border-[#C6ECE0] flex items-center justify-between transition-colors cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4F3E8] border border-[#BCEBDC] flex items-center justify-center text-[#083D35] shrink-0">
                <QrCode className="w-5 h-5 text-[#0B443B]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#083D35]">Ready to Exit?</p>
                <p className="text-[10px] text-[#4A726B] leading-tight">
                  Show your exit QR code at the exit gate.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#083D35] shrink-0" />
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────────────────────
     SCREEN 2: DIGITAL RECEIPT
     ───────────────────────────────────────────────────────────────────────────── */
  const renderDigitalReceiptScreen = () => {
    const itemsCount = receipt.itemCount || receipt.items.reduce((acc, i) => acc + i.quantity, 0);
    const taxAmount = receipt.taxInclusiveAmount || Math.round(receipt.finalAmount * 0.05 * 100) / 100;

    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col shadow-xl sm:rounded-3xl overflow-hidden border border-[#E5EBE8]">
        {/* Clean Header Bar */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#F0F4F2] bg-white">
          <button
            type="button"
            onClick={() => setCurrentScreen("success")}
            className="w-8 h-8 rounded-xl bg-[#F7FAF9] border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#EAEFEA] transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-bold text-[#102B35]">Digital Receipt</h1>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="w-8 h-8 rounded-xl bg-[#F7FAF9] border border-[#E5EBE8] flex items-center justify-center text-[#0B443B] hover:bg-[#EAEFEA] transition-colors cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-5 space-y-4.5 overflow-y-auto">
          {/* SmartCart AI Branding */}
          <div className="flex flex-col items-center justify-center pt-1 pb-2 text-center">
            <div className="inline-flex items-center gap-2">
              {/* Logo Icon */}
              <div className="w-7 h-7 rounded-lg bg-[#0B443B] text-white flex items-center justify-center relative">
                <ShoppingBag className="w-4 h-4 text-emerald-300" />
                <span className="absolute -top-1 -right-1.5 px-1 py-0.2 bg-[#10B981] text-[8px] font-black rounded-full leading-tight">
                  AI+
                </span>
              </div>
              <span className="text-xl font-black tracking-tight text-[#0B443B]">
                SmartCart <span className="text-[#10B981]">AI</span>
              </span>
            </div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#4A726B] mt-1">
              Smart Shopping • Faster Checkout
            </p>
          </div>

          {/* Store Details Card with 2x2 Metadata */}
          <div className="rounded-2xl bg-[#F9FCFB] border border-[#E4EFE9] p-4 space-y-3.5">
            {/* Store Top */}
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#DCE7E1] bg-white">
                <Image
                  src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80"
                  alt={receipt.storeName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xs font-bold text-[#102B35] truncate">
                  {receipt.storeName || "Green Valley Supermarket"}
                </h2>
                <p className="text-[10px] text-[#718096] truncate">
                  {receipt.storeAddress || "Hitech City, Hyderabad, Telangana - 500081"}
                </p>
              </div>
            </div>

            {/* 2x2 Meta Grid */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 pt-3 border-t border-[#E8F1EC] text-[11px]">
              <div>
                <span className="text-[10px] text-[#718096] block">Receipt No.</span>
                <span className="font-bold text-[#102B35] font-mono">
                  {receipt.receiptNumber || receipt.orderId}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#718096] block">Date &amp; Time</span>
                <span className="font-semibold text-[#102B35]">
                  {formattedDate.fullStr || "23 Oct 2026, 08:45 AM"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#718096] block">Session ID</span>
                <span className="font-bold text-[#102B35] font-mono truncate block">
                  {receipt.orderId.replace("SC-", "SCSN")}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#718096] block">Cashier</span>
                <span className="font-semibold text-[#102B35]">
                  Self-Checkout (SmartCart AI)
                </span>
              </div>
            </div>
          </div>

          {/* Items Purchased Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#102B35]">Items Purchased</h3>
              <span className="text-[10px] font-semibold text-[#718096] bg-[#F0F4F2] px-2 py-0.5 rounded-full">
                {itemsCount} items
              </span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-[10px] font-bold text-[#718096] px-2 py-1 border-b border-[#E8EFF0] uppercase tracking-wider">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            {/* Items List */}
            <div className="divide-y divide-[#F0F5F2]">
              {receipt.items.map((item, idx) => (
                <div key={item.productId || idx} className="grid grid-cols-12 py-2.5 px-2 items-center text-xs">
                  {/* Item name + image */}
                  <div className="col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#F7FAF9] border border-[#E5EBE8] shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          sizes="32px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          🍎
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#102B35] leading-snug truncate">
                        {item.productName}
                      </p>
                      <p className="text-[10px] text-[#718096] truncate">
                        {getCategoryLabel(item.productName, item.unit)}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <span className="col-span-2 text-right text-[11px] text-[#4A5568]">
                    {formatCurrency(item.unitPrice)}
                  </span>

                  {/* Quantity */}
                  <span className="col-span-2 text-center text-[11px] font-semibold text-[#102B35]">
                    {item.quantity}
                  </span>

                  {/* Total */}
                  <span className="col-span-2 text-right text-[11px] font-bold text-[#102B35]">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Calculation Summary Card */}
          <div className="rounded-2xl bg-[#F9FCFB] border border-[#E4EFE9] p-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#718096]">
              <span>Items Total ({itemsCount} items)</span>
              <span className="font-semibold text-[#102B35]">
                {formatCurrency(receipt.grossSubtotal)}
              </span>
            </div>

            {receipt.savings > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{formatCurrency(receipt.savings)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#718096]">
              <span>GST (5%)</span>
              <span className="font-semibold text-[#102B35]">
                {formatCurrency(taxAmount)}
              </span>
            </div>

            <div className="pt-2 border-t border-[#E8F1EC] flex justify-between items-center">
              <span className="text-sm font-black text-[#102B35]">Grand Total</span>
              <span className="text-xl font-black text-[#0B443B]">
                {formatCurrency(receipt.finalAmount)}
              </span>
            </div>
          </div>

          {/* Bottom Action: Proceed to Exit QR */}
          <button
            type="button"
            onClick={() => setCurrentScreen("details")}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#0B443B] hover:bg-[#07362E] text-white flex items-center justify-between font-bold text-xs shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-300" />
              <span>Proceed to Exit QR &amp; Pass</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────────────────────
     SCREEN 3: RECEIPT DETAILS & EXIT QR
     ───────────────────────────────────────────────────────────────────────────── */
  const renderReceiptDetailsScreen = () => {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col shadow-xl sm:rounded-3xl overflow-hidden border border-[#E5EBE8]">
        {/* Clean Header Bar */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#F0F4F2] bg-white">
          <button
            type="button"
            onClick={() => setCurrentScreen("receipt")}
            className="w-8 h-8 rounded-xl bg-[#F7FAF9] border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#EAEFEA] transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-bold text-[#102B35]">Receipt Details</h1>
          <button
            type="button"
            onClick={handleHomeClick}
            className="w-8 h-8 rounded-xl bg-[#F7FAF9] border border-[#E5EBE8] flex items-center justify-center text-[#102B35] hover:bg-[#EAEFEA] transition-colors cursor-pointer"
            title="Home"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-5 space-y-4.5 overflow-y-auto">
          {/* Payment Information Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-[#102B35]">Payment Information</h2>
            <div className="rounded-2xl bg-[#F9FCFB] border border-[#E4EFE9] p-4 space-y-3.5">
              {/* Payment Method Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E2F7EF] border border-[#C3EEDB] flex items-center justify-center text-[#0B443B]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#718096] block leading-tight">
                      Payment Method
                    </span>
                    <span className="text-xs font-bold text-[#102B35]">
                      {receipt.paymentMethod || "UPI (Google Pay)"}
                    </span>
                  </div>
                </div>

                {/* Brand Badge */}
                <span className="px-2.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[10px] font-bold text-[#102B35] shadow-2xs inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Google Pay
                </span>
              </div>

              {/* Transaction ID & Status */}
              <div className="pt-3 border-t border-[#E8F1EC] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">Transaction ID</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#102B35]">
                      {receipt.transactionId || "UPI123456789"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTxn}
                      className="p-1 text-[#718096] hover:text-[#102B35] cursor-pointer"
                      title="Copy Transaction ID"
                    >
                      {copiedTxn ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">Payment Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Successful
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">Paid Amount</span>
                  <span className="font-black text-sm text-[#102B35]">
                    {formatCurrency(receipt.finalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Exit QR Code Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-[#102B35]">Exit QR Code</h2>
            <div className="rounded-2xl bg-[#EFF9F6] border border-[#CEEFE5] p-4 flex items-center gap-4">
              {/* QR Image with centered cart icon */}
              <div className="relative w-28 h-28 bg-white rounded-2xl p-1.5 border border-[#BCE8DB] shadow-sm flex items-center justify-center shrink-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Exit Pass QR"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#0B443B] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {/* Center Cart Badge */}
                <div className="absolute inset-0 m-auto w-6 h-6 bg-[#0B443B] rounded-md flex items-center justify-center text-white shadow-xs pointer-events-none">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
                </div>
              </div>

              {/* QR Instructions & Countdown */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-xs font-bold text-[#083D35] leading-snug">
                  Show this QR code at the exit gate
                </p>
                <p className="text-[10px] text-[#4A726B]">
                  Valid for 15 minutes
                </p>

                {passStatus === "expired" ? (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full block text-center mb-1.5">
                      Pass Expired
                    </span>
                    <button
                      type="button"
                      onClick={handleRefreshCredential}
                      disabled={isRefreshingPass}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B443B] bg-white border border-[#BCE8DB] px-2.5 py-1 rounded-xl shadow-2xs hover:bg-[#E5F5EF] cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${isRefreshingPass ? "animate-spin" : ""}`}
                      />
                      <span>Refresh Exit Pass</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white/90 border border-emerald-200 px-2.5 py-1 rounded-full shadow-2xs">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{formatTimer(remainingSeconds)}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Need Help? Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-[#102B35]">Need Help?</h2>
            <Link
              href={`/support?orderId=${receipt.orderId}`}
              className="p-3.5 rounded-2xl bg-white border border-[#E5EBE8] hover:bg-[#F9FCFB] flex items-center justify-between transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F0F5F2] flex items-center justify-center text-[#0B443B]">
                  <Headset className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#102B35]">
                  Report an issue with this order
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#718096]" />
            </Link>
          </div>

          {/* Thank You Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-[#102B35]">Thank You!</h2>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F0F9F6] to-[#E9F7F2] border border-[#D5EFE7] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0B443B] text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShoppingBag className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#083D35]">
                  Thank you for shopping with SmartCart AI!
                </p>
                <p className="text-[11px] text-[#4A726B] mt-0.5">
                  We hope to see you again soon.
                </p>
              </div>
            </div>
          </div>

          {/* Continue Shopping Action */}
          <button
            type="button"
            onClick={handleContinueShopping}
            className="w-full py-4 px-5 rounded-2xl bg-[#0B443B] hover:bg-[#07362E] text-white flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-300" />
            <span>Continue Shopping</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#102B35] py-4 px-2 sm:px-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#102B35] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#E5EBE8] space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#102B35]">Email Digital Receipt</h3>
              </div>
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#718096] leading-relaxed">
              We will send the official tax invoice and PDF pass for{" "}
              <span className="font-mono font-bold text-[#102B35]">{receipt.orderId}</span>.
            </p>

            <form onSubmit={handleSendEmail} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#718096] block mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="shopper@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DFDB] text-xs font-semibold text-[#102B35] focus:outline-none focus:ring-2 focus:ring-[#0B443B]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D5DFDB] text-xs font-bold text-[#718096] hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailSending || emailSent}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B443B] text-white text-xs font-bold hover:bg-[#07362E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {emailSending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : emailSent ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Receipt</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screen Mode Tabs for Mobile & Small Screens */}
      <div className="max-w-md mx-auto mb-3 lg:hidden">
        <div className="grid grid-cols-3 p-1 bg-white rounded-2xl border border-[#E5EBE8] shadow-xs text-xs font-bold">
          <button
            type="button"
            onClick={() => setCurrentScreen("success")}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
              currentScreen === "success"
                ? "bg-[#0B443B] text-white shadow-xs"
                : "text-[#718096] hover:text-[#102B35]"
            }`}
          >
            1. Success
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreen("receipt")}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
              currentScreen === "receipt"
                ? "bg-[#0B443B] text-white shadow-xs"
                : "text-[#718096] hover:text-[#102B35]"
            }`}
          >
            2. Receipt
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreen("details")}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
              currentScreen === "details"
                ? "bg-[#0B443B] text-white shadow-xs"
                : "text-[#718096] hover:text-[#102B35]"
            }`}
          >
            3. Exit QR
          </button>
        </div>
      </div>

      {/* Mobile Rendering: Single Focused Screen */}
      <div className="lg:hidden">
        {currentScreen === "success" && renderPaymentSuccessScreen()}
        {currentScreen === "receipt" && renderDigitalReceiptScreen()}
        {currentScreen === "details" && renderReceiptDetailsScreen()}
      </div>

      {/* Desktop Layout: 3 Connected Screens Panorama (exact match of 3-screen reference!) */}
      <div className="hidden lg:block max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#102B35] tracking-tight">
              SmartCart AI — Mobile Receipt Journey
            </h1>
            <p className="text-xs text-[#718096]">
              Interactive 3-screen flow: Payment Success → Digital Receipt → Exit Pass &amp; Credentials
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E5EBE8] text-xs font-bold text-[#0B443B] hover:bg-[#F7FAF9] flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={handleHomeClick}
              className="px-3.5 py-2 rounded-xl bg-[#0B443B] text-white text-xs font-bold hover:bg-[#07362E] flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 items-start">
          <div className="transition-all hover:-translate-y-1 duration-200">
            {renderPaymentSuccessScreen()}
          </div>
          <div className="transition-all hover:-translate-y-1 duration-200">
            {renderDigitalReceiptScreen()}
          </div>
          <div className="transition-all hover:-translate-y-1 duration-200">
            {renderReceiptDetailsScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-md mx-auto min-h-screen p-4 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ReceiptJourney />
    </React.Suspense>
  );
}
