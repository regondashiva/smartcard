"use client";

import React from "react";
import { CheckoutStep } from "@/types/checkout";
import { Check } from "lucide-react";

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
    <div className="bg-white rounded-2xl border border-[#E5EBE8] px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1">
                {/* Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    isCompleted
                      ? "bg-[#17A890] text-white"
                      : isActive
                      ? "bg-[#102B35] text-white ring-2 ring-[#17A890] ring-offset-1"
                      : "bg-[#F7F9F8] text-[#718096] border border-[#E5EBE8]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    index + 1
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-[10px] font-semibold leading-tight text-center ${
                    isActive
                      ? "text-[#102B35]"
                      : isCompleted
                      ? "text-[#17A890]"
                      : "text-[#718096]"
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex-1 mx-1.5 mb-4">
                  <div
                    className={`h-0.5 w-full rounded-full transition-all duration-300 ${
                      index < currentIndex ? "bg-[#17A890]" : "bg-[#E5EBE8]"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
