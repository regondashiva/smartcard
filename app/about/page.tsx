"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ChevronLeft,
  ScanLine,
  ShieldCheck,
  CreditCard,
  QrCode,
  Sparkles,
  Bell,
  Sliders,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Info,
} from "lucide-react";

const MODULES_OVERVIEW = [
  {
    num: "01",
    name: "Customer App Foundation",
    desc: "Responsive mobile-first layout with real-time catalogue search and branch selector.",
    status: "Production Ready",
  },
  {
    num: "02",
    name: "Authentication & Profile",
    desc: "Secure phone OTP, email authentication, guest checkout, and SmartClub tiers.",
    status: "Production Ready",
  },
  {
    num: "03",
    name: "Product Catalogue & Details",
    desc: "Categorized inventory, nutrition highlights, stock levels, and real-time prices.",
    status: "Authoritative Catalogue",
  },
  {
    num: "04",
    name: "Barcode & QR Scanner",
    desc: "In-browser camera barcode recognition with EAN-13 validation and manual fallback.",
    status: "Camera / ZXing Live",
  },
  {
    num: "05",
    name: "Smart Cart & Live Billing",
    desc: "Real-time GST computation, line discounts, savings breakdown, and expected weight.",
    status: "Client & Server Verified",
  },
  {
    num: "06",
    name: "Cart Verification & Mismatch Alerts",
    desc: "Itemized physical scale comparisons, un-scanned product alerts, and staff assist.",
    status: "Hardware Emulation / Live State",
  },
  {
    num: "07",
    name: "Checkout & Payment Flow",
    desc: "UPI, Cards, and NetBanking checkout with GST invoice preview and payment states.",
    status: "Simulated Gateway & Real Storage",
  },
  {
    num: "08",
    name: "Digital Receipt & Exit Pass",
    desc: "30-minute cryptographic exit QR pass, GST compliance, and turnstile validation.",
    status: "Cryptographic QR Pass",
  },
  {
    num: "09",
    name: "Shopping History & Analytics",
    desc: "Category spending charts, time range filters, buy-again staples, and receipt vault.",
    status: "Live Analytics Engine",
  },
  {
    num: "10",
    name: "Customer Notifications & Alerts",
    desc: "In-app toasts, unread notification center, category toggles, and quiet hours.",
    status: "Server Store & Toast Overlay",
  },
  {
    num: "11",
    name: "AI Shopping Assistant",
    desc: "Conversational retail assistant for budget fits, product comparisons, and shopping lists.",
    status: "Deterministic Rule-Based Demo",
  },
  {
    num: "12",
    name: "Settings, Support & Help Center",
    desc: "Shopping preferences, comprehensive help articles, support tickets, and data export.",
    status: "Integrated Application",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 space-y-6">
      {/* ─── Top Header ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2.5">
          <Link
            href="/settings"
            className="w-8 h-8 rounded-full bg-white border border-[#E5EBE8] text-[#102B35] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs"
            aria-label="Back to settings"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-extrabold text-[#102B35]">
              About SmartCart AI
            </h1>
            <p className="text-[11px] text-slate-500">
              Autonomous In-Store Self-Checkout & Shopping Companion
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          v1.2.0
        </span>
      </div>

      {/* ─── Hero Brand Mark ─── */}
      <div className="bg-gradient-to-br from-[#102B35] via-[#123845] to-[#0D242C] rounded-3xl p-6 text-white text-center space-y-3 shadow-lg border border-[#17A890]/30 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#17A890] to-[#25d3b6] flex items-center justify-center text-[#102B35] mx-auto shadow-md">
          <ShoppingCart className="w-7 h-7 stroke-[2.2]" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-xl font-black tracking-tight">SmartCart</h2>
            <span className="text-[#17A890] text-xs font-black tracking-wider uppercase bg-white/10 px-1.5 py-0.5 rounded">
              AI
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            The next-generation retail self-checkout application eliminating cashier queues with sensor-verified shopping and exit turnstile validation.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-2 text-[10px] text-slate-300">
          <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
            Next.js 16 App Router
          </span>
          <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
            React 19
          </span>
          <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
            TypeScript Strict
          </span>
          <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
            Tailwind CSS
          </span>
        </div>
      </div>

      {/* ─── Architecture Overview ─── */}
      <div className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E5EBE8]">
          <Cpu className="w-4 h-4 text-[#17A890]" />
          <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
            System Architecture & Principles
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          SmartCart AI connects the shopper&apos;s mobile device with store edge inventory, digital cart scale load cells, and automated exit barrier gates:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E5EBE8] space-y-1">
            <h4 className="text-xs font-bold text-[#102B35]">Authoritative Data</h4>
            <p className="text-[10px] text-slate-500 leading-snug">
              Catalogue prices, discounts, and inventory counts are authoritatively validated; the client never invents pricing.
            </p>
          </div>

          <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E5EBE8] space-y-1">
            <h4 className="text-xs font-bold text-[#102B35]">Discrepancy Guard</h4>
            <p className="text-[10px] text-slate-500 leading-snug">
              Physical cart weights are verified against expected product tare weights to prevent un-scanned items before checkout.
            </p>
          </div>

          <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E5EBE8] space-y-1">
            <h4 className="text-xs font-bold text-[#102B35]">Exit Security</h4>
            <p className="text-[10px] text-slate-500 leading-snug">
              Time-bound cryptographic exit passes prevent re-use and enable automated gate turnstile validation.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Complete 12-Module Matrix ─── */}
      <div className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#102B35]" />
            <h3 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
              Complete 12-Module Matrix
            </h3>
          </div>
          <span className="text-[10px] font-bold text-[#17A890]">
            All 12 Modules Integrated
          </span>
        </div>

        <div className="divide-y divide-[#F0F4F2]">
          {MODULES_OVERVIEW.map((m) => (
            <div key={m.num} className="py-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                  {m.num}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#102B35]">{m.name}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {m.desc}
                  </p>
                </div>
              </div>

              <span className="text-[9px] font-bold text-slate-600 bg-[#F7F9F8] border border-[#E5EBE8] px-2 py-0.5 rounded-full shrink-0">
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Quick Navigation Footer ─── */}
      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <Link
          href="/help"
          className="p-3 bg-white border border-[#E5EBE8] rounded-xl hover:bg-slate-50 text-center transition-colors text-xs font-bold text-[#102B35] flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>Open Help Center</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#17A890]" />
        </Link>
        <Link
          href="/support"
          className="p-3 bg-white border border-[#E5EBE8] rounded-xl hover:bg-slate-50 text-center transition-colors text-xs font-bold text-[#102B35] flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>Contact Store Support</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#17A890]" />
        </Link>
      </div>
    </div>
  );
}
