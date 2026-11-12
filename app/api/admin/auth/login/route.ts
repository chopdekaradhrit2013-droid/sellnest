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

    // 1. Password-based authentication (Admin's own account password)
    if (password) {
      if (isSupabaseConfigured()) {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          if (password === getAdminSecretKey()) {
            authenticated = true;
            authMethod = "secret_passkey_fallback";
          } else {
            return NextResponse.json(
              { error: error.message || "Invalid password for administrator account." },
              { status: 401 }
            );
          }
        } else {
          authenticated = true;
          authMethod = "supabase_password";
        }
      } else {
        // Safe development simulation fallback when Supabase is not connected
        if (password.length >= 6) {
          authenticated = true;
          authMethod = "demo_password";
        } else {
          return NextResponse.json(
            { error: "Password must be at least 6 characters." },
            { status: 401 }
          );
        }
      }
    } else if (passkey) {
      // 2. Secret passkey fallback (for automated integration suites & server scripts)
      if (passkey === getAdminSecretKey()) {
        authenticated = true;
        authMethod = "secret_passkey";
      } else {
        return NextResponse.json(
          { error: "Invalid administrator security passkey." },
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
      secure: process.env.NODE_ENV === "production",
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

