"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";

interface SplashScreenProps {
  /**
   * Optional custom redirect handler.
   * If provided (e.g. when used as an overlay on HomePage), this callback is called
   * instead of or in addition to navigating.
   */
  onComplete?: () => void;
  /**
   * If true, suppresses automatic router.push/replace and only calls onComplete.
   */
  standalone?: boolean;
}

export function SplashScreen({ onComplete, standalone = false }: SplashScreenProps) {
  const router = useRouter();
  const { hasCompletedOnboarding, isAuthenticated, isGuest, isHydrated } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // If not hydrated yet, wait for localStorage to finish reading so we make the right redirect decision
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;

      // Mark that splash has been displayed in this browser session
      try {
        sessionStorage.setItem("smartcart_splash_seen", "true");
      } catch {
        // Ignore session storage errors
      }

      if (onComplete) {
        onComplete();
      }

      if (!standalone) {
        if (!hasCompletedOnboarding) {
          router.replace("/onboarding");
        } else if (!isAuthenticated && !isGuest) {
          router.replace("/login");
        } else {
          router.replace("/");
        }
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isHydrated, hasCompletedOnboarding, isAuthenticated, isGuest, router, onComplete, standalone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-white text-[#102B35] px-6 py-12 select-none overflow-hidden"
      role="region"
      aria-label="SmartCart AI Launch Screen"
    >
      {/* Background ambient radial gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#17A890]/10 via-[#25d3b6]/5 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Top spacer */}
      <div className="h-6" />

      {/* Center hero: Illustration + App Name + Tagline */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-500">
        {/* Shopping Cart & Scanner Frame Illustration */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-6">
          <svg
            viewBox="0 0 320 320"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background subtle circular glow */}
            <circle cx="160" cy="155" r="100" fill="#E6F5F2" fillOpacity="0.7" />

            {/* Scanner reticle corners */}
            {/* Top-Right Corner */}
            <path
              d="M 215 85 L 240 85 A 12 12 0 0 1 252 97 L 252 120"
              stroke="#17A890"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Bottom-Right Corner */}
            <path
              d="M 252 180 L 252 195 A 12 12 0 0 1 240 207 L 225 207"
              stroke="#17A890"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Top-Left Corner (subtle) */}
            <path
              d="M 175 80 L 190 80 A 10 10 0 0 1 200 90 L 200 100"
              stroke="#17A890"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Motion Speed Lines on the Left */}
            <rect x="75" y="152" width="28" height="6.5" rx="3.25" fill="#17A890" />
            <rect x="80" y="167" width="28" height="6.5" rx="3.25" fill="#17A890" />
            <rect x="90" y="182" width="16" height="6" rx="3" fill="#17A890" />

            {/* GROCERIES INSIDE CART */}
            {/* 1. Yellow Juice Bottle */}
            <g id="bottle">
              <rect x="172" y="102" width="22" height="34" rx="4" fill="#FBBF24" />
              <path d="M 177 102 L 177 94 L 189 94 L 189 102 Z" fill="#F59E0B" />
              <rect x="175" y="90" width="16" height="6" rx="2" fill="#102B35" />
            </g>

            {/* 2. Red Apple */}
            <g id="apple">
              <ellipse cx="152" cy="124" rx="17" ry="16" fill="#EF4444" />
              <ellipse cx="148" cy="122" rx="14" ry="14" fill="#DC2626" />
              <path d="M 152 108 C 151 102, 155 98, 158 96" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              {/* Green leaf */}
              <path d="M 156 100 C 164 96, 166 103, 163 105 C 160 107, 156 103, 156 100 Z" fill="#22C55E" />
            </g>

            {/* 3. Fresh Green Vegetables / Lettuce */}
            <g id="lettuce">
              <path
                d="M 190 125 C 188 110, 198 102, 206 108 C 213 103, 222 108, 220 120 C 224 122, 222 130, 218 132 Z"
                fill="#4ADE80"
              />
              <path
                d="M 194 125 C 195 116, 202 110, 208 114 C 212 111, 218 115, 216 123"
                fill="#22C55E"
                opacity="0.8"
              />
            </g>

            {/* 4. French Baguette Bread */}
            <g id="bread">
              <rect
                x="218"
                y="100"
                width="22"
                height="50"
                rx="11"
                transform="rotate(22 218 100)"
                fill="#D97706"
              />
              {/* Score cuts on baguette */}
              <line x1="210" y1="120" x2="216" y2="124" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              <line x1="205" y1="130" x2="211" y2="134" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              <line x1="200" y1="140" x2="206" y2="144" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* 5. Milk / Dairy Carton */}
            <g id="milk">
              <rect x="215" y="126" width="22" height="26" rx="2" fill="#38BDF8" />
              <path d="M 215 126 L 226 118 L 237 126 Z" fill="#0284C7" />
              <rect x="220" y="115" width="12" height="4" rx="1.5" fill="#FFFFFF" />
            </g>

            {/* SHOPPING CART BASKET */}
            {/* Handle */}
            <path
              d="M 85 118 L 105 118 L 126 195 L 235 195"
              stroke="#0D9488"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Main Cart Tub */}
            <path
              d="M 112 130 L 244 139 C 248 139, 251 142, 250 146 L 240 190 C 239 194, 235 197, 231 197 L 131 197 C 127 197, 123 194, 122 190 L 112 130 Z"
              fill="url(#cartGradient)"
            />

            {/* AI Text on Cart */}
            <text
              x="166"
              y="180"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="28"
              fontWeight="900"
              letterSpacing="-0.5"
            >
              AI
            </text>

            {/* Sparkle ✦ on Cart */}
            <path
              d="M 207 167 Q 212 167 212 162 Q 212 167 217 167 Q 212 167 212 172 Q 212 167 207 167 Z"
              fill="#FFFFFF"
            />

            {/* Chassis Bar under basket */}
            <path
              d="M 126 197 C 126 206, 134 212, 145 212 L 215 212"
              stroke="#0F766E"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Left Wheel */}
            <g id="left-wheel">
              <circle cx="145" cy="225" r="14" fill="#102B35" />
              <circle cx="145" cy="225" r="9" fill="#0D9488" />
              <circle cx="145" cy="225" r="4" fill="#FFFFFF" />
            </g>

            {/* Right Wheel */}
            <g id="right-wheel">
              <circle cx="212" cy="225" r="14" fill="#102B35" />
              <circle cx="212" cy="225" r="9" fill="#0D9488" />
              <circle cx="212" cy="225" r="4" fill="#FFFFFF" />
            </g>

            {/* Definitions */}
            <defs>
              <linearGradient id="cartGradient" x1="112" y1="130" x2="248" y2="197" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0F766E" />
                <stop offset="0.6" stopColor="#0D9488" />
                <stop offset="1" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* App Title: SmartCart AI✦ */}
        <h1 className="flex items-center justify-center gap-1.5 text-3xl sm:text-4xl font-black tracking-tight text-[#102B35]">
          <span>SmartCart</span>
          <span className="text-[#17A890] flex items-center">
            AI
            <span className="text-xl sm:text-2xl text-[#17A890] ml-0.5 -mt-2">✦</span>
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-2.5 text-[11px] sm:text-xs font-bold text-slate-500 tracking-[0.2em] uppercase">
          Smart Shopping • Faster Checkout
        </p>
      </div>

      {/* Bottom Loading Progress Pill */}
      <div className="relative z-10 flex flex-col items-center gap-2 mb-2">
        <div className="w-36 sm:w-44 h-1.5 rounded-full bg-slate-100 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#17A890] via-[#20be9f] to-[#25d3b6] rounded-full animate-splash-progress"
            style={{
              animation: "splashProgress 2000ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
          />
        </div>
      </div>

      {/* Keyframe animation injected inline */}
      <style jsx>{`
        @keyframes splashProgress {
          0% {
            width: 0%;
          }
          30% {
            width: 35%;
          }
          70% {
            width: 75%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
