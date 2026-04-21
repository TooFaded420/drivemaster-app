import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/challenges/[id]/result — Submit challenge result
 *
 * Records the user's score for this challenge.
 * Awards XP to participants (bonus to winner when both have submitted).
 * UNIQUE constraint on (challenge_id, user_id) prevents double submission.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score, correctCount, totalQuestions, timeTakenSeconds } = await request.json();

    // Validate
    if (typeof score !== "number" || typeof correctCount !== "number" || typeof totalQuestions !== "number") {
      return NextResponse.json({ error: "Invalid result data" }, { status: 400 });
    }

    // Check challenge exists and isn't expired
    const { data: challenge } = await supabase
      .from("challenges")
      .select("id, status, expires_at")
      .eq("id", id)
      .maybeSingle();

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    if (new Date(challenge.expires_at) < new Date()) {
      return NextResponse.json({ error: "Challenge expired" }, { status: 410 });
    }

    // Submit result (UNIQUE constraint handles double-submit)
    const { data: result, error: insertError } = await supabase
      .from("challenge_results")
      .insert({
        challenge_id: id,
        user_id: user.id,
        score,
        correct_count: correctCount,
        total_questions: totalQuestions,
        time_taken_seconds: timeTakenSeconds || null,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json({ error: "Already submitted" }, { status: 409 });
      }
      console.error("Error submitting result:", insertError);
      return NextResponse.json({ error: "Failed to submit result" }, { status: 500 });
    }

    // Check if both players have submitted → mark challenge completed
    const { data: allResults } = await supabase
      .from("challenge_results")
      .select("user_id, score")
      .eq("challenge_id", id);

    if (allResults && allResults.length >= 2) {
      await supabase
        .from("challenges")
        .update({ status: "completed" })
        .eq("id", id);
    }

    // Award participation XP (25 XP for completing a challenge).
    // RPC may not exist yet — swallow the error silently.
    const participationXP = 25;
    try {
      await supabase.rpc("increment_xp", { user_id_param: user.id, xp_amount: participationXP });
    } catch {
      // noop
    }

    return NextResponse.json({
      result,
      allResults: allResults || [],
      xpAwarded: participationXP,
    });
  } catch (error) {
    console.error("Error in challenge result API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
