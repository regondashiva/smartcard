import { NextRequest, NextResponse } from "next/server";
import { validateExitPass } from "@/lib/receipt-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, exitCode, gateId } = body;

    const credentialIdentifier = token || exitCode;

    if (!credentialIdentifier || typeof credentialIdentifier !== "string") {
      return NextResponse.json(
        {
          success: false,
          code: "ERROR",
          message: "A valid exit token or 4-digit exit code is required.",
        },
        { status: 400 }
      );
    }

    const result = await validateExitPass(credentialIdentifier, gateId || "GATE-01");

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        code: "ERROR",
        message: "Internal validation service error.",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}
