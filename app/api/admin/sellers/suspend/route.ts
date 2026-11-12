import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";
import { suspendSeller, reactivateSeller } from "@/lib/adminService";
import { PAYMENT_CONFIG } from "@/lib/paymentConfig";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { sellerId, action, reason } = body;

    if (!sellerId) {
      return NextResponse.json({ error: "Seller ID is required." }, { status: 400 });
    }

    const adminEmail = auth.email || PAYMENT_CONFIG.supportEmail;

    if (action === "suspend") {
      if (!reason || !reason.trim()) {
        return NextResponse.json(
          { error: "A suspension reason is strictly required before suspending an account." },
          { status: 400 }
        );
      }
      const res = await suspendSeller(sellerId, reason.trim(), adminEmail);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        action: "suspend",
        message: "Seller account and associated storefront have been suspended.",
      });
    } else if (action === "reactivate") {
      const res = await reactivateSeller(sellerId, adminEmail);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        action: "reactivate",
        message: "Seller account and storefronts have been reactivated.",
      });
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'suspend' or 'reactivate'." }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Seller suspension action error:", err);
    return NextResponse.json({ error: err.message || "Failed to process suspension." }, { status: 500 });
  }
}

