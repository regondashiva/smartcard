"use client";

import React from "react";
import {
  Camera,
  CameraOff,
  AlertTriangle,
  Loader2,
  Pause,
  ScanLine,
  Keyboard,
  RotateCcw,
} from "lucide-react";

export type ScannerLifecycleState =
  | "idle"
  | "requesting"
  | "scanning"
  | "paused"
  | "looking_up"
  | "found"
  | "not_found"
  | "permission_denied"
  | "camera_unavailable"
  | "error";

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  scannerState: ScannerLifecycleState;
  errorMessage?: string;
  onRequestPermission: () => void;
  onOpenManualEntry: () => void;
  onResumeScanning: () => void;
}

export function CameraPreview({
  videoRef,
  scannerState,
  errorMessage,
  onRequestPermission,
  onOpenManualEntry,
  onResumeScanning,
}: CameraPreviewProps) {
  const isScanningActive = scannerState === "scanning";
  const isLookingUp = scannerState === "looking_up";
  const isPaused = scannerState === "paused";

  return (
    <div className="relative aspect-4/5 w-full bg-[#102B35] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#17A890]/40 flex flex-col items-center justify-between p-4 sm:p-6 text-white select-none">
      {/* Real Video Camera Stream */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Subtle background grid pattern when video is dark or transparent */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#17A890_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Dark Vignette around edges to focus on scanning frame */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* Top Status Banner */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200 border border-white/10 shadow-sm">
          <span
            className={`w-2 h-2 rounded-full ${
              isScanningActive
                ? "bg-emerald-400 animate-pulse"
                : isPaused
                ? "bg-amber-400"
                : "bg-red-400"
            }`}
          />
          <span className="capitalize">
            {isScanningActive
              ? "Scanner Active"
              : isPaused
              ? "Scanner Paused"
              : isLookingUp
              ? "Decoding..."
              : "Camera Standby"}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenManualEntry}
          className="bg-black/60 backdrop-blur-md hover:bg-black/80 text-white border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          aria-label="Enter barcode manually"
        >
          <Keyboard className="w-3.5 h-3.5 text-[#17A890]" />
          <span>Manual Entry</span>
        </button>
      </div>

      {/* Centered Scanning Reticle Frame */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        <div className="relative w-60 h-60 sm:w-68 sm:h-68 rounded-2xl flex items-center justify-center p-3">
          {/* Outer frame subtle border */}
          <div className="absolute inset-0 border border-white/15 rounded-2xl pointer-events-none" />

          {/* 4 Corner Markers */}
          {/* Top-Left */}
          <div className="absolute top-0 left-0 w-7 h-7 border-t-3 border-l-3 border-[#17A890] rounded-tl-xl shadow-[0_0_8px_rgba(23,168,144,0.6)]" />
          {/* Top-Right */}
          <div className="absolute top-0 right-0 w-7 h-7 border-t-3 border-r-3 border-[#17A890] rounded-tr-xl shadow-[0_0_8px_rgba(23,168,144,0.6)]" />
          {/* Bottom-Left */}
          <div className="absolute bottom-0 left-0 w-7 h-7 border-b-3 border-l-3 border-[#17A890] rounded-bl-xl shadow-[0_0_8px_rgba(23,168,144,0.6)]" />
          {/* Bottom-Right */}
          <div className="absolute bottom-0 right-0 w-7 h-7 border-b-3 border-r-3 border-[#17A890] rounded-br-xl shadow-[0_0_8px_rgba(23,168,144,0.6)]" />

          {/* Animated Laser Scanning Beam */}
          {isScanningActive && (
            <div className="absolute left-2 right-2 h-0.75 bg-gradient-to-r from-transparent via-[#17A890] to-transparent shadow-[0_0_12px_#17A890] animate-scan-laser pointer-events-none" />
          )}

          {/* Center Crosshair or Scan Target Guide */}
          <div className="flex flex-col items-center justify-center text-center pointer-events-none">
            {isLookingUp ? (
              <div className="bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#17A890]/40 flex flex-col items-center gap-2">
                <Loader2 className="w-7 h-7 text-[#17A890] animate-spin" />
                <span className="text-xs font-bold text-white">
                  Looking up product...
                </span>
              </div>
            ) : isPaused ? (
              <div className="bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex flex-col items-center gap-2">
                <Pause className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-bold text-white">Scanning Paused</span>
              </div>
            ) : (
              <div className="opacity-40 flex flex-col items-center">
                <ScanLine className="w-10 h-10 text-[#17A890]" />
              </div>
            )}
          </div>
        </div>

        {/* Text Instruction under reticle */}
        <div className="mt-4 text-center space-y-0.5">
          <p className="text-xs sm:text-sm font-bold text-white drop-shadow-md">
            Position the barcode inside the frame
          </p>
          <p className="text-[11px] text-slate-300">
            Supports EAN-13, EAN-8, UPC, Code 128 & QR
          </p>
        </div>
      </div>

      {/* Overlay: Requesting Permission */}
      {scannerState === "requesting" && (
        <div className="absolute inset-0 z-20 bg-[#102B35]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#17A890]/20 border border-[#17A890]/40 flex items-center justify-center text-[#17A890]">
            <Camera className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Requesting Camera Access</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              Please allow camera permissions in your browser to scan supermarket barcodes.
            </p>
          </div>
          <Loader2 className="w-5 h-5 text-[#17A890] animate-spin pt-1" />
        </div>
      )}

      {/* Overlay: Permission Denied */}
      {scannerState === "permission_denied" && (
        <div className="absolute inset-0 z-20 bg-[#102B35]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <CameraOff className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Camera Permission Denied</h3>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              Camera access was blocked. You can still look up products by entering the barcode manually or grant permission in site settings.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
            <button
              type="button"
              onClick={onRequestPermission}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Permission</span>
            </button>
            <button
              type="button"
              onClick={onOpenManualEntry}
              className="flex-1 bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Manual Entry</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay: Camera Unavailable */}
      {scannerState === "camera_unavailable" && (
        <div className="absolute inset-0 z-20 bg-[#102B35]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Camera Unavailable</h3>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              {errorMessage ||
                "No active video camera was detected on this device or it is in use by another application."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
            <button
              type="button"
              onClick={onRequestPermission}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Camera</span>
            </button>
            <button
              type="button"
              onClick={onOpenManualEntry}
              className="flex-1 bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Manual Entry</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay: Error State */}
      {scannerState === "error" && (
        <div className="absolute inset-0 z-20 bg-[#102B35]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Scanner Error</h3>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              {errorMessage || "An unexpected error occurred while starting the camera."}
            </p>
          </div>
          <button
            type="button"
            onClick={onRequestPermission}
            className="bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-2.5 px-5 rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Camera</span>
          </button>
        </div>
      )}

      {/* Bottom overlay: When paused, show resume action */}
      {isPaused && (
        <div className="relative z-10 w-full flex justify-center pb-1">
          <button
            type="button"
            onClick={onResumeScanning}
            className="bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Resume Camera Scanning</span>
          </button>
        </div>
      )}
    </div>
  );
}
