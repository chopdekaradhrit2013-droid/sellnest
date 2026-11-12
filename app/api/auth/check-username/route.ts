import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { available: false, error: "Username is required." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // Regex validation: 3-30 chars, alphanumeric + underscore or hyphen
    const usernameRegex = /^[a-z0-9_-]{3,30}$/;
    if (!usernameRegex.test(cleanUsername)) {
      return NextResponse.json(
        {
          available: false,
          error: "Username must be 3-30 characters and can only contain letters, numbers, underscores, and hyphens without spaces.",
        },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      // In unconfigured setup mode, inform client
      return NextResponse.json({ available: true, isDemo: true });
    }

    const supabase = await createServerSupabaseClient();

    // Call RPC or query profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .ilike("username", cleanUsername)
      .limit(1);

    if (error) {
      // If table doesn't exist yet, fall back gracefully
      console.warn("Profiles check warning:", error.message);
      return NextResponse.json({ available: true });
    }

    const isTaken = data && data.length > 0;
    return NextResponse.json({ available: !isTaken });
  } catch (err: any) {
    return NextResponse.json(
      { available: false, error: err.message || "Failed to check username." },
      { status: 500 }
    );
  }
}

