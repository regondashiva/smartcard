import {
  CreateSupportTicketInput,
  SupportTicket,
  SupportTicketCategory,
} from "@/types/settings";
import { UserProfile } from "@/types/auth";

const TICKETS_STORAGE_KEY = "smartcart_support_tickets_v1";

const DEMO_SEED_TICKETS: SupportTicket[] = [
  {
    id: "tkt-001",
    ticketNumber: "TKT-2026-8910",
    userId: "usr_84920",
    userName: "Shiva Ramakrishna",
    userContact: "+91 98765 43210",
    category: "cart_billing",
    relatedOrderId: "SC-DEMO-9041",
    subject: "Applied discount question on Organic Brown Eggs",
    description:
      "I noticed a 14% promotional discount on the shelf tag for Eggoz Farm eggs. The live bill reflected ₹95 instead of ₹110, which matches, but I wanted to verify if SmartClub Gold additional points were credited.",
    createdAt: "2026-10-22T19:15:00.000Z",
    updatedAt: "2026-10-22T19:40:00.000Z",
    status: "resolved",
    priority: "normal",
    resolutionNotes:
      "SmartClub Gold points (15 points) have been successfully attributed to your membership account wallet.",
  },
];

export function getStoredSupportTickets(): SupportTicket[] {
  if (typeof window === "undefined") return DEMO_SEED_TICKETS;
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Return seed on error
  }
  return DEMO_SEED_TICKETS;
}

export function saveStoredSupportTickets(tickets: SupportTicket[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // Ignore storage errors
  }
}

export function createSupportTicket(
  input: CreateSupportTicketInput,
  user: UserProfile | null
): SupportTicket {
  const existing = getStoredSupportTickets();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toISOString();

  const newTicket: SupportTicket = {
    id: `tkt-${Date.now()}`,
    ticketNumber: `TKT-2026-${randNum}`,
    userId: user?.id || "guest-user",
    userName: user?.name || "Shopper",
    userContact: input.userContact || user?.phone || user?.email || "In-App Customer",
    category: input.category,
    relatedOrderId: input.relatedOrderId || undefined,
    subject: input.subject.trim(),
    description: input.description.trim(),
    createdAt: now,
    updatedAt: now,
    status: "open",
    priority:
      input.category === "payment_issue" || input.category === "receipt_exit_qr"
        ? "high"
        : "normal",
    resolutionNotes:
      "Ticket registered in store support queue (Demo Mode). Our store manager desk will review this during active shopping hours.",
  };

  const updated = [newTicket, ...existing];
  saveStoredSupportTickets(updated);
  return newTicket;
}

export const SUPPORT_CATEGORIES: {
  id: SupportTicketCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "product_catalogue",
    label: "Product or Catalogue Issue",
    description: "Missing product, incorrect barcode, or stock discrepancy",
  },
  {
    id: "cart_billing",
    label: "Cart or Billing Discrepancy",
    description: "Price mismatch, quantity issue, or discount inquiry",
  },
  {
    id: "verification_discrepancy",
    label: "Item Verification or Scale Weight",
    description: "Physical scale weight mismatch or security alert",
  },
  {
    id: "payment_issue",
    label: "Payment or Transaction Issue",
    description: "UPI pending, card charge failed, or double debit",
  },
  {
    id: "receipt_exit_qr",
    label: "Receipt or Exit Pass Question",
    description: "QR gate scanning issue or receipt retrieval problem",
  },
  {
    id: "account_access",
    label: "Account & Profile Support",
    description: "Login, phone verification, or data preferences",
  },
  {
    id: "other",
    label: "General In-Store Inquiry",
    description: "Store facilities, assistance, or customer feedback",
  },
];
