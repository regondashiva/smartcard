"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { setSplashActive } from "./splash-state";

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

  // Keep a reference to current auth values so the 4000ms timer reads the latest state
  // without triggering a reset of the timer whenever auth states or hydration change.
  const authStateRef = useRef({
    hasCompletedOnboarding,
    isAuthenticated,
    isGuest,
    isHydrated,
  });

  useEffect(() => {
    authStateRef.current = {
      hasCompletedOnboarding,
      isAuthenticated,
      isGuest,
      isHydrated,
    };
  }, [hasCompletedOnboarding, isAuthenticated, isGuest, isHydrated]);

  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Notify global layout that the splash screen is visible
    setSplashActive(true);

    // The four-second timer begins immediately when the splash screen becomes visible
    const timer = setTimeout(() => {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;

      // Mark splash as completed
      setSplashActive(false);

      if (onComplete) {
        onComplete();
      }

      if (!standalone) {
        const {
          hasCompletedOnboarding: onboarded,
          isAuthenticated: authed,
          isGuest: guest,
        } = authStateRef.current;

        // Redirect based on current user state:
        // 1. Incomplete onboarding -> /onboarding
        // 2. Unauthenticated user (not guest) -> /login
        // 3. Authenticated customer or active guest -> / (Customer Home)
        if (!onboarded) {
          router.replace("/onboarding");
        } else if (!authed && !guest) {
          router.replace("/login");
        } else {
          router.replace("/");
        }
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [router, onComplete, standalone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-[#102B35] px-4 py-6 sm:py-10 select-none overflow-hidden"
      role="region"
      aria-label="SmartCart AI Launch Screen"
    >
      {/* Center Hero: Official SmartCart AI Logo Graphic with pure white background & seamless transparency */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl animate-in fade-in zoom-in-95 duration-700 ease-out">
        <div className="relative w-full aspect-[1024/682] max-h-[75vh] flex items-center justify-center">
          <Image
            src="/smartcart-splash.png"
            alt="SmartCart AI — Smart Shopping • Faster Checkout"
            fill
            priority
            sizes="(max-width: 640px) 96vw, (max-width: 1024px) 80vw, 680px"
            className="object-contain select-none pointer-events-none drop-shadow-xs"
          />
        </div>

        {/* Semantic screen reader announcement */}
        <h1 className="sr-only">SmartCart AI</h1>
        <p className="sr-only">SMART SHOPPING • FASTER CHECKOUT</p>
      </div>
    </div>
  );
}
