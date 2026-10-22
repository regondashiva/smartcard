import { NextRequest, NextResponse } from "next/server";
import {
  markNotificationsRead,
  markAllRead,
  dismissNotification,
  clearAllNotifications,
} from "@/lib/notification-service";

// PATCH /api/notifications/actions
// Body: { action: "markRead" | "markAllRead" | "dismiss" | "clearAll", userId, notificationIds? }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, notificationIds, notificationId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    switch (action) {
      case "markRead":
        if (!notificationIds || !Array.isArray(notificationIds)) {
          return NextResponse.json({ error: "notificationIds array required" }, { status: 400 });
        }
        markNotificationsRead(userId, notificationIds);
        return NextResponse.json({ success: true, action: "markRead", count: notificationIds.length });

      case "markAllRead":
        markAllRead(userId);
        return NextResponse.json({ success: true, action: "markAllRead" });

      case "dismiss":
        if (!notificationId) {
          return NextResponse.json({ error: "notificationId required" }, { status: 400 });
        }
        dismissNotification(userId, notificationId);
        return NextResponse.json({ success: true, action: "dismiss" });

      case "clearAll":
        clearAllNotifications(userId);
        return NextResponse.json({ success: true, action: "clearAll" });

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
