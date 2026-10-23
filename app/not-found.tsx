import React from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowLeft,
  Home,
  Compass,
  HelpCircle,
  FileQuestion,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] max-w-md mx-auto px-4 flex flex-col items-center justify-center text-center py-12 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-[#E5EBE8] flex items-center justify-center text-slate-400 shadow-xs">
        <FileQuestion className="w-8 h-8 text-[#17A890]" />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Page Not Found • 404
        </span>
        <h1 className="text-xl font-black text-[#102B35]">
          Aisle or Shelf Not Found
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          The page or product shelf you are looking for doesn&apos;t exist or may have been relocated.
        </p>
      </div>

      <div className="w-full space-y-2 pt-2">
        <Link
          href="/"
          className="w-full py-3 bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Store Home</span>
        </Link>

        <Link
          href="/explore"
          className="w-full py-2.5 bg-white hover:bg-slate-50 text-[#102B35] border border-[#E5EBE8] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Compass className="w-4 h-4 text-[#17A890]" />
          <span>Explore Product Catalogue</span>
        </Link>

        <Link
          href="/help"
          className="w-full py-2 text-slate-500 hover:text-[#102B35] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Visit Help Center</span>
        </Link>
      </div>
    </div>
  );
}
