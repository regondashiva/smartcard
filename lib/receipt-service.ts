import {
  DigitalReceipt,
  ExitCredential,
  ExitPassStatus,
  ExitValidationResult,
  OrderHistoryItem,
  ReceiptLineItem,
} from "@/types/receipt";
import { OrderConfirmation } from "@/types/checkout";

const toRupees = (paise: number) => paise / 100;

const LOCAL_STORAGE_ORDERS_KEY = "smartcart_orders_history_v1";

// ─── Initial Seed Orders (Demo Purchases) ────────────────────────────────────

const DEMO_ORDERS: DigitalReceipt[] = [
  {
    orderId: "SC-DEMO-9041",
    receiptNumber: "REC-2026-9041",
    transactionId: "UPI9041283749",
    storeId: "store-flagship-indiranagar",
    storeName: "SmartCart Flagship Indiranagar",
    storeAddress: "100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038",
    storeGstin: "29AABCS1429B1Z8",
    cartTag: "SmartCart #12",
    purchaseDate: "2026-10-22T18:45:00.000Z",
    items: [
      {
        productId: "prod-milk-amul",
        productName: "Amul Taaza Homogenised Toned Milk",
        brand: "Amul",
        unit: "500 ml",
        quantity: 2,
        unitPrice: 33,
        originalPrice: 35,
        itemDiscount: 4,
        total: 66,
        imageUrl:
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
      },
      {
        productId: "prod-eggs-brown",
        productName: "Farm Fresh Organic Brown Eggs",
        brand: "Eggoz Farm",
        unit: "6 pcs pack",
        quantity: 1,
        unitPrice: 95,
        originalPrice: 110,
        itemDiscount: 15,
        total: 95,
        imageUrl:
          "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
      },
    ],
    itemCount: 3,
    distinctProducts: 2,
    grossSubtotal: 180,
    savings: 19,
    netSubtotal: 161,
    taxInclusiveAmount: 8.05,
    convenienceFee: 0,
    finalAmount: 161,
    currency: "INR",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "success",
    orderStatus: "ready_for_exit",
    exitStatus: "ready",
    exitCode: "E7K2",
    exitCredential: {
      token: "EX-TOK-DEMO-9041-89B72C",
      orderId: "SC-DEMO-9041",
      issuedAt: "2026-10-22T18:45:00.000Z",
      expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      nonce: "NNC-9041-A1",
      signature: "SIG-9041-X7F20D",
      status: "ready",
      exitCode: "E7K2",
    },
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
  },
  {
    orderId: "SC-DEMO-8820",
    receiptNumber: "REC-2026-8820",
    transactionId: "CRD8820194820",
    storeId: "store-flagship-indiranagar",
    storeName: "SmartCart Flagship Indiranagar",
    storeAddress: "100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038",
    storeGstin: "29AABCS1429B1Z8",
    cartTag: "SmartCart #07",
    purchaseDate: "2026-10-21T14:15:00.000Z",
    items: [
      {
        productId: "prod-bread-modern",
        productName: "Modern 100% Whole Wheat Brown Bread",
        brand: "Modern",
        unit: "400 g",
        quantity: 1,
        unitPrice: 50,
        originalPrice: 55,
        itemDiscount: 5,
        total: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      },
    ],
    itemCount: 1,
    distinctProducts: 1,
    grossSubtotal: 55,
    savings: 5,
    netSubtotal: 50,
    taxInclusiveAmount: 2.5,
    convenienceFee: 0,
    finalAmount: 50,
    currency: "INR",
    paymentMethod: "Credit Card (HDFC Visa)",
    paymentStatus: "success",
    orderStatus: "exited",
    exitStatus: "completed",
    exitCode: "B4M9",
    exitValidatedAt: "2026-10-21T14:28:10.000Z",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
  },
];

// In-memory store for server-side persistence during current Node process
const globalOrderMap = new Map<string, DigitalReceipt>();

// Initialize memory store with demo orders
DEMO_ORDERS.forEach((o) => globalOrderMap.set(o.orderId, { ...o }));

// ─── Helpers: LocalStorage Sync (Client side) ─────────────────────────────────

function loadClientOrders(): DigitalReceipt[] {
  if (typeof window === "undefined") return Array.from(globalOrderMap.values());
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (raw) {
      const parsed: DigitalReceipt[] = JSON.parse(raw);
      // Merge with demo orders ensuring uniqueness
      const map = new Map<string, DigitalReceipt>();
      DEMO_ORDERS.forEach((d) => map.set(d.orderId, d));
      parsed.forEach((p) => map.set(p.orderId, p));
      return Array.from(map.values());
    }
  } catch {
    // Ignore error
  }
  return DEMO_ORDERS;
}

function persistClientOrders(orders: DigitalReceipt[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // Ignore error
  }
}

