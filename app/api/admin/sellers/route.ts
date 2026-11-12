import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";
import { getAllSellers } from "@/lib/adminService";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const plan = searchParams.get("plan") || undefined;
    const status = searchParams.get("status") || undefined;

    const sellers = await getAllSellers({ search, plan, status });
    return NextResponse.json({ success: true, sellers });
  } catch (err: any) {
    console.error("Admin sellers error:", err);
    return NextResponse.json({ error: err.message || "Failed to load sellers." }, { status: 500 });
  }
}

