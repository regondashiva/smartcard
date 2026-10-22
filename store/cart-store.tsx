"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";
import { CartItem, ShoppingSession, StoreLocation } from "@/types/cart";
import { MOCK_STORES } from "@/data/products";

import { parseProductWeightInGrams } from "@/lib/utils";

export interface ExpectedWeightResult {
  totalGrams: number;
  formattedKg: string;
  complete: boolean;
  knownItemsCount: number;
  totalItemsCount: number;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface CartContextType {
  items: CartItem[];
  session: ShoppingSession;
  selectedStore: StoreLocation;
  toast: ToastNotification | null;
  lastRemovedItem: CartItem | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  undoRemoveItem: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  switchStore: (store: StoreLocation) => void;
  getItemCount: () => number;
  getDistinctCount: () => number;
  getSubtotal: () => number;
  getSavings: () => number;
  getExpectedWeight: () => ExpectedWeightResult;
  showToast: (title: string, message: string, type?: "success" | "info" | "warning") => void;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_SESSION_KEY = "smartcart_demo_session_v1";
const LOCAL_STORAGE_ITEMS_KEY = "smartcart_demo_cart_v1";

const DEFAULT_STORE: StoreLocation = MOCK_STORES[0];

const INITIAL_INACTIVE_SESSION: ShoppingSession = {
  id: "DEMO-INACTIVE",
  isActive: false,
  status: "inactive",
  storeId: DEFAULT_STORE.id,
  storeName: DEFAULT_STORE.name,
  storeLocation: DEFAULT_STORE.address,
  cartTag: "SmartCart #12",
  isHardwareConnected: false, // Explicitly false as required for demo
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [session, setSession] = useState<ShoppingSession>(INITIAL_INACTIVE_SESSION);
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(DEFAULT_STORE);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage safely on client mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (savedSession) {
        setSession(JSON.parse(savedSession));
      }
      const savedItems = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    } catch {
      // LocalStorage unavailable or parsing failed
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when state updates (only after client hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(items));
    } catch {
      // Storage quota or privacy restrictions
    }
  }, [session, items, isHydrated]);

  const showToast = (title: string, message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3200);
  };

  const dismissToast = () => {
    setToast(null);
  };

  const addItem = (product: Product, quantity = 1) => {
    if (!product.inStock) {
      showToast("Out of stock", `${product.name} is currently unavailable.`, "warning");
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    showToast("Added to SmartCart", `${product.name} added to your basket.`);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        setLastRemovedItem(item);
        showToast("Removed from Cart", `${item.product.name} was removed.`, "info");
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  };

  const undoRemoveItem = () => {
    if (!lastRemovedItem) return;
    setItems((prev) => {
      const exists = prev.some((i) => i.product.id === lastRemovedItem.product.id);
      if (exists) return prev;
      return [...prev, lastRemovedItem];
    });
    showToast("Item Restored", `${lastRemovedItem.product.name} was restored to cart.`, "success");
    setLastRemovedItem(null);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    showToast("Cart Cleared", "All items have been removed.", "info");
  };

  const startSession = () => {
    const newSessionId = `SC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newSession: ShoppingSession = {
      id: newSessionId,
      isActive: true,
      status: "active",
      storeId: selectedStore.id,
      storeName: selectedStore.name,
      storeLocation: selectedStore.address,
      startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cartTag: `SmartCart #${Math.floor(1 + Math.random() * 30).toString().padStart(2, "0")}`,
      isHardwareConnected: false, // Demo session clearly noted
    };
    setSession(newSession);
    showToast("Demo Session Started", `Session ${newSessionId} linked to ${newSession.cartTag}.`, "success");
  };

  const pauseSession = () => {
    if (!session.isActive) return;
    setSession((prev) => ({ ...prev, status: "paused" }));
    showToast("Session Paused", "Shopping session temporarily paused.", "info");
  };

  const resumeSession = () => {
    if (!session.isActive) return;
    setSession((prev) => ({ ...prev, status: "active" }));
    showToast("Session Resumed", "Shopping session resumed.", "success");
  };

  const endSession = () => {
    setSession(INITIAL_INACTIVE_SESSION);
    showToast("Session Ended", "Demonstration shopping session has concluded.", "info");
  };

  const switchStore = (store: StoreLocation) => {
    setSelectedStore(store);
    if (session.isActive) {
      setSession((prev) => ({
        ...prev,
        storeId: store.id,
        storeName: store.name,
        storeLocation: store.address,
      }));
    }
    showToast("Store Selected", `Switched to ${store.name}`, "info");
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getDistinctCount = () => {
    return items.length;
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getSavings = () => {
    return items.reduce((sum, item) => {
      if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
        return sum + (item.product.originalPrice - item.product.price) * item.quantity;
      }
      return sum;
    }, 0);
  };

  const getExpectedWeight = (): ExpectedWeightResult => {
    let totalGrams = 0;
    let knownItemsCount = 0;
    let totalItemsCount = 0;

    items.forEach((item) => {
      totalItemsCount += item.quantity;
      const unitGrams = parseProductWeightInGrams(item.product.unit, item.product.weight);
      if (unitGrams !== null) {
        totalGrams += unitGrams * item.quantity;
        knownItemsCount += item.quantity;
      }
    });

    return {
      totalGrams,
      formattedKg: (totalGrams / 1000).toFixed(2),
      complete: items.length > 0 && knownItemsCount === totalItemsCount,
      knownItemsCount,
      totalItemsCount,
    };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        session,
        selectedStore,
        toast,
        lastRemovedItem,
        addItem,
        removeItem,
        undoRemoveItem,
        updateQuantity,
        clearCart,
        startSession,
        pauseSession,
        resumeSession,
        endSession,
        switchStore,
        getItemCount,
        getDistinctCount,
        getSubtotal,
        getSavings,
        getExpectedWeight,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
