import { NextRequest, NextResponse } from "next/server";
import { sendPhoneOtp } from "@/lib/phoneAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body?.phone;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }

    const result = await sendPhoneOtp(phone);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    console.error("API send-otp error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to dispatch verification code." },
      { status: 500 }
    );
  }
}

