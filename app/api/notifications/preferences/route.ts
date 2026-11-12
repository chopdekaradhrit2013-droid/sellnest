import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  getSellerNotificationPreferences,
  updateSellerNotificationPreferences,
} from "@/lib/notificationService";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let sellerId = searchParams.get("sellerId") || "seller-1";

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        sellerId = user.id;
      }
    }

    const preferences = await getSellerNotificationPreferences(sellerId);
    return NextResponse.json({ success: true, preferences });
  } catch (err: any) {
    console.error("Get notification preferences error:", err);
    return NextResponse.json({ error: err.message || "Failed to load preferences." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    let sellerId = body.sellerId || "seller-1";

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        sellerId = user.id;
      }
    }

    const preferences = await updateSellerNotificationPreferences(sellerId, body);
    return NextResponse.json({ success: true, preferences, message: "Notification preferences saved." });
  } catch (err: any) {
    console.error("Update notification preferences error:", err);
    return NextResponse.json({ error: err.message || "Failed to save preferences." }, { status: 500 });
  }
}

