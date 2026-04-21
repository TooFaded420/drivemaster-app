import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/challenges/[id] — Load challenge details + questions
 *
 * Returns challenge info, questions with answers, and any existing results.
 * Handles: expired challenges, invalid IDs.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient() as any;

    // Require auth — challenge content includes questions
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch challenge
    const { data: challenge, error } = await supabase
      .from("challenges")
      .select("*, creator:profiles!creator_id(username)")
      .eq("id", id)
      .maybeSingle();

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    // Check expiry
    if (new Date(challenge.expires_at) < new Date() || challenge.status === "expired") {
      return NextResponse.json({
        error: "Challenge expired",
        expired: true,
        creatorName: (challenge.creator as any)?.username || "Someone",
      }, { status: 410 });
    }

    // Load questions in the challenge's order
    const { data: questions } = await supabase
      .from("questions")
      .select("*, answers(*)")
      .in("id", challenge.question_ids);

    // Reorder to match challenge question_ids order
    const orderedQuestions = challenge.question_ids
      .map((qId: number) => questions?.find((q: any) => q.id === qId))
      .filter(Boolean);

    // Get existing results for this challenge
    const { data: results } = await supabase
      .from("challenge_results")
      .select("user_id, score, correct_count, total_questions, completed_at")
      .eq("challenge_id", id);

    return NextResponse.json({
      challenge: {
        id: challenge.id,
        creatorId: challenge.creator_id,
        creatorName: (challenge.creator as any)?.username || "Someone",
        status: challenge.status,
        expiresAt: challenge.expires_at,
        questionCount: challenge.question_ids.length,
      },
      questions: orderedQuestions,
      results: results || [],
    });
  } catch (error) {
    console.error("Error loading challenge:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
