"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import {
  ShoppingCart,
  ScanLine,
  Receipt,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding, continueAsGuest } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Scan & Shop",
      subtitle: "In-Aisle Barcode Scanning",
      description:
        "Point your smartphone camera at product barcodes as you place them in your cart. No waiting for a billing cashier.",
      icon: ScanLine,
      badge: "Fast & Effortless",
    },
    {
      title: "Live Bill Tracking",
      subtitle: "Transparent Real-Time Pricing",
      description:
        "Watch your running total, item counts, and automated store promotions update dynamically as you pick items.",
      icon: Receipt,
      badge: "Zero Surprise Bills",
    },
    {
      title: "Smart Verification",
      subtitle: "Seamless Queue-Free Exit",
      description:
        "Pay digitally via UPI or card, receive your digital QR exit receipt, and breeze past checkout lines in seconds.",
      icon: ShieldCheck,
      badge: "Express Exit Gate",
    },
  ];

  const handleGetStarted = () => {
    completeOnboarding();
    router.push("/register");
  };

  const handleLogin = () => {
    completeOnboarding();
    router.push("/login");
  };

  const handleGuestBrowse = () => {
    continueAsGuest();
    router.push("/");
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-md mx-auto py-2">
      {/* Top Brand Bar with Guest Skip */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#17A890] to-[#25d3b6] flex items-center justify-center shadow-md">
            <ShoppingCart className="w-4 h-4 text-[#102B35]" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-[#102B35]">
              SmartCart <span className="text-[#17A890]">AI</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleGuestBrowse}
          className="text-xs font-semibold text-[#718096] hover:text-[#17A890] px-2.5 py-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Skip to Catalogue
        </button>
      </div>

      {/* Hero Visual Card */}
      <div className="relative w-full aspect-16/10 rounded-3xl overflow-hidden shadow-lg border border-[#E5EBE8] bg-[#102B35]">
        <Image
          src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"
          alt="Modern supermarket smart shopping experience"
          fill
          className="object-cover opacity-60 mix-blend-luminosity"
          priority
          sizes="(max-width: 640px) 100vw, 448px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102B35] via-[#102B35]/40 to-transparent" />

        {/* Floating pill badge */}
        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#102B35] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#17A890]" />
          <span>Next-Gen Self-Checkout</span>
        </div>

        {/* Hero text overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            A smarter way to shop.
          </h1>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
            Scan your products, track your bill, and enjoy a faster checkout.
          </p>
        </div>
      </div>

      {/* Interactive 3-Step Feature Showcase */}
      <div className="my-5 space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">
            Shopping Features ({activeStep + 1}/3)
          </span>
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeStep === idx
                    ? "w-6 bg-[#17A890]"
                    : "w-2 bg-[#CBD5E1] hover:bg-slate-400"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Active Step Card */}
        <div className="bg-white rounded-2xl border-2 border-[#17A890]/30 p-4 shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#17A890]/15 text-[#17A890] flex items-center justify-center shrink-0 border border-[#17A890]/30">
              {React.createElement(steps[activeStep].icon, {
                className: "w-5 h-5",
              })}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-[#18252B]">
                  {steps[activeStep].title}
                </h3>
                <span className="text-[10px] font-bold text-[#16865C] bg-[#16865C]/10 px-2 py-0.5 rounded-full">
                  {steps[activeStep].badge}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#17A890] mt-0.5">
                {steps[activeStep].subtitle}
              </p>
              <p className="text-xs text-[#718096] mt-1.5 leading-relaxed">
                {steps[activeStep].description}
              </p>
            </div>
          </div>
        </div>

        {/* Feature summary pills */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                activeStep === idx
                  ? "border-[#17A890] bg-[#17A890]/5"
                  : "border-[#E5EBE8] bg-white hover:bg-slate-50"
              }`}
            >
              <p
                className={`text-[11px] font-bold truncate ${
                  activeStep === idx ? "text-[#102B35]" : "text-[#718096]"
                }`}
              >
                {step.title}
              </p>
              <span className="text-[10px] text-[#718096] block truncate">
                {idx === 0 ? "Barcodes" : idx === 1 ? "Live total" : "Express exit"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleGetStarted}
          className="w-full bg-[#17A890] hover:bg-[#128673] text-white font-bold text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleLogin}
          className="w-full bg-white hover:bg-slate-50 text-[#102B35] border border-[#E5EBE8] font-bold text-sm py-3 px-5 rounded-2xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <span>I already have an account</span>
          <ChevronRight className="w-4 h-4 text-[#718096]" />
        </button>

        <div className="text-center pt-1">
          <button
            onClick={handleGuestBrowse}
            className="text-xs font-semibold text-[#718096] hover:text-[#102B35] underline transition-colors cursor-pointer"
          >
            Explore store as Guest (No account needed)
          </button>
        </div>
      </div>
    </div>
  );
}
