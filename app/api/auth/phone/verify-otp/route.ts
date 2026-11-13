import { NextRequest, NextResponse } from "next/server";
import { verifyPhoneOtp } from "@/lib/phoneAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body?.phone;
    const code = body?.code;

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "Phone number and verification code are required." },
        { status: 400 }
      );
    }

    const result = await verifyPhoneOtp(phone, code);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    console.error("API verify-otp error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify code." },
      { status: 500 }
    );
  }
}
