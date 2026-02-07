import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LEAGUES, LEAGUE_ORDER, getLeagueByXP } from "@/lib/gamification/leagues";

/**
 * GET /api/leaderboard/leagues
 * Get league information and user's current league status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get current season
    const now = new Date().toISOString();
    const { data: season, error: seasonError } = await supabase
      .from("league_seasons")
      .select("*")
      .lte("week_start", now)
      .gte("week_end", now)
      .eq("is_active", true)
      .single();

    if (seasonError) {
      console.error("Error fetching season:", seasonError);
    }

    let userLeagueData = null;

    if (user && season) {
      // Get user's league data
      const { data: userLeague, error: userLeagueError } = await supabase
        .from("user_leagues")
        .select("*")
        .eq("user_id", user.id)
        .eq("season_id", season.id)
        .single();

      if (!userLeagueError && userLeague) {
        // Get user's rank in their league
        const { data: rankings } = await supabase
          .from("user_leagues")
          .select("user_id, weekly_xp")
          .eq("current_league", userLeague.current_league)
          .eq("season_id", season.id)
          .order("weekly_xp", { ascending: false });

        const userRank = rankings?.findIndex((r: { user_id: string }) => r.user_id === user.id) ?? -1;

        userLeagueData = {
          ...userLeague,
          rank: userRank >= 0 ? userRank + 1 : null,
          totalInLeague: rankings?.length ?? 0,
        };
      }
    }

    return NextResponse.json({
      leagues: LEAGUES,
      leagueOrder: LEAGUE_ORDER,
      currentSeason: season,
      userLeague: userLeagueData,
    });
  } catch (error) {
    console.error("Error in leagues API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leaderboard/leagues/process
 * Process weekly league results - promotions and demotions
 * This should be called by a cron job at the end of each week
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify this is an admin or cron job request
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the season that just ended
    const now = new Date();
    const { data: endedSeason, error: seasonError } = await supabase
      .from("league_seasons")
      .select("*")
      .lt("week_end", now.toISOString())
      .eq("is_active", true)
      .single();

    if (seasonError || !endedSeason) {
      return NextResponse.json(
        { error: "No ended season found" },
        { status: 400 }
      );
    }

    // Get all user leagues for this season
    const { data: userLeagues, error: leaguesError } = await supabase
      .from("user_leagues")
      .select("*")
      .eq("season_id", endedSeason.id);

    if (leaguesError) {
      console.error("Error fetching user leagues:", leaguesError);
      return NextResponse.json(
        { error: "Failed to fetch user leagues" },
        { status: 500 }
      );
    }

    // Process each league tier
    const results = {
      promotions: 0,
      demotions: 0,
      stayed: 0,
    };

    for (const leagueTier of LEAGUE_ORDER) {
      // Get all users in this league tier
      const leagueUsers = userLeagues?.filter(
        (ul) => ul.current_league === leagueTier
      );

      if (!leagueUsers || leagueUsers.length === 0) continue;

      // Sort by weekly XP
      const sortedUsers = leagueUsers.sort((a, b) => b.weekly_xp - a.weekly_xp);

      const totalUsers = sortedUsers.length;
      const promotionZone = Math.ceil(totalUsers * 0.3);
      const demotionZone = Math.floor(totalUsers * 0.2);

      for (let i = 0; i < sortedUsers.length; i++) {
        const user = sortedUsers[i];
        const rank = i + 1;
        let newLeague = leagueTier;

        // Check for promotion (top 30%, not Diamond)
        if (rank <= promotionZone && leagueTier !== "diamond") {
          const currentIndex = LEAGUE_ORDER.indexOf(leagueTier);
          newLeague = LEAGUE_ORDER[currentIndex + 1];
          results.promotions++;
        }
        // Check for demotion (bottom 20%, not Bronze)
        else if (rank > totalUsers - demotionZone && leagueTier !== "bronze") {
          const currentIndex = LEAGUE_ORDER.indexOf(leagueTier);
          newLeague = LEAGUE_ORDER[currentIndex - 1];
          results.demotions++;
        } else {
          results.stayed++;
        }

        // Update user's league for next season
        await supabase.from("user_leagues").update({
          last_week_rank: rank,
          last_week_league: leagueTier,
          current_league: newLeague,
          weekly_xp: 0, // Reset weekly XP
          promotion_shown_at: null,
          demotion_warning_shown_at: null,
        }).eq("user_id", user.user_id);
      }
    }

    // Mark season as inactive
    await supabase
      .from("league_seasons")
      .update({ is_active: false })
      .eq("id", endedSeason.id);

    // Create new season
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    await supabase.from("league_seasons").insert({
      week_start: weekStart.toISOString(),
      week_end: weekEnd.toISOString(),
      is_active: true,
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error processing leagues:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
