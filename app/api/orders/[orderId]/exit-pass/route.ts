import { NextRequest, NextResponse } from "next/server";
import { getOrderById, issueExitCredential } from "@/lib/receipt-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    if (!order.exitCredential) {
      const issued = issueExitCredential(orderId);
      return NextResponse.json(issued, { status: 200 });
    }

    return NextResponse.json(order.exitCredential, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const credential = issueExitCredential(orderId);

    if (!credential) {
      return NextResponse.json(
        { error: "Order not found or invalid", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(credential, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to issue exit credential", message: String(error) },
      { status: 500 }
    );
  }
}
