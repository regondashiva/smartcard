"use client";

import React from "react";
import { Zap, Receipt, ShieldCheck } from "lucide-react";

export function ShoppingBenefits() {
  const benefits = [
    {
      icon: Zap,
      title: "Faster Checkout",
      description: "Scan items right at the aisle with your camera and bypass long billing counters.",
      accent: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      icon: Receipt,
      title: "Live Bill Tracking",
      description: "Track your items, running subtotal, and store savings in real-time as you pick.",
      accent: "text-[#17A890] bg-[#17A890]/10 border-[#17A890]/20",
    },
    {
      icon: ShieldCheck,
      title: "Smart Cart Verification",
      description: "Transparent digital reconciliation ensures your physical cart matches your digital bill.",
      accent: "text-[#16865C] bg-[#16865C]/10 border-[#16865C]/20",
    },
  ];

  return (
    <section aria-label="Shopping Benefits" className="space-y-2.5">
      <div className="px-1">
        <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider">
          Why Shop with SmartCart AI
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E5EBE8] p-4 flex items-start gap-3 shadow-xs"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${benefit.accent}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-[#18252B]">
                  {benefit.title}
                </h3>
                <p className="text-[11px] text-[#718096] mt-0.5 leading-snug">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
