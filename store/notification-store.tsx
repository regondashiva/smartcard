"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CustomerNotification,
  InAppToast,
  NotificationPreferences,
  PushSubscriptionState,
  ToastVariant,
  NotificationAction,
} from "@/types/notification";
import { useAuth } from "@/store/auth-store";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface NotificationContextValue {
  // Notifications
  notifications: CustomerNotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markRead: (ids: string[]) => Promise<void>;
  markAllRead: () => Promise<void>;
  dismiss: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;

  // Preferences
  preferences: NotificationPreferences | null;
  fetchPreferences: () => Promise<void>;
  updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<void>;

  // Push state
  pushState: PushSubscriptionState;
  requestPushPermission: () => Promise<void>;

  // In-app toasts
  toasts: InAppToast[];
  showToast: (opts: {
    variant: ToastVariant;
    title: string;
    body?: string;
    duration?: number;
    action?: NotificationAction;
  }) => void;
  dismissToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || "guest";

  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [pushState, setPushState] = useState<PushSubscriptionState>({ status: "not_requested" });
  const [toasts, setToasts] = useState<InAppToast[]>([]);

  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Fetch Notifications ──────────────────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch { /* network error — silent */ } finally {
      setIsLoading(false);
    }
  }, [userId, isAuthenticated]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const sendAction = useCallback(
    async (body: Record<string, unknown>) => {
      await fetch("/api/notifications/actions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...body }),
      });
    },
    [userId]
  );

  const markRead = useCallback(
    async (ids: string[]) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - ids.length));
      await sendAction({ action: "markRead", notificationIds: ids });
    },
    [sendAction]
  );

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await sendAction({ action: "markAllRead" });
  }, [sendAction]);

  const dismiss = useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((c) => {
        const was = notifications.find((n) => n.id === id);
        return was && !was.isRead ? Math.max(0, c - 1) : c;
      });
      await sendAction({ action: "dismiss", notificationId: id });
    },
    [sendAction, notifications]
  );

  const clearAll = useCallback(async () => {
    setNotifications([]);
    setUnreadCount(0);
    await sendAction({ action: "clearAll" });
  }, [sendAction]);

  // ─── Preferences ─────────────────────────────────────────────────────────

  const fetchPreferences = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch(`/api/settings/notifications?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setPreferences(data.preferences);
      }
    } catch { /* silent */ }
  }, [userId, isAuthenticated]);

  const updatePreferences = useCallback(
    async (updates: Partial<NotificationPreferences>) => {
      try {
        const res = await fetch("/api/settings/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, updates }),
        });
        if (res.ok) {
          const data = await res.json();
          setPreferences(data.preferences);
        }
      } catch { /* silent */ }
    },
    [userId]
  );

  // ─── Push Permission ──────────────────────────────────────────────────────

  const requestPushPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushState({ status: "unsupported" });
      return;
    }
    try {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        const state: PushSubscriptionState = { status: "granted", subscribedAt: new Date().toISOString() };
        setPushState(state);
        await updatePreferences({ pushEnabled: true });
      } else {
        setPushState({ status: "denied" });
      }
    } catch {
      setPushState({ status: "unsupported" });
    }
  }, [updatePreferences]);

  // ─── In-App Toasts ────────────────────────────────────────────────────────

  const showToast = useCallback(
    ({
      variant,
      title,
      body,
      duration = 4500,
      action,
    }: {
      variant: ToastVariant;
      title: string;
      body?: string;
      duration?: number;
      action?: NotificationAction;
    }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const toast: InAppToast = {
        id,
        variant,
        title,
        body,
        duration,
        action,
        createdAt: performance.now(),
      };
      setToasts((prev) => [...prev.slice(-4), toast]);

      if (duration && duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ─── Effects ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchPreferences();

      // Poll for new notifications every 60 seconds
      pollRef.current = setInterval(fetchNotifications, 60_000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isAuthenticated, fetchNotifications, fetchPreferences]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markRead,
        markAllRead,
        dismiss,
        clearAll,
        preferences,
        fetchPreferences,
        updatePreferences,
        pushState,
        requestPushPermission,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside <NotificationProvider>");
  return ctx;
}
