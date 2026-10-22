import {
  CustomerNotification,
  NotificationCategory,
  NotificationPreferences,
  NotificationState,
  CreateNotificationPayload,
  PushSubscriptionState,
  NotificationCategoryPreference,
} from "@/types/notification";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "smartcart_notifications";
const PREFERENCES_KEY = "smartcart_notification_prefs";
const PUSH_STATE_KEY = "smartcart_push_state";
const MAX_NOTIFICATIONS = 100;

// ─── Default Category Preferences ────────────────────────────────────────────

const DEFAULT_CATEGORY_PREFS: NotificationCategoryPreference[] = [
  {
    category: "session",
    label: "Shopping Sessions",
    description: "Session start, cart association, and session end",
    enabled: true,
    pushEnabled: true,
  },
  {
    category: "cart",
    label: "Cart Updates",
    description: "Items added, removed, or modified in your cart",
    enabled: true,
    pushEnabled: false,
  },
  {
    category: "verification",
    label: "Cart Verification & Alerts",
    description: "Mismatch alerts and verification results",
    enabled: true,
    pushEnabled: true,
  },
  {
    category: "payment",
    label: "Payments",
    description: "Payment confirmations, failures, and retries",
    enabled: true,
    pushEnabled: true,
  },
  {
    category: "order",
    label: "Orders",
    description: "Order status changes and updates",
    enabled: true,
    pushEnabled: true,
  },
  {
    category: "receipt",
    label: "Receipts",
    description: "Digital receipt generation and download",
    enabled: true,
    pushEnabled: false,
  },
  {
    category: "reminder",
    label: "Shopping Reminders",
    description: "Reminders about your cart, deals, and shopping habits",
    enabled: true,
    pushEnabled: false,
  },
  {
    category: "promo",
    label: "Promotions & Offers",
    description: "Deals, discounts, and personalised offers",
    enabled: true,
    pushEnabled: false,
  },
  {
    category: "system",
    label: "System Updates",
    description: "App updates and important system messages",
    enabled: true,
    pushEnabled: false,
  },
];

function makeDefaultPreferences(userId: string): NotificationPreferences {
  return {
    userId,
    masterEnabled: true,
    pushEnabled: false,
    categories: DEFAULT_CATEGORY_PREFS.map((c) => ({ ...c })),
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    updatedAt: new Date().toISOString(),
  };
}

// ─── ID Generation ────────────────────────────────────────────────────────────

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── In-Memory Store (Server-side) ───────────────────────────────────────────
// Keys: userId → notifications[]
const serverStore = new Map<string, CustomerNotification[]>();
const preferencesStore = new Map<string, NotificationPreferences>();

// ─── Seed Notifications ───────────────────────────────────────────────────────

