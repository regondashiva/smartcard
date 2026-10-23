export interface ShoppingPreferences {
  preferredCategories: string[];
  preferredLanguage: "en" | "hi" | "kn" | "te";
  currencyDisplay: "INR" | "USD" | "EUR";
  enablePersonalizedRecommendations: boolean;
  enableShoppingReminders: boolean;
  enableBudgetAlerts: boolean;
  dataAnalyticsSharing: boolean;
  themePreference: "system" | "light";
}

export type SupportTicketCategory =
  | "product_catalogue"
  | "cart_billing"
  | "verification_discrepancy"
  | "payment_issue"
  | "receipt_exit_qr"
  | "account_access"
  | "other";

export type SupportTicketStatus = "open" | "in_review" | "resolved" | "closed";

export type SupportTicketPriority = "low" | "normal" | "high" | "urgent";

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userContact: string;
  category: SupportTicketCategory;
  relatedOrderId?: string;
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  resolutionNotes?: string;
}

export interface CreateSupportTicketInput {
  category: SupportTicketCategory;
  relatedOrderId?: string;
  subject: string;
  description: string;
  userContact?: string;
}

export interface HelpTopic {
  id: string;
  category:
    | "getting-started"
    | "smart-cart"
    | "payments-orders"
    | "exit-validation"
    | "account-notifications";
  categoryLabel: string;
  title: string;
  summary: string;
  steps: string[];
  tips?: string[];
  actionLink?: {
    label: string;
    href: string;
  };
  tags: string[];
}
