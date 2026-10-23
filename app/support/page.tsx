"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth-store";
import { getFullOrders } from "@/lib/receipt-service";
import {
  createSupportTicket,
  getStoredSupportTickets,
  SUPPORT_CATEGORIES,
} from "@/lib/support-service";
import {
  SupportTicket,
  SupportTicketCategory,
  CreateSupportTicketInput,
} from "@/types/settings";
import { DigitalReceipt } from "@/types/receipt";
import {
  Headphones,
  ChevronLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Package,
  Receipt,
  FileQuestion,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function SupportPage() {
  const { user, isAuthenticated } = useAuth();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [orders, setOrders] = useState<DigitalReceipt[]>([]);
  const [category, setCategory] = useState<SupportTicketCategory>("cart_billing");
  const [relatedOrderId, setRelatedOrderId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");

  useEffect(() => {
    setTickets(getStoredSupportTickets());
    const loadedOrders = getFullOrders();
    setOrders(loadedOrders);
    if (user?.phone || user?.email) {
      setContactInfo(user.phone || user.email);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!subject.trim() || subject.trim().length < 4) {
      setFormError("Please provide a concise subject (at least 4 characters).");
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setFormError("Please provide a detailed description (at least 10 characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      const input: CreateSupportTicketInput = {
        category,
        relatedOrderId: relatedOrderId || undefined,
        subject,
        description,
        userContact: contactInfo,
      };

      const ticket = createSupportTicket(input, user);
      setTickets((prev) => [ticket, ...prev]);
      setSubmittedTicket(ticket);
      setSubject("");
      setDescription("");
      setRelatedOrderId("");
      setActiveTab("history");
    } catch {
      setFormError("Failed to submit support inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 space-y-5">
      {/* ─── Top Header ─── */}
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
              Customer Support & Assistance
            </h1>
            <p className="text-[11px] text-slate-500">
              Direct store desk tickets and live shopping resolution
            </p>
          </div>
        </div>

        <Link
          href="/help"
          className="flex items-center gap-1.5 text-xs font-bold text-[#17A890] hover:underline"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQs</span>
        </Link>
      </div>

      {/* ─── Service Notice Banner ─── */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-teal-900 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-[#17A890] shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-snug">
          <p className="font-bold">
            Store Attendant Desk • Demo Support Service
          </p>
          <p className="text-[11px] text-teal-800">
            For urgent in-aisle weight discrepancies or turnstile gate assistance, you can also use{" "}
            <Link
              href="/cart/verification"
              className="font-bold underline text-[#102B35] hover:text-[#17A890]"
            >
              Cart Verification Staff Assistance
            </Link>.
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex border-b border-[#E5EBE8]">
        <button
          onClick={() => setActiveTab("new")}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "new"
              ? "border-[#17A890] text-[#17A890]"
              : "border-transparent text-slate-500 hover:text-[#102B35]"
          }`}
        >
          Submit Support Request
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === "history"
              ? "border-[#17A890] text-[#17A890]"
              : "border-transparent text-slate-500 hover:text-[#102B35]"
          }`}
        >
          <span>My Tickets</span>
          <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
            {tickets.length}
          </span>
        </button>
      </div>

      {/* Success Notification after submission */}
      {submittedTicket && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <h3 className="text-xs font-bold">
              Support Ticket #{submittedTicket.ticketNumber} Registered!
            </h3>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            Your inquiry has been placed into the store manager&apos;s support queue. A representative will review the transaction details shortly.
          </p>
          <button
            onClick={() => setSubmittedTicket(null)}
            className="text-[10px] font-bold text-emerald-800 hover:underline block pt-1"
          >
            Dismiss message
          </button>
        </div>
      )}

      {/* ─── TAB 1: New Ticket Form ─── */}
      {activeTab === "new" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-4"
        >
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-[#102B35] uppercase tracking-wider">
              Create a Support Request
            </h2>
            <p className="text-[11px] text-slate-500">
              Provide details regarding your in-store trip, product, or billing query.
            </p>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Issue Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#102B35] block">
              Issue Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SupportTicketCategory)}
              className="w-full text-xs font-medium text-[#102B35] bg-[#F7F9F8] border border-[#E5EBE8] rounded-xl px-3 py-2.5 outline-none focus:border-[#17A890]"
            >
              {SUPPORT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Related Order (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#102B35] flex items-center justify-between">
              <span>Related Order / Receipt (Optional)</span>
              <span className="text-[10px] font-normal text-slate-400">
                Helps us pull live line items
              </span>
            </label>
            {orders.length > 0 ? (
              <select
                value={relatedOrderId}
                onChange={(e) => setRelatedOrderId(e.target.value)}
                className="w-full text-xs font-medium text-[#102B35] bg-[#F7F9F8] border border-[#E5EBE8] rounded-xl px-3 py-2.5 outline-none focus:border-[#17A890]"
              >
                <option value="">No specific order selected</option>
                {orders.map((o) => (
                  <option key={o.orderId} value={o.orderId}>
                    {o.orderId} • ₹{o.finalAmount} ({new Date(o.purchaseDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={relatedOrderId}
                onChange={(e) => setRelatedOrderId(e.target.value)}
                placeholder="e.g. SC-DEMO-9041"
                className="w-full text-xs text-[#102B35] bg-[#F7F9F8] border border-[#E5EBE8] rounded-xl px-3 py-2.5 outline-none focus:border-[#17A890]"
              />
            )}
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#102B35] block">
              Subject Summary <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Discrepancy on Greek Yogurt bill or exit gate error"
              maxLength={120}
              className="w-full text-xs text-[#102B35] bg-[#F7F9F8] border border-[#E5EBE8] rounded-xl px-3 py-2.5 outline-none focus:border-[#17A890]"
            />
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#102B35]">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">
                {description.length}/1000 characters
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Please explain the issue encountered in the aisle, scanner, or payment flow so our staff can assist quickly..."
              className="w-full text-xs text-[#102B35] bg-[#F7F9F8] border border-[#E5EBE8] rounded-xl p-3 outline-none focus:border-[#17A890]"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#102B35] block">
              Contact Phone or Email
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="+91 98765 43210 or your email"
              className="w-full text-xs text-[#102B35] bg-[#F7F9F8] border border-[#E5EBE8] rounded-xl px-3 py-2.5 outline-none focus:border-[#17A890]"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#17A890] hover:bg-[#128673] disabled:bg-slate-200 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>
              {isSubmitting ? "Submitting Inquiry..." : "Submit Support Ticket"}
            </span>
          </button>
        </form>
      )}

      {/* ─── TAB 2: Ticket History ─── */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5EBE8] p-8 text-center space-y-2">
              <FileQuestion className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-xs font-bold text-[#102B35]">No support tickets yet</h3>
              <p className="text-[11px] text-slate-500">
                You haven&apos;t filed any inquiries. Use the &apos;Submit Support Request&apos; tab if you require assistance.
              </p>
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-[#E5EBE8] p-4 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-[#102B35]">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          t.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "in_review"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Filed on {new Date(t.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {t.category.replace("_", " ")}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#102B35] leading-snug">
                  {t.subject}
                </h4>

                <p className="text-xs text-slate-600 bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E5EBE8] leading-relaxed">
                  {t.description}
                </p>

                {t.relatedOrderId && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Receipt className="w-3.5 h-3.5 text-[#17A890]" />
                    <span>Referenced Order: <strong>{t.relatedOrderId}</strong></span>
                  </div>
                )}

                {t.resolutionNotes && (
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                      Store Attendant Resolution Notes:
                    </span>
                    <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                      {t.resolutionNotes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
