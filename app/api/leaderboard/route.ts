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
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Require auth — leaderboard exposes per-user data
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from("leaderboard_entries")
      .select("*", { count: "exact" })
      .order("weekly_xp", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters based on type
    if (type === "league" && league) {
      query = query.eq("current_league", league);
    } else if (type === "state" && state) {
      query = query.eq("state", state);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    // Transform data to include rank (offset-aware for pagination)
    const entries = (data || []).map((entry, index) => ({
      ...entry,
      rank: offset + index + 1,
      isCurrentUser: entry.user_id === user?.id,
    }));

    return NextResponse.json({
      entries,
      pagination: {
        total: count ?? 0,
        offset,
        limit,
        hasMore: (count ?? 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error("Error in leaderboard API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
