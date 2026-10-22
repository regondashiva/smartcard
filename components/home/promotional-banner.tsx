"use client";

import React from "react";
import Image from "next/image";
import { Zap, ShieldCheck, ArrowRight } from "lucide-react";

interface PromotionalBannerProps {
  onLearnMore?: () => void;
}

export function PromotionalBanner({ onLearnMore }: PromotionalBannerProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm overflow-hidden flex flex-col sm:flex-row items-stretch">
      {/* Text column */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#17A890]/10 text-[#128673] text-[11px] font-bold px-2.5 py-1 rounded-full mb-2">
            <Zap className="w-3.5 h-3.5 fill-[#17A890] text-[#17A890]" />
            <span>Zero Checkout Queues</span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-[#102B35] tracking-tight leading-tight">
            Smarter shopping starts here.
          </h3>

          <p className="text-xs text-[#718096] mt-1.5 leading-relaxed">
            Scan your products directly in the aisle. Track your live bill with real-time discounts. Walk out with digital receipt validation.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E5EBE8]/60 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#16865C]" />
            <span>AI Verified Accuracy</span>
          </div>

          <button
            onClick={onLearnMore}
            className="font-bold text-[#17A890] hover:text-[#128673] flex items-center gap-1 group transition-colors cursor-pointer"
          >
            <span>How it works</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Visual illustration / clean photography side */}
      <div className="relative w-full sm:w-44 h-32 sm:h-auto bg-gradient-to-tr from-[#102B35] to-[#1a4250] shrink-0 overflow-hidden flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
          alt="Smart supermarket shopping experience"
          fill
          className="object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 176px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102B35]/80 via-[#102B35]/30 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#102B35]/40" />

        <div className="relative z-10 text-center p-3">
          <div className="inline-block bg-white/95 backdrop-blur-xs text-[#102B35] font-black text-xs px-3 py-1.5 rounded-xl shadow-md border border-white/40">
            SmartCart AI
          </div>
          <p className="text-[10px] text-white/90 font-medium mt-1">
            Tap • Scan • Go
          </p>
        </div>
      </div>
    </div>
  );
}
