import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { PAYMENT_CONFIG, isAuthorizedAdmin } from "@/lib/paymentConfig";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionCookieValue,
  getAdminSecretKey,
} from "@/lib/adminAuth";
import { logAdminAction } from "@/lib/adminService";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passkey, password, email } = body;

    const cleanEmail = (email || PAYMENT_CONFIG.supportEmail).toLowerCase().trim();
    const isEmailAuthorized = isAuthorizedAdmin(cleanEmail);

    if (!isEmailAuthorized) {
      return NextResponse.json(
        { error: `Unauthorized. Only ${PAYMENT_CONFIG.supportEmail} has platform administrator privileges.` },
        { status: 403 }
      );
    }

    let authenticated = false;
    let authMethod = "password";

    const enteredKey = (password || passkey || "").trim();
    const adminSecret = getAdminSecretKey();

    // 1. Secret Passkey / Master Password check
    if (adminSecret && (enteredKey === adminSecret || password === adminSecret || passkey === adminSecret)) {
      authenticated = true;
      authMethod = "secret_passkey";
    } else if (password) {
      if (isSupabaseConfigured()) {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          return NextResponse.json(
            { error: error.message || "Invalid password for administrator account." },
            { status: 401 }
          );
        } else {
          authenticated = true;
          authMethod = "supabase_password";
        }
      } else {
        return NextResponse.json(
          { error: "Invalid password for administrator account." },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Password or security passkey is required." },
        { status: 400 }
      );
    }

    if (!authenticated) {
      return NextResponse.json(
        { error: "Authentication failed. Please verify your credentials." },
        { status: 401 }
      );
    }

    const sessionValue = createAdminSessionCookieValue(cleanEmail);

    const response = NextResponse.json({
      success: true,
      email: cleanEmail,
      message: "Administrator session authenticated successfully.",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionValue,
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    await logAdminAction({
      admin_email: cleanEmail,
      action: "admin.login",
      target_type: "settings",
      target_id: "auth-session",
      reason: `Super Admin authenticated via ${authMethod}.`,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed." }, { status: 500 });
  }
}

