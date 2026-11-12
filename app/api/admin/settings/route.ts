import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";
import { getPlatformSettings, updatePlatformSettings } from "@/lib/adminService";
import { PAYMENT_CONFIG } from "@/lib/paymentConfig";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const settings = await getPlatformSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error("Get admin settings error:", err);
    return NextResponse.json({ error: err.message || "Failed to load settings." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const adminEmail = auth.email || PAYMENT_CONFIG.supportEmail;

    // Validate inputs
    if (body.support_email && !body.support_email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid support email address." }, { status: 400 });
    }

    if (body.processing_promise_hours && body.processing_promise_hours < 1) {
      return NextResponse.json({ error: "Processing turnaround promise must be at least 1 hour." }, { status: 400 });
    }

    const res = await updatePlatformSettings(body, adminEmail);
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      settings: res.settings,
      message: "Platform settings updated successfully.",
    });
  } catch (err: any) {
    console.error("Update admin settings error:", err);
    return NextResponse.json({ error: err.message || "Failed to update platform settings." }, { status: 500 });
  }
}