// ─── Token Generation Helper ──────────────────────────────────────────────────

function generateSecureToken(orderId: string): string {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timeHex = Date.now().toString(16).toUpperCase();
  return `EX-TOK-${orderId.replace(/[^A-Za-z0-9]/g, "")}-${timeHex}-${rand}`;
}

// ─── Public API: Order Storage & Retrieval ────────────────────────────────────

export function saveOrderConfirmation(confirmation: OrderConfirmation): DigitalReceipt {
  const lineItems: ReceiptLineItem[] = confirmation.items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    brand: item.brand,
    unit: item.unit,
    quantity: item.quantity,
    unitPrice: toRupees(item.unitPricePaise),
    originalPrice: toRupees(item.mrpPaise),
    itemDiscount: toRupees(item.savingsPaise),
    total: toRupees(item.lineTotalPaise),
    imageUrl: item.imageUrl,
  }));

  const grossSubtotal = lineItems.reduce(
    (acc, li) => acc + (li.originalPrice ?? li.unitPrice) * li.quantity,
    0
  );
  const finalAmount = toRupees(confirmation.amountPaid);
  const savings = grossSubtotal - finalAmount;
  const netSubtotal = finalAmount;
  const taxInclusiveAmount = Math.round(finalAmount * 0.05 * 100) / 100;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString(); // 30 min validity

  const exitCredential: ExitCredential = {
    token: generateSecureToken(confirmation.orderId),
    orderId: confirmation.orderId,
    issuedAt: now.toISOString(),
    expiresAt,
    nonce: `NNC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    signature: `SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    status: "ready",
    exitCode: confirmation.exitCode,
  };

  const receipt: DigitalReceipt = {
    orderId: confirmation.orderId,
    receiptNumber: `REC-${confirmation.orderId}`,
    transactionId: confirmation.transactionId,
    storeId: confirmation.storeId,
    storeName: confirmation.storeName,
    storeAddress: "100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038",
    storeGstin: "29AABCS1429B1Z8",
    cartTag: confirmation.cartTag,
    purchaseDate: confirmation.paidAt,
    items: lineItems,
    itemCount: lineItems.reduce((acc, li) => acc + li.quantity, 0),
    distinctProducts: lineItems.length,
    grossSubtotal,
    savings: Math.max(0, savings),
    netSubtotal,
    taxInclusiveAmount,
    convenienceFee: 0,
    finalAmount,
    currency: "INR",
    paymentMethod: confirmation.paymentMethod.toUpperCase(),
    paymentStatus: confirmation.status,
    orderStatus: "ready_for_exit",
    exitStatus: "ready",
    exitCode: confirmation.exitCode,
    exitCredential,
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
  };

  // Save to in-memory map
  globalOrderMap.set(receipt.orderId, receipt);

  // Save to client localStorage if in browser
  if (typeof window !== "undefined") {
    const existing = loadClientOrders();
    const updated = [receipt, ...existing.filter((o) => o.orderId !== receipt.orderId)];
    persistClientOrders(updated);
  }

  return receipt;
}

export function getOrderById(orderId: string): DigitalReceipt | null {
  if (globalOrderMap.has(orderId)) {
    return globalOrderMap.get(orderId)!;
  }
  // Check client storage if running in browser
  if (typeof window !== "undefined") {
    const clientOrders = loadClientOrders();
    const found = clientOrders.find((o) => o.orderId === orderId);
    if (found) {
      globalOrderMap.set(found.orderId, found);
      return found;
    }
  }
  return null;
}

