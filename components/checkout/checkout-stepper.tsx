"use client";

import React from "react";
import { CheckoutStep } from "@/types/checkout";
import { Check, ShieldCheck } from "lucide-react";

interface Step {
  id: CheckoutStep;
  label: string;
  shortLabel: string;
}

const STEPS: Step[] = [
  { id: "review", label: "Review Order", shortLabel: "Review" },
  { id: "payment", label: "Payment", shortLabel: "Payment" },
  { id: "processing", label: "Processing", shortLabel: "Processing" },
  { id: "confirmation", label: "Confirmed", shortLabel: "Done" },
];

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#E2EBE6] px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1.5 min-w-[54px]">
                {/* Step Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#17A890] text-white shadow-xs"
                      : isActive
                      ? "bg-[#102B35] text-white ring-3 ring-[#17A890]/30 shadow-xs"
                      : "bg-[#F3F6F4] text-[#8A9BA8] border border-[#E5EBE8]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`text-[10px] tracking-tight leading-none text-center font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-[#102B35] font-bold"
                      : isCompleted
                      ? "text-[#17A890]"
                      : "text-[#8A9BA8]"
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>

              {/* Progress Connector */}
              {!isLast && (
                <div className="flex-1 mx-1 -mt-4">
                  <div className="h-1 w-full bg-[#EDF2EF] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        index < currentIndex
                          ? "bg-[#17A890] w-full"
                          : isActive
                          ? "bg-gradient-to-r from-[#17A890] to-[#E5EBE8] w-1/2"
                          : "w-0"
                      }`}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
