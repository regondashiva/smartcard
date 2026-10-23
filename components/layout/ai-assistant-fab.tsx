"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";

export function AIAssistantFAB() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Reset tooltip dismiss when route changes
  useEffect(() => {
    setShowTooltip(false);
  }, [pathname]);

  // Don't render on the assistant page itself
  if (pathname === "/assistant") return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 print:hidden"
      role="complementary"
      aria-label="AI Shopping Assistant"
    >
      {/* Tooltip bubble */}
      {showTooltip && !dismissed && (
        <div className="flex items-start gap-2 bg-white rounded-2xl shadow-xl border border-[#E5EBE8] px-3 py-2.5 max-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex-1">
            <p className="text-[11px] font-bold text-[#102B35] leading-tight">
              Need help shopping?
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
              Ask AI for product suggestions, comparisons, and deals.
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 mt-0.5"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* FAB Button */}
      <Link
        href="/assistant"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Open AI Shopping Assistant"
        className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-[#17A890] to-[#0f7a66] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-white/20"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#17A890] animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />
        <Sparkles className="w-6 h-6 relative z-10 drop-shadow-sm" />
      </Link>
    </div>
  );
}
