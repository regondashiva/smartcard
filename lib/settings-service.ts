import { ShoppingPreferences } from "@/types/settings";
import { UserProfile } from "@/types/auth";
import { DigitalReceipt } from "@/types/receipt";

const PREFERENCES_STORAGE_KEY = "smartcart_shopping_preferences_v1";

export const DEFAULT_PREFERENCES: ShoppingPreferences = {
  preferredCategories: ["dairy-eggs", "fruits-vegetables", "snacks"],
  preferredLanguage: "en",
  currencyDisplay: "INR",
  enablePersonalizedRecommendations: true,
  enableShoppingReminders: true,
  enableBudgetAlerts: true,
  dataAnalyticsSharing: true,
  themePreference: "light",
};

export function loadShoppingPreferences(): ShoppingPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch {
    // Return default on error
  }
  return DEFAULT_PREFERENCES;
}

export function saveShoppingPreferences(
  prefs: Partial<ShoppingPreferences>
): ShoppingPreferences {
  const current = loadShoppingPreferences();
  const updated: ShoppingPreferences = { ...current, ...prefs };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage quota or disabled error
    }
  }
  return updated;
}

export function exportCustomerAccountArchive(
  user: UserProfile | null,
  orders: DigitalReceipt[],
  prefs: ShoppingPreferences
): void {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    system: "SmartCart AI Self-Checkout Application",
    profile: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          memberSince: user.memberSince,
          membershipTier: user.membershipTier,
          dietaryPreferences: user.dietaryPreferences,
          stats: user.stats,
        }
      : null,
    preferences: prefs,
    purchaseHistory: orders.map((o) => ({
      orderId: o.orderId,
      receiptNumber: o.receiptNumber,
      purchaseDate: o.purchaseDate,
      storeName: o.storeName,
      itemCount: o.itemCount,
      grossSubtotal: o.grossSubtotal,
      savings: o.savings,
      finalAmount: o.finalAmount,
      paymentMethod: o.paymentMethod,
      items: o.items.map((i) => ({
        name: i.productName,
        brand: i.brand,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total,
      })),
    })),
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `smartcart-account-data-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
