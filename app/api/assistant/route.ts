import { NextRequest, NextResponse } from "next/server";
import { processAssistantRequest } from "@/lib/assistant-service";
import { AssistantMessage } from "@/types/assistant";
import { DigitalReceipt } from "@/types/receipt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      conversationHistory = [],
      orders = [],
      userId,
    } = body as {
      message?: string;
      conversationHistory?: AssistantMessage[];
      orders?: DigitalReceipt[];
      userId?: string;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Rate-limit or payload size protection
    if (message.length > 500) {
      return NextResponse.json(
        { error: "Message too long. Please keep queries under 500 characters." },
        { status: 400 }
      );
    }

    const response = await processAssistantRequest({
      message: message.trim(),
      conversationHistory,
      orders,
      userId,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Assistant API Error]:", error);
    return NextResponse.json(
      {
        error: "Unable to process assistant request at this moment. Please try again.",
        message: "I encountered a brief hiccup searching our inventory. Please try asking again or rephrase your query.",
        intentType: "general",
        isDemoMode: true,
        suggestedQuestions: [
          "Recommend products under ₹500",
          "Show snacks for a party",
          "What can I buy within my budget?",
        ],
      },
      { status: 500 }
    );
  }
}
