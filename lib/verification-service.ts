import { CartItem } from "@/types/cart";
import {
  VerificationStatus,
  VerificationDiscrepancy,
  ItemVerificationResult,
  VerificationSummary,
  VerificationEvent,
  AssistanceRequest,
  SimulationScenario,
} from "@/types/verification";
import { parseProductWeightInGrams } from "@/lib/utils";

// Standard retail weight tolerance (greater of 25g or 5% of unit weight)
export function calculateWeightToleranceGrams(unitWeightGrams: number): number {
  return Math.max(25, Math.round(unitWeightGrams * 0.05));
}

export class VerificationService {
  private static instance: VerificationService;
  private scenario: SimulationScenario = "all_verified";
  private eventHistory: VerificationEvent[] = [];
  private activeAssistanceRequest: AssistanceRequest | null = null;

  private constructor() {
    this.seedInitialHistory();
  }

  public static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
    }
    return VerificationService.instance;
  }

  public setScenario(scenario: SimulationScenario): void {
    this.scenario = scenario;
  }

  public getScenario(): SimulationScenario {
    return this.scenario;
  }

  private seedInitialHistory() {
    const now = new Date();
    this.eventHistory = [
      {
        id: "evt-init-1",
        type: "scan_verified",
        productName: "SmartCart Anti-Theft Subsystem",
        result: "Hardware scale and tare calibrated to zero (0.00 kg).",
        timestamp: new Date(now.getTime() - 1000 * 60 * 12).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "resolved",
      },
    ];
  }

  /**
   * Evaluates cart items against current verification source / demo sensor adapter.
   */
  public evaluateCart(items: CartItem[]): {
    summary: VerificationSummary;
    results: ItemVerificationResult[];
  } {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    // Empty Cart
    if (items.length === 0) {
      return {
        summary: {
          overallStatus: "not_checked",
          verifiedCount: 0,
          pendingCount: 0,
          attentionCount: 0,
          totalItems: 0,
          hardwareConnected: this.scenario !== "sensor_disconnected",
          hardwareModel: "IoT ESP32-HX711 Load Cell v2.4 (Simulated)",
          nextActionGuidance: "Scan or add items to initiate verification.",
        },
        results: [],
      };
    }

    // Scenario: Sensor Disconnected
    if (this.scenario === "sensor_disconnected") {
      const results: ItemVerificationResult[] = items.map((item) => ({
        productId: item.product.id,
        status: "unavailable",
        expectedWeightGrams:
          parseProductWeightInGrams(item.product.unit, item.product.weight) ||
          undefined,
        measuredWeightGrams: undefined, // Honest: do not fabricate measured weights
      }));

      return {
        summary: {
          overallStatus: "unavailable",
          verifiedCount: 0,
          pendingCount: totalItems,
          attentionCount: 0,
          totalItems,
          hardwareConnected: false,
          hardwareModel: "Offline / Hardware Disconnected",
          nextActionGuidance:
            "Automatic scale verification is unavailable. Proceed to manual attendant check or retry sensor.",
        },
        results,
      };
    }

    // Scenario: Pending Checking
    if (this.scenario === "pending_checking") {
      const results: ItemVerificationResult[] = items.map((item) => ({
        productId: item.product.id,
        status: "checking",
        expectedWeightGrams:
          parseProductWeightInGrams(item.product.unit, item.product.weight) ||
          undefined,
        measuredWeightGrams: undefined,
      }));

      return {
        summary: {
          overallStatus: "checking",
          verifiedCount: 0,
          pendingCount: totalItems,
          attentionCount: 0,
          totalItems,
          hardwareConnected: true,
          hardwareModel: "IoT ESP32-HX711 Load Cell v2.4 (Simulated)",
          nextActionGuidance:
            "Stabilizing cart load cells. Keep your hands off the basket frame...",
        },
        results,
      };
    }

    // Process items according to active scenario
    const results: ItemVerificationResult[] = [];
    let verifiedCount = 0;
    let attentionCount = 0;

    items.forEach((item, index) => {
      const unitWeight = parseProductWeightInGrams(
        item.product.unit,
        item.product.weight
      );
      const expectedTotalWeight = unitWeight ? unitWeight * item.quantity : undefined;
      const tolerance = expectedTotalWeight
        ? calculateWeightToleranceGrams(expectedTotalWeight)
        : undefined;

      // Scenario: Weight Discrepancy on first item
      if (this.scenario === "weight_discrepancy" && index === 0 && expectedTotalWeight) {
        const excessGrams = 180;
        const measured = expectedTotalWeight + excessGrams;
        const discrepancy: VerificationDiscrepancy = {
          id: `disc-wt-${item.product.id}`,
          type: "weight_discrepancy",
          productId: item.product.id,
          productName: item.product.name,
          scannedBarcode: item.product.barcode,
          expectedWeightGrams: expectedTotalWeight,
          measuredWeightGrams: measured,
          toleranceGrams: tolerance,
          differenceGrams: excessGrams,
          explanation: `Measured weight (${(measured / 1000).toFixed(
            2
          )} kg) exceeds expected weight (${(
            expectedTotalWeight / 1000
          ).toFixed(2)} kg) by +${excessGrams}g, beyond ±${tolerance}g tolerance.`,
          severity: "medium",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        results.push({
          productId: item.product.id,
          status: "needs_attention",
          expectedWeightGrams: expectedTotalWeight,
          measuredWeightGrams: measured,
          toleranceGrams: tolerance,
          discrepancy,
          verifiedAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        attentionCount += item.quantity;
        return;
      }

      // Scenario: Product Mismatch on first item
      if (this.scenario === "product_mismatch" && index === 0) {
        const discrepancy: VerificationDiscrepancy = {
          id: `disc-mismatch-${item.product.id}`,
          type: "product_mismatch",
          productId: item.product.id,
          productName: item.product.name,
          scannedBarcode: item.product.barcode,
          detectedBarcode: "8901262010046",
          detectedItemName: "Amul Pasteurised Butter 100g",
          explanation:
            "Camera recognition and RFID sensor detected an item differing from the scanned barcode.",
          severity: "high",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        results.push({
          productId: item.product.id,
          status: "needs_attention",
          expectedWeightGrams: expectedTotalWeight,
          measuredWeightGrams: expectedTotalWeight ? expectedTotalWeight - 120 : undefined,
          toleranceGrams: tolerance,
          discrepancy,
          verifiedAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        attentionCount += item.quantity;
        return;
      }

      // Normal verified item
      results.push({
        productId: item.product.id,
        status: "verified",
        expectedWeightGrams: expectedTotalWeight,
        measuredWeightGrams: expectedTotalWeight,
        toleranceGrams: tolerance,
        verifiedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      verifiedCount += item.quantity;
    });

    const pendingCount = totalItems - (verifiedCount + attentionCount);
    let overallStatus: VerificationStatus = "verified";

    if (attentionCount > 0) {
      overallStatus = "needs_attention";
    } else if (pendingCount > 0) {
      overallStatus = "checking";
    }

    const nextActionGuidance =
      overallStatus === "needs_attention"
        ? "Please review the flagged item discrepancy below before proceeding to checkout."
        : overallStatus === "checking"
        ? "Awaiting final sensor confirmation for newly added items."
        : "All basket items match physical scale readings. Ready for checkout.";

    return {
      summary: {
        overallStatus,
        verifiedCount,
        pendingCount,
        attentionCount,
        totalItems,
        lastVerifiedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        hardwareConnected: true,
        hardwareModel: "IoT ESP32-HX711 Load Cell v2.4 (Simulated)",
        nextActionGuidance,
      },
      results,
    };
  }

  /**
   * Resets or retries verification
   */
  public retryVerification(items: CartItem[]): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const itemNames = items.map((i) => i.product.name).join(", ");
        this.logEvent({
          type: "weight_checked",
          result: `Scale re-tared and basket cross-checked (${items.length} items).`,
          status: this.scenario === "all_verified" ? "resolved" : "review_required",
        });
        resolve();
      }, 600);
    });
  }

  /**
   * Resolves an alert discrepancy (e.g. after customer rescans or verifies)
   */
  public resolveDiscrepancy(
    discrepancyId: string,
    resolutionMethod: "rescan" | "item_adjusted" | "attendant_cleared"
  ): void {
    this.scenario = "all_verified";
    this.logEvent({
      type: "discrepancy_resolved",
      result: `Discrepancy ${discrepancyId} cleared via ${resolutionMethod.replace(
        "_",
        " "
      )}.`,
      status: "resolved",
    });
  }

  /**
   * Staff Assistance workflow
   */
  public requestStaffAssistance(
    discrepancyId?: string,
    cartTag = "SmartCart #12"
  ): AssistanceRequest {
    const request: AssistanceRequest = {
      id: `AST-${Math.floor(1000 + Math.random() * 9000)}`,
      discrepancyId,
      status: "acknowledged",
      requestedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      stationTag: cartTag,
      estimatedWaitSeconds: 45,
      staffNotes:
        "Demo Mode: Supermarket attendant notified on store floor headset.",
    };

    this.activeAssistanceRequest = request;
    this.logEvent({
      type: "staff_requested",
      result: `Floor attendant requested for ${cartTag} (Ticket ${request.id}).`,
      status: "pending",
    });

    return request;
  }

  public getActiveAssistanceRequest(): AssistanceRequest | null {
    return this.activeAssistanceRequest;
  }

  public clearAssistanceRequest(): void {
    this.activeAssistanceRequest = null;
  }

  public getEventHistory(): VerificationEvent[] {
    return [...this.eventHistory].reverse();
  }

  public logEvent(event: Omit<VerificationEvent, "id" | "timestamp">): void {
    const newEvent: VerificationEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    this.eventHistory.push(newEvent);
  }
}

export const verificationService = VerificationService.getInstance();
