// ─── Digital Receipt & Exit QR Validation Types ──────────────────────────────

export type OrderStatus = "confirmed" | "ready_for_exit" | "exited" | "cancelled";

export type ExitPassStatus =
  | "ready"                  // Ready for exit validation
  | "payment_pending"        // Payment confirmation pending
  | "verification_required"  // Scale / item verification required
  | "expired"                // Exit pass expired (exceeded time window)
  | "revoked"                // Exit pass revoked by security / store
  | "completed"              // Exit validation completed (gate cleared)
  | "error";                 // Unable to generate exit pass

export type ExitValidationCode =
  | "VALID"
  | "PAYMENT_PENDING"
  | "VERIFICATION_REQUIRED"
  | "EXPIRED"
  | "REVOKED"
  | "ALREADY_USED"
  | "ALREADY_EXITED"
  | "NOT_FOUND"
  | "ERROR";

export interface ExitCredential {
  token: string;              // Cryptographically verifiable exit token
  orderId: string;
  issuedAt: string;           // ISO timestamp
  expiresAt: string;          // ISO timestamp (e.g. +30 mins)
  nonce: string;              // Replay protection nonce
  signature: string;          // Verifiable signature string
  status: ExitPassStatus;
  exitCode: string;           // 4-character alphanumeric backup gate code (e.g. E7K2)
}

export interface ExitValidationResult {
  success: boolean;
  code: ExitValidationCode;
  message: string;
  orderId?: string;
  storeName?: string;
  validatedAt?: string;
  gateId?: string;
  itemCount?: number;
  finalAmount?: number;
}

export interface ReceiptLineItem {
  productId: string;
  productName: string;
  brand: string;
  unit: string;
  quantity: number;
  unitPrice: number;          // in rupees
  originalPrice?: number;     // in rupees
  itemDiscount?: number;      // in rupees
  total: number;              // in rupees
  imageUrl?: string;
}

export interface DigitalReceipt {
  orderId: string;
  receiptNumber: string;
  transactionId: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  storeGstin: string;
  cartTag: string;
  purchaseDate: string;       // ISO timestamp
  items: ReceiptLineItem[];
  itemCount: number;
  distinctProducts: number;
  grossSubtotal: number;      // in rupees
  savings: number;            // in rupees
  netSubtotal: number;        // in rupees
  taxInclusiveAmount: number; // in rupees (included in MRP)
  convenienceFee: number;     // in rupees
  finalAmount: number;        // in rupees
  currency: "INR";
  paymentMethod: string;
  paymentStatus: "success" | "pending" | "failed";
  orderStatus: OrderStatus;
  exitStatus: ExitPassStatus;
  exitCode: string;
  exitCredential?: ExitCredential;
  exitValidatedAt?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface OrderHistoryItem {
  orderId: string;
  receiptNumber: string;
  date: string;
  finalAmount: number;
  paymentStatus: "success" | "pending" | "failed";
  orderStatus: OrderStatus;
  storeName: string;
  itemCount: number;
  hasReceipt: boolean;
  exitCode: string;
}
