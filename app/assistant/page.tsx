"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import { getFullOrders } from "@/lib/receipt-service";
import { Product } from "@/types/product";
import { AssistantMessage, AssistantResponse } from "@/types/assistant";
import { ProductRecommendationCard } from "@/components/assistant/product-recommendation-card";
import { ProductComparisonCard } from "@/components/assistant/product-comparison-card";
import { ShoppingListProposalCard } from "@/components/assistant/shopping-list-proposal-card";
import { TypingIndicator } from "@/components/assistant/typing-indicator";
import { ProductPreviewModal } from "@/components/products/product-preview-modal";
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  User as UserIcon,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Store,
  Flame,
  Zap,
  TrendingDown,
} from "lucide-react";

const STARTER_QUESTIONS = [
  { text: "Recommend products under ₹500", icon: TrendingDown, color: "text-emerald-600 bg-emerald-50" },
  { text: "Compare Amul Milk and Greek Yogurt", icon: Zap, color: "text-amber-600 bg-amber-50" },
  { text: "Build a weekly grocery list under ₹1,000", icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
  { text: "Show products I frequently buy", icon: Flame, color: "text-purple-600 bg-purple-50" },
];

const INITIAL_GREETING: AssistantMessage = {
  id: "msg-welcome-001",
  role: "assistant",
  content:
    "Hello! I'm your **SmartCart AI Shopping Assistant**.\n\nI can help you search our store catalogue in plain English, recommend items within your budget, compare products side-by-side, or build a curated shopping list using live supermarket inventory.\n\nHow can I help you shop today?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  isDemoMode: true,
  suggestedQuestions: [
    "Recommend products under ₹500",
    "Compare Amul Milk and Greek Yogurt",
    "Build a weekly grocery list under ₹1,000",
    "Show products I frequently buy",
  ],
};

export default function AssistantPage() {
  const { user } = useAuth();
  const { selectedStore } = useCart();

  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_GREETING]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    setError(null);
    setLastFailedQuery(null);
    setInputText("");

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setIsLoading(true);

    try {
      const orders = getFullOrders();
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: nextHistory,
          orders,
          userId: user?.id || "guest-user",
        }),
      });

      if (!res.ok) {
        throw new Error("Assistant response failed");
      }

      const data: AssistantResponse = await res.json();

      const assistantMessage: AssistantMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        intentType: data.intentType,
        isDemoMode: data.isDemoMode,
        productCards: data.productCards,
        comparison: data.comparison,
        shoppingList: data.shoppingList,
        suggestedQuestions: data.suggestedQuestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch response from shopping assistant. Please check your connection or retry.");
      setLastFailedQuery(textToSend);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    setMessages([INITIAL_GREETING]);
    setError(null);
    setLastFailedQuery(null);
    setInputText("");
    if (inputRef.current) inputRef.current.focus();
  };

  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-extrabold text-[#102B35]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className="-mx-4 -mt-3 min-h-screen bg-[#F6F8F7] flex flex-col justify-between"
      style={{ marginBottom: "calc(-5rem - env(safe-area-inset-bottom, 16px))" }}
    >
      {/* ─── Dedicated Native App Header ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2EBE6] px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-[#F4F8F6] hover:bg-[#E9F3EF] border border-[#DCE7E1] flex items-center justify-center text-[#102B35] transition-all cursor-pointer shadow-2xs active:scale-95"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 text-[#102B35]" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#083D33] to-[#17A890] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-[#102B35] tracking-tight leading-tight">
                  SmartCart AI
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-[#718096] font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[150px] sm:max-w-xs">
                  {selectedStore.name || "SmartCart Supermarket"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleResetConversation}
          title="Start New Conversation"
          aria-label="Start New Conversation"
          className="flex items-center gap-1.5 text-xs font-bold text-[#4A5568] hover:text-[#102B35] bg-[#F4F8F6] hover:bg-[#E9F3EF] px-3 py-1.5 rounded-xl border border-[#DCE7E1] transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#17A890]" />
          <span>New Chat</span>
        </button>
      </header>

      {/* ─── Chat Message Stream ─── */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 pt-3 pb-28 space-y-4">
        {/* Subtle Inventory Verified Tag */}
        <div className="flex justify-center pt-1">
          <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-xs border border-[#E2EBE6] text-[#5A6E7D] px-3 py-1 rounded-full text-[10px] font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#17A890]" />
            <span>Verified with live aisle catalogue &amp; in-store pricing</span>
          </div>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#083D33] to-[#12584E] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot className="w-4 h-4 text-emerald-300" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-3xl p-4 shadow-2xs transition-all ${
                  isUser
                    ? "bg-gradient-to-br from-[#083D33] to-[#0A4D42] text-white rounded-tr-xs"
                    : "bg-white border border-[#E2EBE6] text-[#2D3748] rounded-tl-xs shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                }`}
              >
                {/* Text Content */}
                <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-medium">
                  {renderFormattedContent(msg.content)}
                </div>

                {/* Embedded Product Recommendation Cards */}
                {msg.productCards && msg.productCards.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-[#F0F4F2]">
                    <div className="text-[11px] font-extrabold text-[#102B35] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#17A890]" />
                      <span>Recommended Products ({msg.productCards.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.productCards.map((card) => (
                        <ProductRecommendationCard
                          key={card.product.id}
                          card={card}
                          onPreview={(prod) => setPreviewProduct(prod)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Embedded Side-by-Side Product Comparison */}
                {msg.comparison && (
                  <div className="mt-4 pt-3 border-t border-[#F0F4F2]">
                    <ProductComparisonCard comparison={msg.comparison} />
                  </div>
                )}

                {/* Embedded Shopping List Proposal */}
                {msg.shoppingList && (
                  <div className="mt-4 pt-3 border-t border-[#F0F4F2]">
                    <ShoppingListProposalCard proposal={msg.shoppingList} />
                  </div>
                )}

                {/* Suggested follow-up prompt chips */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-[#F0F4F2] flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        disabled={isLoading}
                        className="text-[11px] font-bold bg-[#F0FAF7] hover:bg-[#E2F5EF] text-[#083D33] border border-[#CDEAE1] rounded-full px-3 py-1.5 transition-all flex items-center gap-1.5 text-left disabled:opacity-50 active:scale-95 shadow-2xs cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#17A890]" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[9px] mt-2 flex items-center justify-end font-semibold ${
                    isUser ? "text-emerald-200/80" : "text-[#A0AEC0]"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-[#17A890] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-red-800 text-xs shadow-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{error}</p>
                {lastFailedQuery && (
                  <p className="text-[11px] text-red-600 mt-0.5">
                    Query: &quot;{lastFailedQuery}&quot;
                  </p>
                )}
              </div>
            </div>
            {lastFailedQuery && (
              <button
                onClick={() => handleSendMessage(lastFailedQuery)}
                className="bg-red-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl hover:bg-red-700 shrink-0 active:scale-95 transition-all"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Starter Prompts Cards (when starting conversation) */}
        {messages.length <= 1 && (
          <div className="pt-2">
            <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-2.5 px-1">
              Suggested Questions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STARTER_QUESTIONS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.text)}
                    disabled={isLoading}
                    className="p-3 rounded-2xl bg-white hover:bg-[#F0FAF7] border border-[#E2EBE6] hover:border-[#17A890]/40 transition-all flex items-center gap-3 text-left group shadow-2xs active:scale-98 cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#102B35] flex-1 leading-snug">
                      {item.text}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#17A890] transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Fixed Bottom Composer (Pinned cleanly to bottom-0) ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2EBE6] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,8px))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about groceries, prices, comparisons, recipes…"
                maxLength={500}
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3.5 bg-[#F6F8F7] border border-[#DCE4E0] focus:border-[#17A890] focus:bg-white focus:ring-2 focus:ring-[#17A890]/20 rounded-2xl text-xs sm:text-sm text-[#102B35] placeholder:text-[#A0AEC0] outline-none transition-all disabled:opacity-50 font-medium"
              />
              {inputText.length > 350 && (
                <span className="absolute right-3 top-3.5 text-[10px] text-slate-400 font-mono">
                  {500 - inputText.length}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              aria-label="Send message"
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#083D33] to-[#17A890] hover:from-[#063028] hover:to-[#0f8b76] disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 flex items-center justify-center shrink-0 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Product preview modal */}
      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </div>
  );
}
