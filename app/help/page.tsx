"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HELP_TOPICS } from "@/lib/help-data";
import { HelpTopic } from "@/types/settings";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Headphones,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  BookOpen,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

const CATEGORY_TABS = [
  { id: "all", label: "All Topics" },
  { id: "getting-started", label: "Getting Started" },
  { id: "smart-cart", label: "Smart Cart" },
  { id: "payments-orders", label: "Payments & Orders" },
  { id: "exit-validation", label: "Exit Validation" },
  { id: "account-notifications", label: "Account & Alerts" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(
    HELP_TOPICS[0].id
  );

  const filteredTopics = useMemo(() => {
    return HELP_TOPICS.filter((topic) => {
      const matchesCategory =
        selectedCategory === "all" || topic.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = topic.title.toLowerCase().includes(q);
      const matchSummary = topic.summary.toLowerCase().includes(q);
      const matchTags = topic.tags.some((t) => t.toLowerCase().includes(q));
      const matchSteps = topic.steps.some((s) => s.toLowerCase().includes(q));

      return matchTitle || matchSummary || matchTags || matchSteps;
    });
  }, [searchQuery, selectedCategory]);

  const toggleTopic = (id: string) => {
    setExpandedTopicId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 space-y-5">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2.5">
          <Link
            href="/settings"
            className="w-8 h-8 rounded-full bg-white border border-[#E5EBE8] text-[#102B35] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs"
            aria-label="Back to settings"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-extrabold text-[#102B35]">
              Help Center & FAQs
            </h1>
            <p className="text-[11px] text-slate-500">
              Clear guides matching your live SmartCart self-checkout experience
            </p>
          </div>
        </div>

        <Link
          href="/support"
          className="flex items-center gap-1.5 bg-[#17A890]/15 text-[#17A890] hover:bg-[#17A890]/25 text-xs font-bold px-3 py-1.5 rounded-xl border border-[#17A890]/30 transition-colors"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Support</span>
        </Link>
      </div>

      {/* ─── Search Bar ─── */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search help topics (e.g., 'barcode scanner', 'exit pass', 'bill')..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5EBE8] rounded-2xl text-xs sm:text-sm text-[#102B35] placeholder:text-slate-400 outline-none focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-3 text-[10px] font-bold text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {/* ─── Category Filter Chips ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-full border shrink-0 transition-all ${
              selectedCategory === tab.id
                ? "bg-[#102B35] text-white border-[#102B35] shadow-xs"
                : "bg-white text-slate-600 border-[#E5EBE8] hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Quick Support Hero Banner ─── */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/60 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#17A890] text-[#102B35] flex items-center justify-center font-bold shrink-0">
            <BookOpen className="w-4 h-4 text-[#102B35]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#102B35]">
              Need direct in-store assistance?
            </h3>
            <p className="text-[11px] text-slate-600">
              Submit a support ticket or request staff help right from your cart.
            </p>
          </div>
        </div>

        <Link
          href="/support"
          className="bg-[#102B35] hover:bg-[#183d4a] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1"
        >
          <span>Get Help</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ─── Topics Accordion List ─── */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5EBE8] p-8 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-xs font-bold text-[#102B35]">No help topics found</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              We couldn&apos;t find matching guides for &quot;{searchQuery}&quot;. Try searching with other keywords or submit a support inquiry.
            </p>
            <div className="pt-2">
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17A890] hover:underline"
              >
                <span>Contact Customer Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className="bg-white rounded-2xl border border-[#E5EBE8] overflow-hidden shadow-xs transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#17A890] uppercase tracking-wider bg-[#17A890]/10 px-2 py-0.5 rounded-full inline-block">
                      {topic.categoryLabel}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#102B35] leading-snug">
                      {topic.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-[#F7F9F8] text-slate-400 flex items-center justify-center shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#102B35]" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#F0F4F2] space-y-3 bg-[#F7F9F8]/40 animate-in fade-in duration-150">
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {topic.summary}
                    </p>

                    {/* Step-by-Step Instructions */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#102B35] uppercase tracking-wider block">
                        Step-by-Step Guide
                      </span>
                      <ol className="space-y-1.5 text-xs text-slate-700 list-decimal pl-4">
                        {topic.steps.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Pro Tips */}
                    {topic.tips && topic.tips.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-amber-900 leading-tight">
                          <strong>Pro Tip:</strong> {topic.tips[0]}
                        </div>
                      </div>
                    )}

                    {/* Related Page Action */}
                    {topic.actionLink && (
                      <div className="pt-1 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {topic.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={topic.actionLink.href}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17A890] hover:text-[#128673] hover:underline bg-white border border-[#E5EBE8] px-3 py-1.5 rounded-xl shadow-2xs"
                        >
                          <span>{topic.actionLink.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
