import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/notificationService";
import { verifyAdminAccess } from "@/lib/adminAuth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipientType = (searchParams.get("recipientType") || "seller") as "seller" | "admin" | "customer";
    let recipientId = searchParams.get("recipientId") || "seller-1";

    if (recipientType === "admin") {
      const auth = await verifyAdminAccess(request);
      if (!auth.isAdmin) {
        return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
      }
      recipientId = "admin";
    } else if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        recipientId = user.id;
      }
    }

    const notifications = await getNotificationsForUser(recipientId, recipientType);
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err: any) {
    console.error("Get notifications error:", err);
    return NextResponse.json({ error: err.message || "Failed to load notifications." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, notificationId, recipientId, recipientType } = body;

    if (action === "mark_read" && notificationId) {
      await markNotificationAsRead(notificationId);
      return NextResponse.json({ success: true, message: "Notification marked as read." });
    }

    if (action === "mark_all_read") {
      let targetRecipientId = recipientId || "seller-1";
      const targetType = recipientType || "seller";

      if (targetType === "admin") {
        const auth = await verifyAdminAccess(request);
        if (!auth.isAdmin) {
          return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
        }
        targetRecipientId = "admin";
      } else if (isSupabaseConfigured()) {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) targetRecipientId = user.id;
      }

      await markAllNotificationsAsRead(targetRecipientId, targetType);
      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    return NextResponse.json({ error: "Invalid action or parameters." }, { status: 400 });
  } catch (err: any) {
    console.error("Update notification error:", err);
    return NextResponse.json({ error: err.message || "Failed to update notification." }, { status: 500 });
  }
}

