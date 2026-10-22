import React from "react";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 max-w-[85%] my-2 animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-full bg-[#102B35] text-[#17A890] flex items-center justify-center shrink-0 shadow-xs">
        <Bot className="w-4 h-4" />
      </div>

      <div className="bg-white border border-[#E5EBE8] rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#17A890] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#17A890] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#17A890] animate-bounce" />
          <span className="text-[11px] font-semibold text-slate-400 ml-1.5">
            SmartCart AI is checking catalogue...
          </span>
        </div>
      </div>
    </div>
  );
}