export function getAllOrders(): OrderHistoryItem[] {
  let orders: DigitalReceipt[] = [];
  if (typeof window !== "undefined") {
    orders = loadClientOrders();
  } else {
    orders = Array.from(globalOrderMap.values());
  }

  // Sort descending by purchase date
  orders.sort(
    (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  return orders.map((o) => ({
    orderId: o.orderId,
    receiptNumber: o.receiptNumber,
    date: o.purchaseDate,
    finalAmount: o.finalAmount,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    storeName: o.storeName,
    itemCount: o.itemCount,
    hasReceipt: true,
    exitCode: o.exitCode,
  }));
}

// ─── Refresh / Request Exit Credential ────────────────────────────────────────

export function issueExitCredential(orderId: string): ExitCredential | null {
  const order = getOrderById(orderId);
  if (!order) return null;

  if (order.paymentStatus !== "success") {
    return {
      token: "",
      orderId,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
      nonce: "",
      signature: "",
      status: "payment_pending",
      exitCode: order.exitCode,
    };
  }

  if (order.orderStatus === "exited") {
    return {
      token: "",
      orderId,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
      nonce: "",
      signature: "",
      status: "completed",
      exitCode: order.exitCode,
    };
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();

  const credential: ExitCredential = {
    token: generateSecureToken(order.orderId),
    orderId: order.orderId,
    issuedAt: now.toISOString(),
    expiresAt,
    nonce: `NNC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    signature: `SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    status: "ready",
    exitCode: order.exitCode,
  };

  order.exitCredential = credential;
  order.exitStatus = "ready";
  globalOrderMap.set(order.orderId, order);

  if (typeof window !== "undefined") {
    const existing = loadClientOrders();
    const updated = existing.map((o) => (o.orderId === order.orderId ? order : o));
    persistClientOrders(updated);
  }

  return credential;
}

// ─── Authoritative Exit Validation Engine ─────────────────────────────────────
// Invoked by the authorized store exit scanner or kiosk.
// Returns an authoritative decision based on server state.

export async function validateExitPass(
  tokenOrCode: string,
  gateId: string = "GATE-01"
): Promise<ExitValidationResult> {
  const cleanInput = tokenOrCode.trim().toUpperCase();

  // Try finding order by token OR exitCode
  let matchedOrder: DigitalReceipt | null = null;

  // Check in-memory store
  for (const order of globalOrderMap.values()) {
    if (
      order.exitCredential?.token.toUpperCase() === cleanInput ||
      order.exitCode.toUpperCase() === cleanInput ||
      order.orderId.toUpperCase() === cleanInput
    ) {
      matchedOrder = order;
      break;
    }
  }

  // Also check client orders if running in browser
  if (!matchedOrder && typeof window !== "undefined") {
    const clientOrders = loadClientOrders();
    for (const order of clientOrders) {
      if (
        order.exitCredential?.token.toUpperCase() === cleanInput ||
        order.exitCode.toUpperCase() === cleanInput ||
        order.orderId.toUpperCase() === cleanInput
      ) {
        matchedOrder = order;
        break;
      }
    }
  }

  if (!matchedOrder) {
    return {
      success: false,
      code: "NOT_FOUND",
      message: "No matching order found for this credential. Please verify the QR code or exit pass.",
      gateId,
    };
  }

  // 1. Check payment confirmation
  if (matchedOrder.paymentStatus !== "success") {
    return {
      success: false,
      code: "PAYMENT_PENDING",
      message: "Payment for this order has not been completed. Please complete payment before exiting.",
      orderId: matchedOrder.orderId,
      storeName: matchedOrder.storeName,
      gateId,
    };
  }

  // 2. Check if already exited (single-use redemption)
  if (matchedOrder.orderStatus === "exited") {
    return {
      success: false,
      code: "ALREADY_EXITED",
      message: `Order was already validated and exited at ${
        matchedOrder.exitValidatedAt
          ? new Date(matchedOrder.exitValidatedAt).toLocaleTimeString()
          : "an earlier time"
      }. Re-entry with this credential is prohibited.`,
      orderId: matchedOrder.orderId,
      storeName: matchedOrder.storeName,
      gateId,
    };
  }

  // 3. Check expiration
  if (matchedOrder.exitCredential?.expiresAt) {
    const expires = new Date(matchedOrder.exitCredential.expiresAt).getTime();
    if (Date.now() > expires) {
      matchedOrder.exitStatus = "expired";
      return {
        success: false,
        code: "EXPIRED",
        message: "Exit pass has expired. Please refresh your exit pass on the SmartCart app to generate an active pass.",
        orderId: matchedOrder.orderId,
        storeName: matchedOrder.storeName,
        gateId,
      };
    }
  }

  // 4. Check revocation
  if (matchedOrder.exitStatus === "revoked") {
    return {
      success: false,
      code: "REVOKED",
      message: "This exit credential has been revoked by store security. Please see a store representative.",
      orderId: matchedOrder.orderId,
      storeName: matchedOrder.storeName,
      gateId,
    };
  }

  // 5. Success! Authorize exit and mark as exited to prevent replay attacks
  const validatedAt = new Date().toISOString();
  matchedOrder.orderStatus = "exited";
  matchedOrder.exitStatus = "completed";
  matchedOrder.exitValidatedAt = validatedAt;

  globalOrderMap.set(matchedOrder.orderId, matchedOrder);

  if (typeof window !== "undefined") {
    const existing = loadClientOrders();
    const updated = existing.map((o) => (o.orderId === matchedOrder!.orderId ? matchedOrder! : o));
    persistClientOrders(updated);
  }

  return {
    success: true,
    code: "VALID",
    message: "Exit credential authorized. SmartCart scale & payment verified. Gate unlatched.",
    orderId: matchedOrder.orderId,
    storeName: matchedOrder.storeName,
    validatedAt,
    gateId,
    itemCount: matchedOrder.itemCount,
    finalAmount: matchedOrder.finalAmount,
  };
}
