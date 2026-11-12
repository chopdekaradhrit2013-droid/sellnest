import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";
import { getAdminAuditLogs } from "@/lib/adminService";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const logs = await getAdminAuditLogs(limit);
    return NextResponse.json({ success: true, logs });
  } catch (err: any) {
    console.error("Admin activity logs error:", err);
    return NextResponse.json({ error: err.message || "Failed to load audit logs." }, { status: 500 });
  }
}

