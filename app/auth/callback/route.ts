import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { notifyNewSellerRegistered } from "@/lib/notificationService";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const cookieStore = cookies();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "";

    if (url && anonKey) {
      const supabase = createServerClient(url, anonKey, {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          },
        },
      });

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.user) {
        try {
          const user = data.user;
          const fullName = user.user_metadata?.full_name || "New Seller";
          const username = user.user_metadata?.username || "mystore";
          await notifyNewSellerRegistered({
            sellerName: fullName,
            sellerEmail: user.email || "",
            username,
            storeName: fullName,
            sellerId: user.id,
          });
        } catch (e) {
          console.warn("Welcome notification warning:", e);
        }
        return NextResponse.redirect(new URL(next, request.url));
      }
    }
  }

  // Return the user to an error page or back to login with error state
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", "Verification link has expired or is invalid. Please try again.");
  return NextResponse.redirect(loginUrl);
}

