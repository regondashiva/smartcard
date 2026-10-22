"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { ExitValidationResult } from "@/types/receipt";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Store,
  QrCode,
  Scan,
  Sparkles,
} from "lucide-react";

function ExitScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get("code") || "";

  const [inputCode, setInputCode] = useState(initialCode);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ExitValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState<"camera" | "manual">(
    initialCode ? "manual" : "camera"
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<any>(null);

  // Stop camera helper
  const stopCamera = () => {
    try {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    } catch {
      // Ignore
    }
    setIsCameraActive(false);
  };

  // Start camera scanner
  const startCamera = async () => {
    if (!videoRef.current) return;
    setCameraError(null);
    try {
      stopCamera();
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, err) => {
          if (result) {
            const text = result.getText();
            stopCamera();
            handleProcessCredential(text);
          }
        }
      );
      controlsRef.current = controls;
      setIsCameraActive(true);
    } catch (err: any) {
      setCameraError(
        err?.message || "Could not access camera. Please enter code manually."
      );
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  // Handle server-side validation call
  const handleProcessCredential = async (rawInput: string) => {
    if (!rawInput.trim()) return;

    let tokenOrCode = rawInput.trim();

    // If QR code is JSON payload, parse token or exitCode
    try {
      const parsed = JSON.parse(rawInput);
      if (parsed.token) tokenOrCode = parsed.token;
      else if (parsed.exitCode) tokenOrCode = parsed.exitCode;
      else if (parsed.oid) tokenOrCode = parsed.oid;
    } catch {
      // Plain text code
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const res = await fetch("/api/exit/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenOrCode, gateId: "GATE-INDIRANAGAR-01" }),
      });
      const data: ExitValidationResult = await res.json();
      setValidationResult(data);
    } catch (err: any) {
      setValidationResult({
        success: false,
        code: "ERROR",
        message: "Failed to communicate with validation server.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    handleProcessCredential(inputCode.trim());
  };

  const handleReset = () => {
    setValidationResult(null);
    setInputCode("");
    if (activeTab === "camera") {
      startCamera();
    }
  };

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
              <span>Exit Verification Gate</span>
              <ShieldCheck className="w-4 h-4 text-[#17A890]" />
            </h1>
            <p className="text-[10px] text-[#718096]">
              Store Turnstile &amp; Kiosk Scanner
            </p>
          </div>
        </div>

        <Link
          href="/orders"
          className="text-xs font-bold text-[#17A890] hover:underline"
        >
          Customer Orders
        </Link>
      </header>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 p-1 bg-white rounded-2xl border border-[#E5EBE8] shadow-xs text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("camera")}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "camera"
              ? "bg-[#102B35] text-white shadow-xs"
              : "text-[#718096] hover:text-[#102B35]"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Camera Scanner</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "manual"
              ? "bg-[#102B35] text-white shadow-xs"
              : "text-[#718096] hover:text-[#102B35]"
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Keypad / Code Entry</span>
        </button>
      </div>

      {/* ─── Validation Result Card ─────────────────────────────────────────── */}
      {validationResult ? (
        <div
          className={`rounded-3xl border p-6 text-center space-y-4 shadow-lg animate-in zoom-in-95 duration-200 ${
            validationResult.success
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-red-50 border-red-300 text-red-950"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
              validationResult.success
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {validationResult.success ? (
              <CheckCircle2 className="w-9 h-9" />
            ) : (
              <XCircle className="w-9 h-9" />
            )}
          </div>

          <div className="space-y-1">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block ${
                validationResult.success
                  ? "bg-emerald-200 text-emerald-900"
                  : "bg-red-200 text-red-900"
              }`}
            >
              {validationResult.success ? "GATE UNLATCHED" : "EXIT PROHIBITED"}
            </span>
            <h2 className="text-xl font-black">
              {validationResult.success ? "Exit Authorized" : "Verification Failed"}
            </h2>
            <p className="text-xs leading-relaxed max-w-xs mx-auto">
              {validationResult.message}
            </p>
          </div>

          {validationResult.orderId && (
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 text-xs space-y-1 border border-black/5 text-left">
              <div className="flex justify-between">
                <span className="text-[#718096]">Order Reference:</span>
                <span className="font-mono font-bold text-[#102B35]">
                  {validationResult.orderId}
                </span>
              </div>
              {validationResult.itemCount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-[#718096]">Items Cleared:</span>
                  <span className="font-bold text-[#102B35]">
                    {validationResult.itemCount} items
                  </span>
                </div>
              )}
              {validationResult.finalAmount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-[#718096]">Amount Paid:</span>
                  <span className="font-bold text-[#102B35]">
                    {formatCurrency(validationResult.finalAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#718096]">Gate:</span>
                <span className="font-bold text-[#102B35]">
                  {validationResult.gateId || "Indiranagar Turnstile #1"}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#102B35] hover:bg-[#0B1D24] text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Next Customer</span>
          </button>
        </div>
      ) : isValidating ? (
        <div className="bg-white rounded-3xl border border-[#E5EBE8] p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 border-4 border-[#17A890] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <h2 className="text-sm font-black text-[#102B35]">
              Authorizing Exit Credential…
            </h2>
            <p className="text-xs text-[#718096]">
              Verifying payment, item scale weight, and token signatures with the store server.
            </p>
          </div>
        </div>
      ) : activeTab === "camera" ? (
        /* ─── Camera Scanner Mode ───────────────────────────────────────────── */
        <div className="bg-white rounded-3xl border border-[#E5EBE8] overflow-hidden shadow-xs space-y-3 p-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />

            {/* Viewfinder Overlay */}
            <div className="absolute inset-0 border-2 border-white/30 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-[#17A890] rounded-2xl relative">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-[#17A890] rounded-tl" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-[#17A890] rounded-tr" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-[#17A890] rounded-bl" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-[#17A890] rounded-br" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#17A890]/60 animate-pulse" />
              </div>
            </div>

            {cameraError && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center text-white space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
                <p className="text-xs">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("manual")}
                  className="bg-[#17A890] text-white text-xs font-bold py-2 px-3 rounded-lg"
                >
                  Switch to Manual Entry
                </button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-[#718096] text-center">
            Align customer's Exit QR screen within the viewfinder.
          </p>
        </div>
      ) : (
        /* ─── Manual Keypad / Code Entry Mode ───────────────────────────────── */
        <div className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-xs space-y-4">
          <div className="space-y-1 text-center">
            <h2 className="text-sm font-black text-[#102B35]">
              Enter Exit Pass Code
            </h2>
            <p className="text-xs text-[#718096]">
              Enter the 4-character Gate Code (e.g.{" "}
              <span className="font-mono font-bold text-[#102B35]">E7K2</span>) or full Order ID.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="e.g. E7K2 or SC-DEMO-9041"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full text-center font-mono text-lg font-black tracking-widest border border-[#E5EBE8] rounded-2xl py-3.5 bg-[#F7F9F8] focus:outline-none focus:ring-2 focus:ring-[#17A890] focus:border-transparent transition"
              autoFocus
            />

            <button
              type="submit"
              disabled={!inputCode.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#17A890] hover:bg-[#128673] disabled:bg-slate-200 disabled:text-slate-400 text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Validate &amp; Unlatch Turnstile</span>
            </button>
          </form>

          {/* Quick Demo Pre-fill Codes */}
          <div className="pt-2 border-t border-[#F0F4F2] space-y-2">
            <p className="text-[10px] font-bold text-[#718096] uppercase tracking-wider text-center">
              Quick Test Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setInputCode("E7K2");
                  handleProcessCredential("E7K2");
                }}
                className="p-2 rounded-xl border border-[#E5EBE8] hover:border-[#17A890] bg-[#F7F9F8] text-left cursor-pointer transition-colors"
              >
                <span className="font-mono font-black text-xs text-[#102B35] block">
                  E7K2
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  Valid • Paid Order
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputCode("B4M9");
                  handleProcessCredential("B4M9");
                }}
                className="p-2 rounded-xl border border-[#E5EBE8] hover:border-[#17A890] bg-[#F7F9F8] text-left cursor-pointer transition-colors"
              >
                <span className="font-mono font-black text-xs text-[#102B35] block">
                  B4M9
                </span>
                <span className="text-[10px] text-slate-500 font-bold block">
                  Already Exited (Replay)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Verification Notice */}
      <div className="bg-[#102B35] text-white rounded-2xl p-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-[#17A890]" />
          <h3 className="text-xs font-bold">Authorized Exit Gate Protocol</h3>
        </div>
        <p className="text-[10px] text-white/70 leading-relaxed">
          Decisions are rendered authoritatively by the SmartCart store server. Customer shopping scale weight matches and payment confirmations are verified before the turnstile solenoid releases.
        </p>
      </div>
    </div>
  );
}

export default function ExitScannerPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto min-h-screen p-4 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#17A890] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ExitScannerContent />
    </Suspense>
  );
}
