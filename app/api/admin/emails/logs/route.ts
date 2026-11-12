import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";
import { fetchEmailDeliveryLogs, getEmailConfig } from "@/lib/emailService";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const logs = await fetchEmailDeliveryLogs(limit);
    const config = getEmailConfig();

    return NextResponse.json({
      success: true,
      logs,
      config: {
        isConfigured: config.isConfigured,
        provider: config.provider,
        fromEmail: config.fromEmail,
      },
    });
  } catch (err: any) {
    console.error("Fetch email logs error:", err);
    return NextResponse.json({ error: err.message || "Failed to load email delivery logs." }, { status: 500 });
  }
}

