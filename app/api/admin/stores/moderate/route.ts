import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";
import { unpublishStore, restoreStore } from "@/lib/adminService";
import { PAYMENT_CONFIG } from "@/lib/paymentConfig";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { storeId, action, reason } = body;

    if (!storeId) {
      return NextResponse.json({ error: "Store ID is required." }, { status: 400 });
    }

    const adminEmail = auth.email || PAYMENT_CONFIG.supportEmail;

    if (action === "unpublish") {
      if (!reason || !reason.trim()) {
        return NextResponse.json(
          { error: "A moderation reason is strictly required before unpublishing a store." },
          { status: 400 }
        );
      }
      const res = await unpublishStore(storeId, reason.trim(), adminEmail);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        action: "unpublish",
        message: "Storefront has been unpublished from public viewing.",
      });
    } else if (action === "restore") {
      const res = await restoreStore(storeId, adminEmail);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        action: "restore",
        message: "Storefront has been restored and republished online.",
      });
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'unpublish' or 'restore'." }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Store moderation error:", err);
    return NextResponse.json({ error: err.message || "Failed to moderate store." }, { status: 500 });
  }
}

