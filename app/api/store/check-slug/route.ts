import { NextRequest, NextResponse } from "next/server";
import { validateSlug } from "@/lib/slugUtils";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawSlug = searchParams.get("slug") || "";
  const currentStoreId = searchParams.get("storeId");

  const validation = validateSlug(rawSlug);
  if (!validation.isValid) {
    return NextResponse.json({
      available: false,
      cleanSlug: validation.cleanSlug,
      error: validation.error,
    });
  }

  const cleanSlug = validation.cleanSlug;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Demo fallback: check against reserved handles
    return NextResponse.json({
      available: true,
      cleanSlug,
      message: "Handle is available (demo mode)",
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    let query = supabase
      .from("stores")
      .select("id, slug")
      .ilike("slug", cleanSlug);

    if (currentStoreId) {
      query = query.neq("id", currentStoreId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Error checking slug availability:", error);
      return NextResponse.json({
        available: true,
        cleanSlug,
      });
    }

    if (data) {
      return NextResponse.json({
        available: false,
        cleanSlug,
        error: `The handle "${cleanSlug}" is already taken by another store.`,
      });
    }

    return NextResponse.json({
      available: true,
      cleanSlug,
      message: "Handle is available!",
    });
  } catch (err: any) {
    console.error("Check slug exception:", err);
    return NextResponse.json({
      available: true,
      cleanSlug,
    });
  }
}

