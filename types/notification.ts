// ─── Customer Notification & Alert Types ─────────────────────────────────────

export type NotificationCategory =
  | "session"         // Shopping session start/end
  | "cart"            // Cart updates and alerts
  | "verification"    // Item verification & mismatch alerts
  | "payment"         // Payment confirmations and failures
  | "order"           // Order status updates
  | "receipt"         // Digital receipts
  | "reminder"        // Shopping reminders and nudges
  | "promo"           // Promotions, offers, deals
  | "system";         // App-level system messages

export type NotificationPriority = "urgent" | "high" | "normal" | "low";

export type NotificationActionType =
  | "navigate"        // Navigate to a page
  | "add_to_cart"     // Add a product to cart
  | "dismiss"         // Just dismiss
  | "external";       // Open external URL

export interface NotificationAction {
  id: string;
  label: string;
  type: NotificationActionType;
  payload?: string;   // Route, productId, or URL depending on type
  variant?: "primary" | "secondary" | "danger";
}

export interface CustomerNotification {
  id: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  body: string;
  iconName?: string;          // Lucide icon name
  imageUrl?: string;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;          // ISO timestamp
  expiresAt?: string;         // ISO timestamp — if set, expired notifications are filtered out
  actions?: NotificationAction[];
  metadata?: Record<string, string | number | boolean>;  // Extra context (orderId, productId, etc.)
  relatedEntityId?: string;   // orderId | productId | sessionId
  relatedEntityType?: "order" | "product" | "session" | "receipt";
}

// ─── Notification Preferences ────────────────────────────────────────────────

export interface NotificationCategoryPreference {
  category: NotificationCategory;
  label: string;
  description: string;
  enabled: boolean;
  pushEnabled: boolean;       // Push notification opt-in per category
}

export interface NotificationPreferences {
  userId: string;
  masterEnabled: boolean;          // Global on/off toggle
  pushEnabled: boolean;            // Browser push notifications
  categories: NotificationCategoryPreference[];
  quietHoursEnabled: boolean;
  quietHoursStart: string;         // "22:00"
  quietHoursEnd: string;           // "07:00"
  updatedAt: string;
}

// ─── Push Subscription ───────────────────────────────────────────────────────

export type PushSubscriptionStatus =
  | "not_requested"
  | "granted"
  | "denied"
  | "unsupported";

export interface PushSubscriptionState {
  status: PushSubscriptionStatus;
  subscribedAt?: string;
}

// ─── Notification Store State ────────────────────────────────────────────────

export interface NotificationState {
  notifications: CustomerNotification[];
  preferences: NotificationPreferences;
  pushState: PushSubscriptionState;
  lastFetchedAt: string;
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface CreateNotificationPayload {
  userId: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  title: string;
  body: string;
  iconName?: string;
  imageUrl?: string;
  expiresAt?: string;
  actions?: NotificationAction[];
  metadata?: Record<string, string | number | boolean>;
  relatedEntityId?: string;
  relatedEntityType?: CustomerNotification["relatedEntityType"];
}

export interface MarkReadPayload {
  notificationIds: string[];
  userId: string;
}

export interface UpdatePreferencesPayload {
  userId: string;
  updates: Partial<Omit<NotificationPreferences, "userId" | "updatedAt">>;
}

export interface NotificationListResponse {
  notifications: CustomerNotification[];
  unreadCount: number;
  totalCount: number;
}

// ─── In-App Toast ─────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info" | "cart" | "verification";

export interface InAppToast {
  id: string;
  variant: ToastVariant;
  title: string;
  body?: string;
  duration?: number;          // ms before auto-dismiss (0 = sticky)
  action?: NotificationAction;
  createdAt: number;          // performance.now() for ordering
}
