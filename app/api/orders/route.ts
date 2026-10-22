import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/receipt-service";

export async function GET() {
  try {
    const orders = getAllOrders();
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve order history", message: String(error) },
      { status: 500 }
    );
  }
}
