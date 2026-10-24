"use client";

import { useSyncExternalStore } from "react";

/**
 * Splash State Controller
 *
 * Tracks whether the splash screen is currently active and whether it has already
 * been displayed during the current page session.
 *
 * An in-memory flag resets whenever the page is refreshed or reopened, ensuring that
 * refreshing the application entry point displays the splash screen again.
 * Internal client-side navigation within Next.js preserves this state, avoiding
 * unnecessary splash restarts when browsing internal pages.
 */

let isSplashActive = false;
let hasInitialSplashRun = false;
const listeners = new Set<() => void>();

export function setSplashActive(active: boolean) {
  if (isSplashActive === active) return;
  isSplashActive = active;
  if (!active) {
    hasInitialSplashRun = true;
  }
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // Ignore listener error
    }
  });
}

export function getIsSplashActive(): boolean {
  return isSplashActive;
}

export function getHasInitialSplashRun(): boolean {
  return hasInitialSplashRun;
}

export function resetSplashForTesting() {
  hasInitialSplashRun = false;
  isSplashActive = false;
}

export function subscribeSplashActive(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useIsSplashActive(): boolean {
  return useSyncExternalStore(
    subscribeSplashActive,
    getIsSplashActive,
    () => false
  );
}
