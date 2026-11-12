import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";
import {
  getAdminOverviewStats,
  getAllSellers,
  getAllStores,
  getAdminAuditLogs,
  getPlatformAnalytics,
} from "@/lib/adminService";
import { getAllUpgradeRequests } from "@/lib/dashboardService";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const stats = await getAdminOverviewStats();
    const sellers = await getAllSellers();
    const upgradeRequests = await getAllUpgradeRequests("all");
    const auditLogs = await getAdminAuditLogs(10);
    const analytics = await getPlatformAnalytics("7d");

    return NextResponse.json({
      success: true,
      stats,
      recentSellers: sellers.slice(0, 5),
      recentRequests: upgradeRequests.slice(0, 5),
      recentActivity: auditLogs,
      chartData: analytics.chartData,
    });
  } catch (err: any) {
    console.error("Admin overview error:", err);
    return NextResponse.json({ error: err.message || "Failed to load overview data." }, { status: 500 });
  }
}

