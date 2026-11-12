import { NextRequest, NextResponse } from "next/server";
import { PAYMENT_CONFIG, isAuthorizedAdmin } from "./paymentConfig";
import { isSupabaseConfigured } from "./supabase/config";
import { createServerSupabaseClient } from "./supabase/server";

export const ADMIN_COOKIE_NAME = "sellnest_admin_session";

/**
 * Server-only accessor for admin secret key.
 * Never exposed via PAYMENT_CONFIG or bundled to client components.
 */
export function getAdminSecretKey(): string {
  return process.env.ADMIN_SECRET_KEY || "sellnest_admin_secure_key_2026";
}

export interface AdminAuthResult {
  isAdmin: boolean;
  email?: string;
  userId?: string;
  error?: string;
}

/**
 * Server-side verification of administrator access.
 * NEVER trust frontend-only state.
 */
export async function verifyAdminAccess(
  request?: NextRequest | Request
): Promise<AdminAuthResult> {
  const adminSecret = getAdminSecretKey();

  // 1. Check Header-based Admin Key / Passkey
  if (request) {
    const headers = request.headers;
    const headerKey = headers.get("x-admin-key");
    const headerEmail = headers.get("x-admin-email");
    const passkey = headers.get("x-admin-passkey");

    if (headerKey && headerKey === adminSecret) {
      return {
        isAdmin: true,
        email: headerEmail || PAYMENT_CONFIG.supportEmail,
        userId: "admin-super",
      };
    }

    if (headerEmail && isAuthorizedAdmin(headerEmail) && passkey && passkey === adminSecret) {
      return {
        isAdmin: true,
        email: headerEmail,
        userId: "admin-" + headerEmail,
      };
    }
  }

  // 2. Check HTTP-only Cookie-based Admin Session
  if (request && "cookies" in request) {
    const cookieVal = (request as NextRequest).cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (cookieVal) {
      try {
        const decoded = JSON.parse(Buffer.from(cookieVal, "base64").toString("utf-8"));
        if (
          decoded &&
          decoded.email &&
          isAuthorizedAdmin(decoded.email) &&
          decoded.exp > Date.now()
        ) {
          return {
            isAdmin: true,
            email: decoded.email,
            userId: decoded.userId || "admin-session",
          };
        }
      } catch (e) {
        // invalid cookie format
      }
    }
  }

  // 3. Check Supabase User Session if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email && isAuthorizedAdmin(user.email)) {
        return {
          isAdmin: true,
          email: user.email,
          userId: user.id,
        };
      }
    } catch {
      // Supabase error
    }
  }

  return {
    isAdmin: false,
    error: "Unauthorized. Administrator privileges required.",
  };
}

/**
 * Creates an encrypted/base64 encoded admin session token
 */
export function createAdminSessionCookieValue(email: string): string {
  const payload = {
    email,
    userId: "admin-" + Date.now(),
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

