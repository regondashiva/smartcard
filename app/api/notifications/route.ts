import { NextRequest, NextResponse } from "next/server";
import {
  getNotificationsForUser,
  getUnreadCount,
  createNotification,
} from "@/lib/notification-service";
import { CreateNotificationPayload } from "@/types/notification";

// GET /api/notifications?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const notifications = getNotificationsForUser(userId);
  const unreadCount = getUnreadCount(userId);

  return NextResponse.json({
    notifications,
    unreadCount,
    totalCount: notifications.length,
  });
}

// POST /api/notifications — create a new notification
export async function POST(req: NextRequest) {
  try {
    const payload: CreateNotificationPayload = await req.json();

    if (!payload.userId || !payload.title || !payload.body || !payload.category) {
      return NextResponse.json({ error: "userId, title, body, and category are required" }, { status: 400 });
    }

    const notif = createNotification(payload);
    return NextResponse.json({ notification: notif }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
