import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();

    if (!identifier || typeof identifier !== "string") {
      return NextResponse.json(
        { error: "Username or email is required." },
        { status: 400 }
      );
    }

    const trimmed = identifier.trim().toLowerCase();

    // If identifier is already an email address, return directly
    if (trimmed.includes("@")) {
      return NextResponse.json({ email: trimmed, isEmail: true });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ email: `${trimmed}@sellnest.local`, isEmail: false });
    }

    const supabase = await createServerSupabaseClient();

    // 1. First try calling the RPC get_email_by_username
    const { data: rpcEmail, error: rpcError } = await supabase.rpc(
      "get_email_by_username",
      { p_username: trimmed }
    );

    if (!rpcError && rpcEmail) {
      return NextResponse.json({ email: rpcEmail, isEmail: false });
    }

    // 2. Fallback to direct query on profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .ilike("username", trimmed)
      .maybeSingle();

    if (profile && profile.email) {
      return NextResponse.json({ email: profile.email, isEmail: false });
    }

    return NextResponse.json(
      { error: "No account found with this username. Please check spelling or use your registered email." },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to resolve username to email." },
      { status: 500 }
    );
  }
}

