import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./config";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // If Supabase credentials are not configured, allow public navigation without breaking
  if (!isSupabaseConfigured()) {
    return response;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  // Refreshes the session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/account");
  const isAdminPath = pathname.startsWith("/admin");
  const isAuthPath =
    pathname === "/login" ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/register";

  // Admin access protection: Reject ordinary users trying to access /admin
  if (isAdminPath && pathname !== "/admin/login") {
    const adminCookie = request.cookies.get("sellnest_admin_session")?.value;
    const isExplicitAdmin =
      user?.email &&
      ["chopdekaradhrit2013@gmail.com"].includes(user.email.toLowerCase().trim());

    if (user && !isExplicitAdmin && !adminCookie) {
      const redirectUrl = new URL("/dashboard", request.url);
      redirectUrl.searchParams.set("error", "admin_unauthorized");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 1. Unauthenticated users trying to access protected paths
  if (isProtectedPath && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Authenticated users trying to visit /login or /signup
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

