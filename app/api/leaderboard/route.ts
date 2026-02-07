import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/leaderboard
 * Get leaderboard data with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const type = searchParams.get("type") || "global";
    const league = searchParams.get("league");
    const state = searchParams.get("state");
    const limit = parseInt(searchParams.get("limit") || "100");

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from("leaderboard_entries")
      .select("*")
      .order("weekly_xp", { ascending: false })
      .limit(limit);

    // Apply filters based on type
    if (type === "league" && league) {
      query = query.eq("current_league", league);
    } else if (type === "state" && state) {
      query = query.eq("state", state);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    // Transform data to include rank
    const entries = (data || []).map((entry, index) => ({
      ...entry,
      rank: index + 1,
      isCurrentUser: entry.user_id === user?.id,
    }));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error in leaderboard API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