function buildSeedNotifications(userId: string): CustomerNotification[] {
  const now = Date.now();
  return [
    {
      id: generateId(),
      category: "system",
      priority: "normal",
      title: "Welcome to SmartCart AI!",
      body: "Your intelligent self-checkout companion is ready. Scan products, track your bill live, and enjoy a queue-free shopping experience.",
      iconName: "Sparkles",
      isRead: false,
      isDismissed: false,
      createdAt: new Date(now - 10 * 60 * 1000).toISOString(),
      actions: [{ id: "go_home", label: "Start Shopping", type: "navigate", payload: "/", variant: "primary" }],
    },
    {
      id: generateId(),
      category: "promo",
      priority: "normal",
      title: "Weekend Deal Alert 🛒",
      body: "Get up to 20% off on Dairy & Eggs this weekend. Add products to your cart and savings are applied automatically.",
      iconName: "Tag",
      isRead: false,
      isDismissed: false,
      createdAt: new Date(now - 25 * 60 * 1000).toISOString(),
      actions: [{ id: "explore_deals", label: "Explore Deals", type: "navigate", payload: "/explore", variant: "primary" }],
    },
    {
      id: generateId(),
      category: "reminder",
      priority: "low",
      title: "Don't Forget Your Staples",
      body: "Based on your purchase history, you usually buy Rice & Atta around this time. Check your favourites!",
      iconName: "Clock",
      isRead: true,
      isDismissed: false,
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      actions: [{ id: "view_history", label: "View My Shopping", type: "navigate", payload: "/my-shopping", variant: "secondary" }],
    },
    {
      id: generateId(),
      category: "session",
      priority: "high",
      title: "Shopping Session Active",
      body: "Your SmartCart session has started. Scan barcodes to add items — your bill updates in real time.",
      iconName: "ShoppingCart",
      isRead: true,
      isDismissed: false,
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// ─── Core Service Functions ───────────────────────────────────────────────────

export function getNotificationsForUser(userId: string): CustomerNotification[] {
  if (!serverStore.has(userId)) {
    serverStore.set(userId, buildSeedNotifications(userId));
  }
  const all = serverStore.get(userId) || [];
  // Filter expired and dismissed
  const now = new Date().toISOString();
  return all
    .filter((n) => !n.isDismissed)
    .filter((n) => !n.expiresAt || n.expiresAt > now)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadCount(userId: string): number {
  return getNotificationsForUser(userId).filter((n) => !n.isRead).length;
}

export function createNotification(payload: CreateNotificationPayload): CustomerNotification {
  const { userId, ...rest } = payload;
  const notif: CustomerNotification = {
    id: generateId(),
    priority: "normal",
    isRead: false,
    isDismissed: false,
    createdAt: new Date().toISOString(),
    ...rest,
  };

  if (!serverStore.has(userId)) {
    serverStore.set(userId, buildSeedNotifications(userId));
  }

  const existing = serverStore.get(userId)!;
  existing.unshift(notif);

  // Trim to max
  if (existing.length > MAX_NOTIFICATIONS) {
    existing.splice(MAX_NOTIFICATIONS);
  }
  serverStore.set(userId, existing);

  return notif;
}

export function markNotificationsRead(userId: string, notificationIds: string[]): void {
  if (!serverStore.has(userId)) return;
  const all = serverStore.get(userId)!;
  const idSet = new Set(notificationIds);
  all.forEach((n) => {
    if (idSet.has(n.id)) n.isRead = true;
  });
  serverStore.set(userId, all);
}

export function markAllRead(userId: string): void {
  if (!serverStore.has(userId)) return;
  const all = serverStore.get(userId)!;
  all.forEach((n) => { n.isRead = true; });
  serverStore.set(userId, all);
}

export function dismissNotification(userId: string, notificationId: string): void {
  if (!serverStore.has(userId)) return;
  const all = serverStore.get(userId)!;
  const n = all.find((n) => n.id === notificationId);
  if (n) n.isDismissed = true;
  serverStore.set(userId, all);
}

export function clearAllNotifications(userId: string): void {
  if (!serverStore.has(userId)) return;
  const all = serverStore.get(userId)!;
  all.forEach((n) => { n.isDismissed = true; });
  serverStore.set(userId, all);
}

// ─── Preferences ─────────────────────────────────────────────────────────────

export function getPreferences(userId: string): NotificationPreferences {
  if (!preferencesStore.has(userId)) {
    preferencesStore.set(userId, makeDefaultPreferences(userId));
  }
  return preferencesStore.get(userId)!;
}

export function updatePreferences(
  userId: string,
  updates: Partial<Omit<NotificationPreferences, "userId" | "updatedAt">>
): NotificationPreferences {
  const current = getPreferences(userId);
  const updated: NotificationPreferences = {
    ...current,
    ...updates,
    userId,
    updatedAt: new Date().toISOString(),
  };
  preferencesStore.set(userId, updated);
  return updated;
}

// ─── Client-side localStorage Helpers (called from context/hooks) ─────────────

export function getLocalNotificationState(): NotificationState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const prefsRaw = localStorage.getItem(PREFERENCES_KEY);
    const pushRaw = localStorage.getItem(PUSH_STATE_KEY);

    const notifications: CustomerNotification[] = raw ? JSON.parse(raw) : [];
    const preferences: NotificationPreferences | null = prefsRaw ? JSON.parse(prefsRaw) : null;
    const pushState: PushSubscriptionState = pushRaw
      ? JSON.parse(pushRaw)
      : { status: "not_requested" };

    return {
      notifications,
      preferences: preferences || makeDefaultPreferences("guest"),
      pushState,
      lastFetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveLocalNotifications(notifications: CustomerNotification[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch { /* storage full — ignore */ }
}

export function saveLocalPreferences(prefs: NotificationPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  } catch { /* storage full — ignore */ }
}

export function saveLocalPushState(state: PushSubscriptionState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PUSH_STATE_KEY, JSON.stringify(state));
  } catch { /* storage full — ignore */ }
}

// ─── Notification Factory Helpers (used by app modules) ──────────────────────

export const NotificationFactory = {
  sessionStarted(userId: string, storeName: string, cartTag: string): CreateNotificationPayload {
    return {
      userId,
      category: "session",
      priority: "high",
      title: "Shopping Session Started",
      body: `Cart #${cartTag} is now active at ${storeName}. Scan items to begin adding products.`,
      iconName: "ShoppingCart",
      relatedEntityType: "session",
      relatedEntityId: cartTag,
      actions: [{ id: "go_scan", label: "Start Scanning", type: "navigate", payload: "/scan", variant: "primary" }],
    };
  },

  cartItemAdded(userId: string, productName: string, qty: number): CreateNotificationPayload {
    return {
      userId,
      category: "cart",
      priority: "low",
      title: "Item Added to Cart",
      body: `${productName} ×${qty} has been added to your cart.`,
      iconName: "PackagePlus",
      actions: [{ id: "view_cart", label: "View Cart", type: "navigate", payload: "/cart", variant: "secondary" }],
    };
  },

  verificationMismatch(userId: string, itemName: string): CreateNotificationPayload {
    return {
      userId,
      category: "verification",
      priority: "urgent",
      title: "Cart Mismatch Detected",
      body: `A discrepancy was found for "${itemName}". Please review before checkout.`,
      iconName: "AlertTriangle",
      actions: [{ id: "view_cart", label: "Review Cart", type: "navigate", payload: "/cart", variant: "danger" }],
    };
  },

  verificationPassed(userId: string): CreateNotificationPayload {
    return {
      userId,
      category: "verification",
      priority: "normal",
      title: "Cart Verified ✓",
      body: "All items in your cart have been verified. You're ready to proceed to checkout.",
      iconName: "ShieldCheck",
      actions: [{ id: "checkout", label: "Go to Checkout", type: "navigate", payload: "/checkout", variant: "primary" }],
    };
  },

  paymentSuccess(userId: string, orderId: string, amount: number): CreateNotificationPayload {
    return {
      userId,
      category: "payment",
      priority: "high",
      title: "Payment Successful ✓",
      body: `₹${amount.toFixed(2)} paid successfully. Your order #${orderId} is confirmed.`,
      iconName: "CheckCircle2",
      relatedEntityId: orderId,
      relatedEntityType: "order",
      actions: [
        { id: "view_receipt", label: "View Receipt", type: "navigate", payload: `/receipts/${orderId}`, variant: "primary" },
      ],
    };
  },

  paymentFailed(userId: string, amount: number): CreateNotificationPayload {
    return {
      userId,
      category: "payment",
      priority: "urgent",
      title: "Payment Failed",
      body: `Your payment of ₹${amount.toFixed(2)} could not be processed. Please try again.`,
      iconName: "XCircle",
      actions: [{ id: "retry_checkout", label: "Retry Payment", type: "navigate", payload: "/checkout", variant: "danger" }],
    };
  },

  receiptReady(userId: string, orderId: string, receiptNumber: string): CreateNotificationPayload {
    return {
      userId,
      category: "receipt",
      priority: "normal",
      title: "Your Receipt is Ready",
      body: `Receipt #${receiptNumber} for order #${orderId} is available to view or download.`,
      iconName: "Receipt",
      relatedEntityId: orderId,
      relatedEntityType: "receipt",
      actions: [{ id: "view_receipt", label: "View Receipt", type: "navigate", payload: `/receipts/${orderId}`, variant: "primary" }],
    };
  },

  exitQrReady(userId: string, orderId: string): CreateNotificationPayload {
    return {
      userId,
      category: "order",
      priority: "high",
      title: "Exit QR Code Ready",
      body: "Your exit pass has been generated. Show this at the store exit gate.",
      iconName: "QrCode",
      relatedEntityId: orderId,
      relatedEntityType: "order",
      actions: [{ id: "view_exit", label: "Show Exit Pass", type: "navigate", payload: `/receipts/${orderId}`, variant: "primary" }],
    };
  },

  promoAlert(userId: string, title: string, body: string): CreateNotificationPayload {
    return {
      userId,
      category: "promo",
      priority: "low",
      title,
      body,
      iconName: "Tag",
      actions: [{ id: "explore", label: "Explore Deals", type: "navigate", payload: "/explore", variant: "secondary" }],
    };
  },
};
