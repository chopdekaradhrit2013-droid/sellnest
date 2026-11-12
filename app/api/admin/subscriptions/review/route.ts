import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { reviewUpgradeRequest } from "@/lib/dashboardService";
import { PAYMENT_CONFIG } from "@/lib/paymentConfig";
import { verifyAdminAccess } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess(request);
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Only authorized administrators can approve or reject upgrade requests." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, action, rejectionReason, adminEmail } = body;
    const reviewerEmail = auth.email || adminEmail || PAYMENT_CONFIG.supportEmail;

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required." }, { status: 400 });
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    const result = await reviewUpgradeRequest(
      requestId,
      action,
      reviewerEmail,
      rejectionReason
    );

    if (!result.success || result.error) {
      return NextResponse.json(
        { error: result.error || "Failed to review upgrade request." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      request: result.request,
      message:
        action === "approve"
          ? `Upgrade request approved! The seller's store subscription has been activated.`
          : `Upgrade request rejected. The seller has been notified with the reason.`,
    });
  } catch (err: any) {
    console.error("Admin review API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process review action." },
      { status: 500 }
    );
  }
}

