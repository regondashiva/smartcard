import { NextResponse } from "next/server";
import { getFullOrders } from "@/lib/receipt-service";
import {
  getFrequentlyPurchasedProducts,
  getPersonalizedRecommendations,
} from "@/lib/analytics-service";

export async function GET() {
  try {
    const orders = getFullOrders();
    const buyAgain = getFrequentlyPurchasedProducts(orders);
    const recommendations = getPersonalizedRecommendations(orders);

    return NextResponse.json({ buyAgain, recommendations }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to compute recommendations", detail: String(error) },
      { status: 500 }
    );
  }
}
