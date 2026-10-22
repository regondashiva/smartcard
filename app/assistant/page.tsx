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
  HelpCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const STARTER_QUESTIONS = [
  "Help me find products for my shopping list.",
  "Recommend products under ₹500.",
  "Compare Amul Milk and Greek Yogurt.",
  "What can I buy within my budget?",
  "Recommend alternatives to Farm Fresh Eggs.",
  "Show products I frequently buy.",
];

const INITIAL_GREETING: AssistantMessage = {
  id: "msg-welcome-001",
  role: "assistant",
  content:
    "Hello! I'm your **SmartCart AI Shopping Assistant**. I can help you search our store catalogue in plain English, recommend items within your budget, compare products side-by-side, or build a curated shopping list using live supermarket inventory.\n\nHow can I help you shop today?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  isDemoMode: true,
  suggestedQuestions: [
    "Recommend products under ₹500",
    "Compare Amul Milk and Greek Yogurt",
    "Show products I frequently buy",
    "Build a shopping list under ₹1,000",
  ],
};

export default function AssistantPage() {
  const { user, isAuthenticated } = useAuth();
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
    // Basic bold markdown parser for display
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-[#102B35]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col max-w-3xl mx-auto px-3 sm:px-4 pb-24 pt-2">
      {/* ─── Top Header Bar ─── */}
      <div className="bg-white rounded-2xl border border-[#E5EBE8] p-3.5 mb-3 shadow-xs flex items-center justify-between sticky top-16 z-30 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-[#F7F9F8] hover:bg-[#EEF2F0] border border-[#E5EBE8] flex items-center justify-center text-[#102B35] transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#102B35] to-[#17A890] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-[#25d3b6]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-[#102B35] tracking-tight">
                  SmartCart AI Assistant
                </h1>
                <span className="bg-[#17A890]/15 text-[#17A890] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#17A890]/30">
                  Demo
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Live Store Shelves • {selectedStore.name}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleResetConversation}
          title="Start New Conversation"
          aria-label="Start New Conversation"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#102B35] bg-[#F7F9F8] hover:bg-[#EEF2F0] px-2.5 py-1.5 rounded-xl border border-[#E5EBE8] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* ─── Assistant Info Banner ─── */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 mb-3 flex items-start gap-2 text-[11px] text-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Authoritative Retail Companion:</strong> Product prices, pack sizes, and availability are verified directly against our live catalogue. Proposals remain suggestions until you add them to your cart.
        </p>
      </div>

      {/* ─── Chat Stream ─── */}
      <div className="flex-1 space-y-4 py-2">
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
                <div className="w-8 h-8 rounded-full bg-[#102B35] text-[#17A890] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 shadow-xs ${
                  isUser
                    ? "bg-[#102B35] text-white rounded-tr-xs"
                    : "bg-white border border-[#E5EBE8] text-slate-700 rounded-tl-xs"
                }`}
              >
                {/* Text Content */}
                <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-normal">
                  {renderFormattedContent(msg.content)}
                </div>

                {/* Embedded Product Recommendation Cards */}
                {msg.productCards && msg.productCards.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-[#E5EBE8]">
                    <div className="text-[11px] font-bold text-[#102B35] uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                  <div className="mt-3.5 pt-2 border-t border-[#E5EBE8]">
                    <ProductComparisonCard comparison={msg.comparison} />
                  </div>
                )}

                {/* Embedded Shopping List Proposal */}
                {msg.shoppingList && (
                  <div className="mt-3.5 pt-2 border-t border-[#E5EBE8]">
                    <ShoppingListProposalCard proposal={msg.shoppingList} />
                  </div>
                )}

                {/* Suggested follow-up chips */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        disabled={isLoading}
                        className="text-[11px] font-medium bg-[#F7F9F8] hover:bg-[#EEF2F0] text-[#102B35] border border-[#E5EBE8] rounded-full px-2.5 py-1 transition-colors flex items-center gap-1 text-left disabled:opacity-50"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#17A890]" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[9px] mt-2 flex items-center justify-end ${
                    isUser ? "text-slate-300" : "text-slate-400"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-[#17A890] text-[#102B35] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        {/* Error and retry state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start justify-between gap-3 text-red-800 text-xs animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
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
                className="bg-red-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg hover:bg-red-700 shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Suggested Starter Questions (when few messages) ─── */}
      {messages.length <= 2 && (
        <div className="my-3 bg-white rounded-2xl border border-[#E5EBE8] p-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#102B35] mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#17A890]" />
            <span>Try asking the assistant:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {STARTER_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-left p-2 rounded-xl bg-[#F7F9F8] hover:bg-teal-50/70 border border-[#E5EBE8] text-[11px] font-medium text-slate-700 hover:text-[#102B35] transition-colors flex items-center justify-between group disabled:opacity-50"
              >
                <span>&quot;{q}&quot;</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-[#17A890] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Fixed Composer at Bottom ─── */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5EBE8] p-3 shadow-[0_-4px_15px_rgba(0,0,0,0.04)]">
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
                placeholder="Ask about products, budget, comparisons, or shopping lists..."
                maxLength={500}
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 bg-[#F7F9F8] border border-[#E5EBE8] focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 rounded-2xl text-xs sm:text-sm text-[#102B35] placeholder:text-slate-400 outline-none transition-all disabled:opacity-50"
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
              className="w-11 h-11 rounded-2xl bg-[#17A890] hover:bg-[#138975] disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center shrink-0 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:active:scale-100"
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
