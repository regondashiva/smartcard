"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { BrowserMultiFormatReader, BarcodeFormat, BrowserCodeReader } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { CameraPreview, ScannerLifecycleState } from "./camera-preview";
import { ScannerControls } from "./scanner-controls";
import { ManualBarcodeEntry } from "./manual-barcode-entry";
import { ScanResultSheet } from "./scan-result-sheet";
import { UnknownProductState } from "./unknown-product-state";

interface IScannerControlsLike {
  stop: () => void | Promise<void>;
  switchTorch?: (onOff: boolean) => Promise<void>;
}

export function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControlsLike | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isDecodingLockedRef = useRef<boolean>(false);
  const lastScannedCodeRef = useRef<{ code: string; timestamp: number } | null>(null);

  // Component States
  const [scannerState, setScannerState] = useState<ScannerLifecycleState>("requesting");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number>(0);
  const [isTorchAvailable, setIsTorchAvailable] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  // Modals & Detection results
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<{
    code: string;
    format?: string;
  } | null>(null);
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  const [isResultSheetOpen, setIsResultSheetOpen] = useState<boolean>(false);
  const [isUnknownSheetOpen, setIsUnknownSheetOpen] = useState<boolean>(false);

  // Safe camera stop function
  const stopCameraResources = useCallback(() => {
    try {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    } catch {
      // Ignore cleanup error
    }

    try {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        activeStreamRef.current = null;
      }
    } catch {
      // Ignore stream error
    }

    if (videoRef.current) {
      try {
        BrowserCodeReader.cleanVideoSource(videoRef.current);
      } catch {
        // Fallback cleanup
        videoRef.current.srcObject = null;
      }
    }

    setIsTorchOn(false);
    setIsTorchAvailable(false);
  }, []);

  // Product Lookup handler
  const handleLookupBarcode = useCallback((rawBarcode: string, formatName?: string) => {
    const code = rawBarcode.trim();
    if (!code) return;

    if (!isMountedRef.current) return;

    setScannerState("looking_up");
    setScannedResult({ code, format: formatName });

    // Lock scanning while looking up and displaying result
    isDecodingLockedRef.current = true;

    // Simulate small realistic network/database indexing latency (180ms)
    setTimeout(() => {
      if (!isMountedRef.current) return;

      // Look up in PRODUCTS catalogue
      // Handle exact barcode match or normalized numeric match
      const product = PRODUCTS.find((p) => {
        if (!p.barcode) return false;
        if (p.barcode === code) return true;
        // Also check if barcode without leading zeros matches
        if (p.barcode.replace(/^0+/, "") === code.replace(/^0+/, "")) return true;
        return false;
      });

      if (product) {
        setMatchedProduct(product);
        setScannerState("found");
        setIsResultSheetOpen(true);
        setIsUnknownSheetOpen(false);
      } else {
        setMatchedProduct(null);
        setScannerState("not_found");
        setIsUnknownSheetOpen(true);
        setIsResultSheetOpen(false);
      }
    }, 180);
  }, []);

  // Barcode detected from camera stream
  const onBarcodeDetected = useCallback(
    (detectedText: string, formatId?: BarcodeFormat) => {
      if (isDecodingLockedRef.current) return;

      const trimmed = detectedText.trim();
      const now = Date.now();

      // Debounce: Prevent repeated triggers of the same barcode within 2.5 seconds
      if (
        lastScannedCodeRef.current &&
        lastScannedCodeRef.current.code === trimmed &&
        now - lastScannedCodeRef.current.timestamp < 2500
      ) {
        return;
      }

      lastScannedCodeRef.current = { code: trimmed, timestamp: now };

      let formatName: string | undefined;
      if (formatId !== undefined) {
        formatName = BarcodeFormat[formatId];
      }

      handleLookupBarcode(trimmed, formatName);
    },
    [handleLookupBarcode]
  );

  // Initialize and start the camera
  const startCamera = useCallback(async () => {
    if (!isMountedRef.current) return;
    stopCameraResources();

    setScannerState("requesting");
    setErrorMessage("");
    isDecodingLockedRef.current = false;

    // Verify browser supports mediaDevices
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      if (isMountedRef.current) {
        setScannerState("camera_unavailable");
        setErrorMessage("Camera API is not supported in this browser environment.");
      }
      return;
    }

    try {
      // 1. Build MultiFormatReader with supported supermarket barcode formats
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.QR_CODE,
      ]);
      hints.set(DecodeHintType.TRY_HARDER, true);

      const reader = new BrowserMultiFormatReader(hints);
      readerRef.current = reader;

      // 2. Discover available video input devices
      let devices: MediaDeviceInfo[] = [];
      try {
        devices = await BrowserCodeReader.listVideoInputDevices();
        if (isMountedRef.current) {
          setVideoDevices(devices);
        }
      } catch {
        // Enumerate error fallback
      }

      // 3. Build media constraints: prefer rear-facing "environment" camera on mobile
      const constraints: MediaStreamConstraints = {
        audio: false,
        video:
          devices.length > 0 && devices[currentDeviceIndex]?.deviceId
            ? {
                deviceId: { exact: devices[currentDeviceIndex].deviceId },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }
            : {
                facingMode: { ideal: "environment" },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
      };

      if (!videoRef.current || !isMountedRef.current) return;

      // 4. Request camera stream directly first to check torch capabilities and hold reference
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!isMountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      activeStreamRef.current = stream;

      // Check flashlight/torch support on video tracks
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        try {
          const capabilities = (videoTrack.getCapabilities?.() as { torch?: boolean }) || {};
          setIsTorchAvailable(!!capabilities.torch);
        } catch {
          setIsTorchAvailable(false);
        }
      }

      // 5. Decode from stream using BrowserMultiFormatReader
      const controls = await reader.decodeFromStream(
        stream,
        videoRef.current,
        (result, error) => {
          if (!isMountedRef.current) return;
          if (result) {
            onBarcodeDetected(result.getText(), result.getBarcodeFormat());
          }
        }
      );

      if (!isMountedRef.current) {
        controls.stop();
        return;
      }

      controlsRef.current = controls;
      setScannerState("scanning");
    } catch (err: unknown) {
      if (!isMountedRef.current) return;

      const error = err as { name?: string; message?: string };
      console.warn("Scanner camera initialization:", error);

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError" ||
        error.message?.includes("Permission denied")
      ) {
        setScannerState("permission_denied");
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError" ||
        error.name === "NotReadableError"
      ) {
        setScannerState("camera_unavailable");
        setErrorMessage(
          "Camera was not found or is currently locked by another application."
        );
      } else {
        setScannerState("error");
        setErrorMessage(error.message || "Failed to initialize camera.");
      }
    }
  }, [currentDeviceIndex, onBarcodeDetected, stopCameraResources]);

  // Lifecycle hook: Start camera on mount, cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    startCamera();

    return () => {
      isMountedRef.current = false;
      stopCameraResources();
    };
  }, [startCamera, stopCameraResources]);

  // Toggle Torch
  const handleToggleTorch = async () => {
    if (!isTorchAvailable || !activeStreamRef.current) return;

    try {
      const videoTrack = activeStreamRef.current.getVideoTracks()[0];
      if (videoTrack && videoTrack.applyConstraints) {
        const nextTorch = !isTorchOn;
        await videoTrack.applyConstraints({
          advanced: [{ torch: nextTorch } as MediaTrackConstraintSet],
        });
        setIsTorchOn(nextTorch);
      } else if (controlsRef.current?.switchTorch) {
        const nextTorch = !isTorchOn;
        await controlsRef.current.switchTorch(nextTorch);
        setIsTorchOn(nextTorch);
      }
    } catch (err) {
      console.warn("Failed to toggle torch constraint:", err);
      setIsTorchAvailable(false);
    }
  };

  // Switch between front/rear or multiple cameras
  const handleSwitchCamera = () => {
    if (videoDevices.length <= 1) return;
    const nextIndex = (currentDeviceIndex + 1) % videoDevices.length;
    setCurrentDeviceIndex(nextIndex);
  };

  // Toggle Pause / Resume
  const handleTogglePause = () => {
    if (scannerState === "scanning") {
      setScannerState("paused");
      isDecodingLockedRef.current = true;
    } else if (scannerState === "paused") {
      setScannerState("scanning");
      isDecodingLockedRef.current = false;
    }
  };

  // Resume scanning after result sheet or unknown sheet dismissed
  const handleScanAgain = () => {
    setIsResultSheetOpen(false);
    setIsUnknownSheetOpen(false);
    setIsManualModalOpen(false);
    setMatchedProduct(null);
    setScannedResult(null);

    // Reset duplicate-scan protection and unlock scanner
    lastScannedCodeRef.current = null;
    isDecodingLockedRef.current = false;

    // If scanner was alive, set back to scanning; otherwise restart camera
    if (controlsRef.current && activeStreamRef.current) {
      setScannerState("scanning");
    } else {
      startCamera();
    }
  };

  // Handle barcode submission from manual entry dialog
  const handleManualBarcodeSubmit = (barcode: string) => {
    setIsManualModalOpen(false);
    handleLookupBarcode(barcode, "MANUAL");
  };

  return (
    <div className="space-y-4">
      {/* 1. Camera Viewfinder Preview */}
      <CameraPreview
        videoRef={videoRef}
        scannerState={scannerState}
        errorMessage={errorMessage}
        onRequestPermission={startCamera}
        onOpenManualEntry={() => setIsManualModalOpen(true)}
        onResumeScanning={() => {
          setScannerState("scanning");
          isDecodingLockedRef.current = false;
        }}
      />

      {/* 2. Scanner Controls Toolbar */}
      <ScannerControls
        isTorchAvailable={isTorchAvailable}
        isTorchOn={isTorchOn}
        onToggleTorch={handleToggleTorch}
        hasMultipleCameras={videoDevices.length > 1}
        onSwitchCamera={handleSwitchCamera}
        isPaused={scannerState === "paused"}
        onTogglePause={handleTogglePause}
        onOpenManualEntry={() => setIsManualModalOpen(true)}
        scannerState={scannerState}
      />

      {/* 3. Manual Barcode Entry Modal Dialog */}
      <ManualBarcodeEntry
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmitBarcode={handleManualBarcodeSubmit}
        isLookingUp={scannerState === "looking_up"}
      />

      {/* 4. Product Confirmation Sheet (Found) */}
      <ScanResultSheet
        product={matchedProduct}
        scannedBarcode={scannedResult?.code || ""}
        isOpen={isResultSheetOpen}
        onClose={() => {
          setIsResultSheetOpen(false);
          isDecodingLockedRef.current = false;
          if (scannerState === "found") setScannerState("scanning");
        }}
        onScanAgain={handleScanAgain}
      />

      {/* 5. Unknown Product State (Not Found / Unsupported QR) */}
      <UnknownProductState
        scannedCode={scannedResult?.code || ""}
        detectedFormat={scannedResult?.format}
        isOpen={isUnknownSheetOpen}
        onScanAgain={handleScanAgain}
        onOpenManualEntry={() => {
          setIsUnknownSheetOpen(false);
          setIsManualModalOpen(true);
        }}
        onClose={() => {
          setIsUnknownSheetOpen(false);
          isDecodingLockedRef.current = false;
          if (scannerState === "not_found") setScannerState("scanning");
        }}
      />
    </div>
  );
}
