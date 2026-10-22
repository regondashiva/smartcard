"use client";

import React from "react";
import { ShoppingSession, StoreLocation } from "@/types/cart";
import {
  Wifi,
  WifiOff,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

interface ShoppingSessionCardProps {
  session: ShoppingSession;
  store: StoreLocation;
  itemCount: number;
  onStartSession: () => void;
  onPauseSession?: () => void;
  onResumeSession?: () => void;
  onEndSession?: () => void;
}

export function ShoppingSessionCard({
  session,
  store,
  itemCount,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onEndSession,
}: ShoppingSessionCardProps) {
  const isSessionActive = session.isActive;
  const isPaused = session.status === "paused";

  if (!isSessionActive) {
    return (
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <WifiOff className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 leading-tight">
              No Shopping Session Active
            </h4>
            <p className="text-[11px] text-amber-800/80 mt-0.5">
              Start a shopping session to link your basket with a smart cart.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartSession}
          className="bg-[#102B35] hover:bg-[#0B1D24] text-white font-bold text-xs py-2 px-3.5 rounded-xl self-start sm:self-auto flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#17A890]" />
          <span>Start Demo Session</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#102B35] text-white rounded-3xl p-4 shadow-sm border border-[#17A890]/30 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
            }`}
          />
          <span className="font-bold text-xs sm:text-sm tracking-wide">
            {session.cartTag}
          </span>
          <span className="bg-white/10 text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
            {isPaused ? "Session Paused" : "Active Demo Session"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono">
          <Wifi className="w-3.5 h-3.5 text-[#17A890]" />
          <span>{session.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px]">
        <div>
          <span className="text-slate-400 block text-[10px]">Store Location</span>
          <span className="font-semibold text-slate-200 truncate block">
            {session.storeName || store.name}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px]">Session Start</span>
          <span className="font-semibold text-slate-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#17A890]" />
            <span>{session.startTime || "Just started"}</span>
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
          {isPaused ? (
            <button
              type="button"
              onClick={onResumeSession}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30 transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPauseSession}
              className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              <Pause className="w-3 h-3" />
              <span>Pause</span>
            </button>
          )}

          <button
            type="button"
            onClick={onEndSession}
            className="text-[11px] font-medium text-slate-400 hover:text-red-300 underline transition-colors cursor-pointer"
          >
            End
          </button>
        </div>
      </div>
    </div>
  );
}
