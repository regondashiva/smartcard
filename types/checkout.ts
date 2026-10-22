import { CartItem } from "./cart";

// ─── Payment Methods ─────────────────────────────────────────────────────────

export type PaymentMethodId =
  | "upi"
  | "card"
  | "netbanking"
  | "wallet_gpay"
  | "wallet_phonepe"
  | "wallet_paytm";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
  iconKey: string;
  isPopular?: boolean;
  processingNote?: string;
}

// ─── UPI / Card Input ────────────────────────────────────────────────────────

export interface UpiPaymentInput {
  vpa: string; // e.g. user@upi
}

export interface CardPaymentInput {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

export interface NetBankingInput {
  bankCode: string;
}

export type PaymentInput =
  | { method: "upi"; upi: UpiPaymentInput }
  | { method: "card"; card: CardPaymentInput }
  | { method: "netbanking"; netbanking: NetBankingInput }
  | { method: "wallet_gpay" | "wallet_phonepe" | "wallet_paytm" };

// ─── Billing ─────────────────────────────────────────────────────────────────

export interface BillLineItem {
  productId: string;
  productName: string;
  brand: string;
  imageUrl: string;
  unit: string;
  quantity: number;
  unitPricePaise: number;   // price in paise (integer, avoids floating point)
  mrpPaise: number;         // original MRP in paise
  lineTotalPaise: number;   // quantity x unitPricePaise
  savingsPaise: number;     // (mrpPaise - unitPricePaise) x quantity
}

export interface BillSummary {
  lineItems: BillLineItem[];
  grossMrpPaise: number;      // sum of all mrp x qty
  savingsPaise: number;       // sum of savings across all items
  subtotalPaise: number;      // grossMrpPaise - savingsPaise
  taxPaise: number;           // GST inclusive in India = 0 (included in MRP)
  convenienceFeePaise: number;// self-checkout: 0
  totalPaise: number;         // subtotalPaise + taxPaise + convenienceFeePaise
  distinctProducts: number;
  totalUnits: number;
}

// ─── Checkout Steps ───────────────────────────────────────────────────────────

export type CheckoutStep =
  | "review"
  | "payment"
  | "processing"
  | "confirmation";

// ─── Order Result ─────────────────────────────────────────────────────────────

export type PaymentStatus = "success" | "failed" | "pending";

export interface OrderConfirmation {
  orderId: string;
  transactionId: string;
  paymentMethod: PaymentMethodId;
  amountPaid: number;       // in paise
  paidAt: string;           // ISO timestamp
  receiptQrData: string;    // encoded string for QR code
  storeId: string;
  storeName: string;
  sessionId: string;
  cartTag: string;
  items: BillLineItem[];
  status: PaymentStatus;
  exitCode: string;         // 4-digit alphanumeric exit gate code
}
