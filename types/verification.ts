export type VerificationStatus =
  | "verified"
  | "checking"
  | "needs_attention"
  | "unavailable"
  | "not_checked";

export type DiscrepancyType =
  | "product_mismatch"
  | "weight_discrepancy"
  | "unverified_item"
  | "unexpected_removal"
  | "service_unavailable";

export interface VerificationDiscrepancy {
  id: string;
  type: DiscrepancyType;
  productId: string;
  productName: string;
  scannedBarcode?: string;
  detectedBarcode?: string;
  detectedItemName?: string;
  expectedWeightGrams?: number;
  measuredWeightGrams?: number;
  toleranceGrams?: number;
  differenceGrams?: number;
  explanation: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

export interface ItemVerificationResult {
  productId: string;
  status: VerificationStatus;
  expectedWeightGrams?: number;
  measuredWeightGrams?: number;
  toleranceGrams?: number;
  discrepancy?: VerificationDiscrepancy;
  verifiedAt?: string;
}

export interface VerificationSummary {
  overallStatus: VerificationStatus;
  verifiedCount: number;
  pendingCount: number;
  attentionCount: number;
  totalItems: number;
  lastVerifiedAt?: string;
  hardwareConnected: boolean;
  hardwareModel: string;
  nextActionGuidance: string;
}

export interface VerificationEvent {
  id: string;
  type:
    | "scan_verified"
    | "weight_checked"
    | "discrepancy_flagged"
    | "discrepancy_resolved"
    | "staff_requested";
  productId?: string;
  productName?: string;
  result: string;
  timestamp: string;
  status: "resolved" | "pending" | "review_required";
}

export interface AssistanceRequest {
  id: string;
  discrepancyId?: string;
  status: "pending" | "acknowledged" | "staff_attending" | "resolved";
  requestedAt: string;
  stationTag: string;
  estimatedWaitSeconds?: number;
  staffNotes?: string;
}

export type SimulationScenario =
  | "all_verified"
  | "weight_discrepancy"
  | "product_mismatch"
  | "pending_checking"
  | "sensor_disconnected";
