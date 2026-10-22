"use client";

import React from "react";
import { SimulationScenario } from "@/types/verification";
import { Sparkles, SlidersHorizontal, CheckCircle2, AlertTriangle, Scale, WifiOff, Clock } from "lucide-react";

interface SimulationScenarioBarProps {
  currentScenario: SimulationScenario;
  onSelectScenario: (scenario: SimulationScenario) => void;
}

const SCENARIOS: { id: SimulationScenario; label: string; icon: React.ReactNode }[] = [
  {
    id: "all_verified",
    label: "All Verified (Normal)",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
  },
  {
    id: "weight_discrepancy",
    label: "Weight Discrepancy (+180g)",
    icon: <Scale className="w-3.5 h-3.5 text-amber-600" />,
  },
  {
    id: "product_mismatch",
    label: "Product Mismatch",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-red-600" />,
  },
  {
    id: "pending_checking",
    label: "Checking (Pending)",
    icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
  },
  {
    id: "sensor_disconnected",
    label: "Sensor Disconnected",
    icon: <WifiOff className="w-3.5 h-3.5 text-slate-500" />,
  },
];

export function SimulationScenarioBar({
  currentScenario,
  onSelectScenario,
}: SimulationScenarioBarProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#E5EBE8] p-3.5 sm:p-4 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#17A890]" />
          <span className="text-xs font-bold text-[#102B35]">
            Hardware Test Scenarios (Demo Adapter)
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#17A890] bg-[#17A890]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Module 6 Test Control
        </span>
      </div>

      <p className="text-[11px] text-[#718096] leading-tight">
        Simulates physical load-cell scale readings and camera barcode verification signals to test edge cases.
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {SCENARIOS.map((sc) => {
          const isSelected = currentScenario === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelectScenario(sc.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#102B35] text-white border-[#102B35] shadow-xs"
                  : "bg-[#F7F9F8] text-[#18252B] border-[#E5EBE8] hover:bg-slate-100"
              }`}
            >
              {sc.icon}
              <span>{sc.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
