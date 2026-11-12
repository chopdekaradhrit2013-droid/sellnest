import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Administrator session terminated.",
  });

  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

