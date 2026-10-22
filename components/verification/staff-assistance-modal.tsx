"use client";

import React, { useState } from "react";
import { AssistanceRequest } from "@/types/verification";
import {
  UserCheck,
  CheckCircle2,
  Clock,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface StaffAssistanceModalProps {
  isOpen: boolean;
  activeRequest: AssistanceRequest | null;
  cartTag: string;
  onClose: () => void;
  onCancelRequest: () => void;
}

export function StaffAssistanceModal({
  isOpen,
  activeRequest,
  cartTag,
  onClose,
  onCancelRequest,
}: StaffAssistanceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-3xl border border-[#E5EBE8] shadow-2xl p-5 text-center space-y-4 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-assistance-title"
      >
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#17A890]/10 text-[#17A890] flex items-center justify-center mx-auto border border-[#17A890]/20">
          <UserCheck className="w-7 h-7" />
        </div>

        {/* Text Details */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-[#17A890] bg-[#17A890]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Attendant Alert Dispatched
          </span>
          <h3
            id="staff-assistance-title"
            className="text-base font-bold text-[#102B35]"
          >
            Staff Assistance Requested
          </h3>
          <p className="text-xs text-[#718096] leading-relaxed">
            A supermarket floor attendant has been notified for{" "}
            <strong className="text-[#102B35]">{cartTag}</strong>. They will arrive shortly to assist with barcode verification.
          </p>
        </div>

        {/* Ticket & Estimated Wait */}
        <div className="bg-[#F7F9F8] border border-[#E5EBE8] rounded-2xl p-3 text-xs space-y-2 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[#718096]">Support Ticket</span>
            <span className="font-mono font-bold text-[#102B35]">
              {activeRequest?.id || "AST-4821"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#718096]">Estimated Arrival</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>~45 seconds</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#718096]">Dispatch Status</span>
            <span className="font-semibold text-blue-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Staff En Route</span>
            </span>
          </div>
        </div>

        {/* Transparent Demo Notice */}
        <p className="text-[10px] text-[#718096] leading-tight">
          * Demo Mode: Real store deployments connect via MQTT/WebSocket to staff handheld devices.
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancelRequest}
            className="flex-1 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#718096] hover:text-[#18252B] font-bold text-xs py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
          >
            Cancel Request
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors shadow-md cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
