import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";
import { getPlatformAnalytics } from "@/lib/adminService";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") || "7d") as "7d" | "30d" | "all";

    const analytics = await getPlatformAnalytics(range);
    return NextResponse.json({ success: true, analytics });
  } catch (err: any) {
    console.error("Admin analytics error:", err);
    return NextResponse.json({ error: err.message || "Failed to load analytics." }, { status: 500 });
  }
}

