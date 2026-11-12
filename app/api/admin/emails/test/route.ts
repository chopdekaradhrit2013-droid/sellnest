import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { verifyAdminAccess } from "@/lib/adminAuth";
import { sendTransactionalEmail, getEmailConfig } from "@/lib/emailService";
import { renderWelcomeSellerEmail } from "@/lib/emailTemplates";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.isAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const targetEmail = body.to || auth.email || "chopdekaradhrit2013@gmail.com";

    const emailContent = renderWelcomeSellerEmail({
      sellerName: "Test Administrator",
      storeName: "SellNest Studio Demo",
      storeSlug: "sellnest-demo",
    });

    const res = await sendTransactionalEmail({
      to: targetEmail,
      subject: `[SellNest Test] ${emailContent.subject}`,
      html: emailContent.html,
      templateType: "welcome_seller",
      eventType: "admin.test_dispatch",
      recipientType: "admin",
      metadata: { initiatedBy: auth.email },
    });

    const config = getEmailConfig();

    return NextResponse.json({
      success: res.success,
      log: res.log,
      config,
      message: res.success
        ? config.isConfigured
          ? `Test email sent to ${targetEmail} via Resend.`
          : `Test email logged in safe dev simulation mode (RESEND_API_KEY not configured).`
        : `Email delivery failed: ${res.log.error_details}`,
    });
  } catch (err: any) {
    console.error("Test email dispatch error:", err);
    return NextResponse.json({ error: err.message || "Failed to trigger test email." }, { status: 500 });
  }
}

