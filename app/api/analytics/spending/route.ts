import { NextRequest, NextResponse } from "next/server";
import { getFullOrders } from "@/lib/receipt-service";
import { getSpendingInsights } from "@/lib/analytics-service";
import { DateRangeFilter } from "@/types/analytics";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") || "30d") as DateRangeFilter;

    const orders = getFullOrders();
    const insights = getSpendingInsights(orders, period);

    return NextResponse.json(insights, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to compute spending insights", detail: String(error) },
      { status: 500 }
    );
  }
}
