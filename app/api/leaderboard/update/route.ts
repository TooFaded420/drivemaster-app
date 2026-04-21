import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getIdentifier,
  getRateLimiter,
  rateLimitHeaders,
} from "@/lib/ratelimit";

const rlLeaderboardUpdate = getRateLimiter("leaderboard:update", 60, 60); // 60/min

/**
 * POST /api/leaderboard/update
 * Update user's weekly XP after completing a quiz or activity.
 *
 * Uses the `increment_weekly_xp` Postgres RPC for an atomic update
 * (see supabase/migrations/003_atomic_xp_update.sql). The previous
 * read-then-write pattern was vulnerable to concurrent-write races.
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

    const { success, retryAfter } = await rlLeaderboardUpdate.limit(
      getIdentifier(request, user.id)
    );
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Try again soon." },
        { status: 429, headers: rateLimitHeaders(retryAfter) }
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

    // Atomic increment via RPC (cap enforced server-side at 500 as well).
    const { data: newWeeklyXp, error: rpcError } = await supabase.rpc(
      "increment_weekly_xp",
      {
        user_id: user.id,
        xp_amount: xpEarned,
        max_per_call: 500,
      }
    );

    if (rpcError) {
      console.error("Error incrementing weekly XP:", rpcError);
      return NextResponse.json(
        { error: "Failed to update weekly XP" },
        { status: 500 }
      );
    }

    // Also update total XP in user_stats.
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
      data: { weekly_xp: newWeeklyXp },
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
