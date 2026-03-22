import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/leaderboard/update
 * Update user's weekly XP after completing a quiz or activity
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const { xpEarned, activityType } = await request.json();

    if (!xpEarned || typeof xpEarned !== "number" || xpEarned <= 0 || xpEarned > 500 || !Number.isInteger(xpEarned)) {
      return NextResponse.json(
        { error: "Invalid XP amount. Must be a positive integer up to 500." },
        { status: 400 }
      );
    }

    // Get current season
    const now = new Date().toISOString();
    const { data: season, error: seasonError } = await supabase
      .from("league_seasons")
      .select("id")
      .lte("week_start", now)
      .gte("week_end", now)
      .eq("is_active", true)
      .single();

    if (seasonError || !season) {
      return NextResponse.json(
        { error: "No active season found" },
        { status: 400 }
      );
    }

    // Get or create user league record
    const { data: userLeague, error: userLeagueError } = await supabase
      .from("user_leagues")
      .select("*")
      .eq("user_id", user.id)
      .eq("season_id", season.id)
      .single();

    if (userLeagueError && userLeagueError.code !== "PGRST116") {
      console.error("Error fetching user league:", userLeagueError);
      return NextResponse.json(
        { error: "Failed to fetch user league" },
        { status: 500 }
      );
    }

    let result;

    if (!userLeague) {
      // Create new user league record
      const { data, error } = await supabase
        .from("user_leagues")
        .insert({
          user_id: user.id,
          season_id: season.id,
          current_league: "bronze",
          weekly_xp: xpEarned,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating user league:", error);
        return NextResponse.json(
          { error: "Failed to create user league" },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Update existing record
      const { data, error } = await supabase
        .from("user_leagues")
        .update({
          weekly_xp: userLeague.weekly_xp + xpEarned,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("season_id", season.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating user league:", error);
        return NextResponse.json(
          { error: "Failed to update user league" },
          { status: 500 }
        );
      }

      result = data;
    }

    // Also update total XP in user_stats
    const { data: userStats } = await supabase
      .from("user_stats")
      .select("total_xp")
      .eq("user_id", user.id)
      .single();

    if (userStats) {
      await supabase
        .from("user_stats")
        .update({
          total_xp: userStats.total_xp + xpEarned,
        })
        .eq("user_id", user.id);
    }

    return NextResponse.json({
      success: true,
      data: result,
      xpAdded: xpEarned,
      activityType,
    });
  } catch (error) {
    console.error("Error in leaderboard update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
