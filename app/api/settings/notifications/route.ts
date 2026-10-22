import { NextRequest, NextResponse } from "next/server";
import { getPreferences, updatePreferences } from "@/lib/notification-service";

// GET /api/settings/notifications?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const preferences = getPreferences(userId);
  return NextResponse.json({ preferences });
}

// PATCH /api/settings/notifications
// Body: { userId, updates: Partial<NotificationPreferences> }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updated = updatePreferences(userId, updates);
    return NextResponse.json({ preferences: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
