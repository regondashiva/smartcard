"use client";

import React from "react";
import { VerificationEvent } from "@/types/verification";
import {
  History,
  CheckCircle2,
  AlertTriangle,
  Scale,
  UserCheck,
  Clock,
} from "lucide-react";

interface VerificationHistoryTimelineProps {
  events: VerificationEvent[];
}

export function VerificationHistoryTimeline({
  events,
}: VerificationHistoryTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#E5EBE8] p-6 text-center text-xs text-[#718096] space-y-2">
        <Clock className="w-8 h-8 text-slate-300 mx-auto" />
        <p>No verification events recorded yet for this session.</p>
      </div>
    );
  }

  const getEventIcon = (type: VerificationEvent["type"]) => {
    switch (type) {
      case "scan_verified":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case "weight_checked":
        return <Scale className="w-3.5 h-3.5 text-[#17A890]" />;
      case "discrepancy_flagged":
        return <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
      case "discrepancy_resolved":
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />;
      case "staff_requested":
        return <UserCheck className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <History className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5EBE8] p-4.5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-[#E5EBE8] pb-2.5">
        <div className="flex items-center gap-1.5">
          <History className="w-4 h-4 text-[#17A890]" />
          <h3 className="text-xs font-bold text-[#102B35]">
            Cart Verification Timeline
          </h3>
        </div>
        <span className="text-[10px] text-[#718096]">
          {events.length} {events.length === 1 ? "event" : "events"}
        </span>
      </div>

      <div className="space-y-3">
        {events.map((evt, idx) => (
          <div key={evt.id || idx} className="flex items-start gap-2.5 text-xs">
            <div className="w-6 h-6 rounded-full bg-[#F7F9F8] border border-[#E5EBE8] flex items-center justify-center shrink-0 mt-0.5">
              {getEventIcon(evt.type)}
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-[#102B35] text-[11px] truncate">
                  {evt.productName || "Cart Sensor System"}
                </span>
                <span className="text-[10px] text-[#718096] shrink-0 font-mono">
                  {evt.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-[#718096] leading-tight">
                {evt.result}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
