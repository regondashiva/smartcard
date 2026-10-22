"use client";

import React from "react";
import { VerificationSummary, VerificationStatus } from "@/types/verification";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  WifiOff,
  RotateCcw,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Cpu,
} from "lucide-react";

interface VerificationDashboardProps {
  summary: VerificationSummary;
  isRetrying: boolean;
  onRetry: () => void;
  onRequestStaff: () => void;
}

export function VerificationDashboard({
  summary,
  isRetrying,
  onRetry,
  onRequestStaff,
}: VerificationDashboardProps) {
  const {
    overallStatus,
    verifiedCount,
    pendingCount,
    attentionCount,
    totalItems,
    lastVerifiedAt,
    hardwareConnected,
    hardwareModel,
    nextActionGuidance,
  } = summary;

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return {
          icon: <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />,
          title: "All Cart Items Verified",
          colorClass: "bg-emerald-50 border-emerald-200 text-emerald-900",
          pillClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
          statusText: "Verified",
        };
      case "needs_attention":
        return {
          icon: <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />,
          title: "Discrepancy Requires Attention",
          colorClass: "bg-red-50 border-red-200 text-red-900",
          pillClass: "bg-red-100 text-red-800 border-red-300",
          statusText: "Needs Attention",
        };
      case "checking":
        return {
          icon: <Clock className="w-6 h-6 text-blue-600 shrink-0 animate-spin" />,
          title: "Verification in Progress",
          colorClass: "bg-blue-50 border-blue-200 text-blue-900",
          pillClass: "bg-blue-100 text-blue-800 border-blue-300",
          statusText: "Checking",
        };
      case "unavailable":
        return {
          icon: <WifiOff className="w-6 h-6 text-slate-500 shrink-0" />,
          title: "Verification Sensor Offline",
          colorClass: "bg-slate-100 border-slate-300 text-slate-800",
          pillClass: "bg-slate-200 text-slate-700 border-slate-300",
          statusText: "Unavailable",
        };
      case "not_checked":
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-slate-400 shrink-0" />,
          title: "No Cart Items to Verify",
          colorClass: "bg-slate-50 border-slate-200 text-slate-700",
          pillClass: "bg-slate-200 text-slate-600 border-slate-300",
          statusText: "Not Checked",
        };
    }
  };

  const statusConfig = getStatusBadge(overallStatus);

  return (
    <div className="space-y-3.5">
      {/* 1. Main Overall Status Banner */}
      <div
        className={`rounded-3xl border p-4.5 sm:p-5 shadow-xs transition-colors space-y-3.5 ${statusConfig.colorClass}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {statusConfig.icon}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black leading-tight">
                  {statusConfig.title}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusConfig.pillClass}`}
                >
                  {statusConfig.statusText}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {nextActionGuidance}
              </p>
            </div>
          </div>
        </div>

        {/* Guidance and Hardware Info Footer */}
        <div className="pt-2 border-t border-current/15 flex flex-wrap items-center justify-between gap-2 text-[11px] opacity-80">
          <div className="flex items-center gap-1.5 font-medium">
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{hardwareModel}</span>
          </div>

          {lastVerifiedAt && (
            <span>Last checked: {lastVerifiedAt}</span>
          )}
        </div>
      </div>

      {/* 2. Three Metric Counters */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        {/* Verified Count */}
        <div className="bg-white rounded-2xl border border-[#E5EBE8] p-3 shadow-2xs space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#102B35]">
            {verifiedCount}
          </p>
          <span className="text-[10px] text-[#718096]">
            of {totalItems} {totalItems === 1 ? "unit" : "units"}
          </span>
        </div>

        {/* Awaiting Count */}
        <div className="bg-white rounded-2xl border border-[#E5EBE8] p-3 shadow-2xs space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-700">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#102B35]">
            {pendingCount}
          </p>
          <span className="text-[10px] text-[#718096]">awaiting scale</span>
        </div>

        {/* Needs Attention Count */}
        <div className="bg-white rounded-2xl border border-[#E5EBE8] p-3 shadow-2xs space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-red-600">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Flagged</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#102B35]">
            {attentionCount}
          </p>
          <span className="text-[10px] text-[#718096]">needs review</span>
        </div>
      </div>

      {/* 3. Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying || totalItems === 0}
          className="flex-1 bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
          <span>{isRetrying ? "Retrying Verification..." : "Re-Check Cart"}</span>
        </button>

        <button
          type="button"
          onClick={onRequestStaff}
          className="bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#18252B] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#17A890]" />
          <span>Request Staff Assistance</span>
        </button>
      </div>
    </div>
  );
}
