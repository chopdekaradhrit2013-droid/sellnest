import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const result = await verifyAdminAccess(request);
  if (!result.isAdmin) {
    return NextResponse.json({ isAdmin: false, error: result.error }, { status: 403 });
  }

  return NextResponse.json({
    isAdmin: true,
    email: result.email,
    userId: result.userId,
  });
}

