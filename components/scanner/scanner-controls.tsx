"use client";

import React from "react";
import {
  Flashlight,
  SwitchCamera,
  Play,
  Pause,
  Keyboard,
  Camera,
} from "lucide-react";
import { ScannerLifecycleState } from "./camera-preview";

interface ScannerControlsProps {
  isTorchAvailable: boolean;
  isTorchOn: boolean;
  onToggleTorch: () => void;
  hasMultipleCameras: boolean;
  onSwitchCamera: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenManualEntry: () => void;
  scannerState: ScannerLifecycleState;
}

export function ScannerControls({
  isTorchAvailable,
  isTorchOn,
  onToggleTorch,
  hasMultipleCameras,
  onSwitchCamera,
  isPaused,
  onTogglePause,
  onOpenManualEntry,
  scannerState,
}: ScannerControlsProps) {
  const isCameraLive = scannerState === "scanning" || scannerState === "paused";

  return (
    <div className="bg-[#102B35] rounded-2xl p-3 border border-[#E5EBE8] shadow-md flex items-center justify-around gap-2 text-white">
      {/* 1. Flashlight / Torch Control */}
      <button
        type="button"
        onClick={onToggleTorch}
        disabled={!isTorchAvailable || !isCameraLive}
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
          isTorchOn
            ? "bg-amber-400 text-slate-900 font-bold shadow-md scale-102"
            : isTorchAvailable && isCameraLive
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-white/5 text-white/30 cursor-not-allowed"
        }`}
        title={
          !isTorchAvailable
            ? "Flashlight is not supported on this camera/browser"
            : isTorchOn
            ? "Turn Flashlight Off"
            : "Turn Flashlight On"
        }
        aria-label="Toggle flashlight"
      >
        <Flashlight className={`w-4 h-4 ${isTorchOn ? "fill-current" : ""}`} />
        <span className="text-[10px] mt-1 font-semibold">
          {isTorchOn ? "Torch On" : "Flashlight"}
        </span>
      </button>

      {/* 2. Switch Camera (Front / Rear) */}
      <button
        type="button"
        onClick={onSwitchCamera}
        disabled={!hasMultipleCameras || !isCameraLive}
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
          hasMultipleCameras && isCameraLive
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-white/5 text-white/30 cursor-not-allowed"
        }`}
        title={
          hasMultipleCameras
            ? "Switch camera lens (front / rear)"
            : "Only one camera detected"
        }
        aria-label="Switch camera"
      >
        <SwitchCamera className="w-4 h-4 text-[#17A890]" />
        <span className="text-[10px] mt-1 font-semibold">Flip Lens</span>
      </button>

      {/* 3. Pause / Resume Scanning */}
      <button
        type="button"
        onClick={onTogglePause}
        disabled={!isCameraLive}
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
          isPaused
            ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
            : isCameraLive
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-white/5 text-white/30 cursor-not-allowed"
        }`}
        title={isPaused ? "Resume camera scanning" : "Pause camera scanning"}
        aria-label={isPaused ? "Resume scanning" : "Pause scanning"}
      >
        {isPaused ? (
          <Play className="w-4 h-4 fill-amber-300 text-amber-300" />
        ) : (
          <Pause className="w-4 h-4 text-slate-200" />
        )}
        <span className="text-[10px] mt-1 font-semibold">
          {isPaused ? "Resume" : "Pause"}
        </span>
      </button>

      {/* 4. Manual Barcode Entry */}
      <button
        type="button"
        onClick={onOpenManualEntry}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#17A890] hover:bg-[#128673] text-white transition-all shadow-md active:scale-98 cursor-pointer"
        title="Enter barcode digits manually"
        aria-label="Enter barcode manually"
      >
        <Keyboard className="w-4 h-4" />
        <span className="text-[10px] mt-1 font-bold">Manual</span>
      </button>
    </div>
  );
}
