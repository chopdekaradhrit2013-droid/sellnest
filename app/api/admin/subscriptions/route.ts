import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { getAllUpgradeRequests } from "@/lib/dashboardService";
import { verifyAdminAccess } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess(request);
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required to manage subscription requests." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filterStatus = searchParams.get("status") || "all";

    const requests = await getAllUpgradeRequests(filterStatus);

    // Compute summary stats
    const all = await getAllUpgradeRequests("all");
    const pendingCount = all.filter((r) => r.status === "pending").length;
    const approvedCount = all.filter((r) => r.status === "approved").length;
    const rejectedCount = all.filter((r) => r.status === "rejected").length;
    const totalVerifiedRevenue = all
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + Number(r.amount), 0);

    return NextResponse.json({
      success: true,
      requests,
      stats: {
        total: all.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        totalVerifiedRevenue,
      },
    });
  } catch (err: any) {
    console.error("Admin subscriptions API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to retrieve subscription requests." },
      { status: 500 }
    );
  }
}

