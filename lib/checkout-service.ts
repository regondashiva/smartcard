import { CartItem } from "@/types/cart";
import {
  BillLineItem,
  BillSummary,
  OrderConfirmation,
  PaymentInput,
  PaymentMethod,
  PaymentMethodId,
  PaymentStatus,
} from "@/types/checkout";

// ─── Billing Engine ───────────────────────────────────────────────────────────
// Uses integer paise arithmetic to avoid floating-point rounding errors.

function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function buildBillSummary(items: CartItem[]): BillSummary {
  const lineItems: BillLineItem[] = items.map((item) => {
    const unitPricePaise = toPaise(item.product.price);
    const mrpPaise = toPaise(item.product.originalPrice ?? item.product.price);
    const lineTotalPaise = unitPricePaise * item.quantity;
    const savingsPaise = (mrpPaise - unitPricePaise) * item.quantity;

    return {
      productId: item.product.id,
      productName: item.product.name,
      brand: item.product.brand,
      imageUrl: item.product.imageUrl,
      unit: item.product.unit,
      quantity: item.quantity,
      unitPricePaise,
      mrpPaise,
      lineTotalPaise,
      savingsPaise,
    };
  });

  const grossMrpPaise = lineItems.reduce(
    (acc, li) => acc + li.mrpPaise * li.quantity,
    0
  );
  const savingsPaise = lineItems.reduce((acc, li) => acc + li.savingsPaise, 0);
  const subtotalPaise = grossMrpPaise - savingsPaise;
  // GST is inclusive in Indian MRP — not added on top
  const taxPaise = 0;
  const convenienceFeePaise = 0;
  const totalPaise = subtotalPaise + taxPaise + convenienceFeePaise;

  const distinctProducts = items.length;
  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    lineItems,
    grossMrpPaise,
    savingsPaise,
    subtotalPaise,
    taxPaise,
    convenienceFeePaise,
    totalPaise,
    distinctProducts,
    totalUnits,
  };
}

// ─── Paise → Rupees helper ───────────────────────────────────────────────────

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

// ─── Server-side amount revalidation (simulated) ──────────────────────────────
// In a real integration this would be a server action or API call.
// We simulate a small (~500ms) async call and always return the same total
// so the UI correctly demonstrates the revalidation guard.

export async function revalidateCartTotal(
  clientBill: BillSummary
): Promise<{ confirmed: boolean; serverTotalPaise: number }> {
  await new Promise((r) => setTimeout(r, 480));
  // Simulate: server agrees with client total
  return { confirmed: true, serverTotalPaise: clientBill.totalPaise };
}

// ─── Demo Payment Processor ──────────────────────────────────────────────────
// Simulates UPI / card / wallet payment with realistic timing.
// In production replace with Razorpay / PhonePe / Cashfree SDK.

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SC-${ts}-${rand}`;
}

function generateTransactionId(method: PaymentMethodId): string {
  const prefix =
    method === "upi"
      ? "UPI"
      : method === "card"
      ? "CRD"
      : method.startsWith("wallet")
      ? "WLT"
      : "NBK";
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function generateExitCode(): string {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

export async function processPayment(
  bill: BillSummary,
  input: PaymentInput,
  session: { id: string; cartTag: string; storeId: string; storeName: string }
): Promise<OrderConfirmation> {
  // Simulate payment gateway latency (1.8 – 3.2 s)
  const delay = 1800 + Math.random() * 1400;
  await new Promise((r) => setTimeout(r, delay));

  // Demo: always succeeds — swap to real gateway in production
  const status: PaymentStatus = "success";
  const orderId = generateOrderId();
  const transactionId = generateTransactionId(input.method);
  const exitCode = generateExitCode();
  const paidAt = new Date().toISOString();

  // Receipt QR encodes a compact JSON string
  const receiptQrData = JSON.stringify({
    oid: orderId,
    txn: transactionId,
    amt: bill.totalPaise,
    ts: paidAt,
    exit: exitCode,
    store: session.storeId,
  });

  return {
    orderId,
    transactionId,
    paymentMethod: input.method,
    amountPaid: bill.totalPaise,
    paidAt,
    receiptQrData,
    storeId: session.storeId,
    storeName: session.storeName,
    sessionId: session.id,
    cartTag: session.cartTag,
    items: bill.lineItems,
    status,
    exitCode,
  };
}

// ─── Payment Method Catalogue ────────────────────────────────────────────────

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "upi" as PaymentMethodId,
    label: "UPI",
    description: "Pay with any UPI app — instant, zero charges",
    iconKey: "upi",
    isPopular: true,
    processingNote: "Usually confirmed within 5 seconds",
  },
  {
    id: "wallet_gpay" as PaymentMethodId,
    label: "Google Pay",
    description: "One-tap payment via Google Pay",
    iconKey: "gpay",
    isPopular: true,
    processingNote: "Redirects to Google Pay",
  },
  {
    id: "wallet_phonepe" as PaymentMethodId,
    label: "PhonePe",
    description: "Pay with your PhonePe wallet or linked bank",
    iconKey: "phonepe",
    processingNote: "Redirects to PhonePe",
  },
  {
    id: "wallet_paytm" as PaymentMethodId,
    label: "Paytm",
    description: "Pay via Paytm wallet or UPI",
    iconKey: "paytm",
    processingNote: "Redirects to Paytm",
  },
  {
    id: "card" as PaymentMethodId,
    label: "Debit / Credit Card",
    description: "Visa, Mastercard, RuPay — all networks accepted",
    iconKey: "card",
    processingNote: "Secured by 3D Secure 2.0",
  },
  {
    id: "netbanking" as PaymentMethodId,
    label: "Net Banking",
    description: "Pay directly from your bank account",
    iconKey: "netbanking",
    processingNote: "Redirects to your bank's portal",
  },
] as const;

export const NETBANKING_BANKS = [
  { code: "SBI", name: "State Bank of India" },
  { code: "HDFC", name: "HDFC Bank" },
  { code: "ICICI", name: "ICICI Bank" },
  { code: "AXIS", name: "Axis Bank" },
  { code: "KOTAK", name: "Kotak Mahindra Bank" },
  { code: "YES", name: "Yes Bank" },
  { code: "BOB", name: "Bank of Baroda" },
  { code: "PNB", name: "Punjab National Bank" },
];
