import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * POST /api/challenges — Create a new challenge
 *
 * Generates a seed, deterministically selects 10 questions,
 * stores the challenge with 7-day expiry.
 *
 * Returns: { id, shareUrl, questionCount, expiresAt }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a random seed
    const seed = crypto.randomBytes(16).toString("hex");

    // Fetch all active question IDs
    const { data: questions, error: qError } = await supabase
      .from("questions")
      .select("id")
      .eq("is_active", true);

    if (qError || !questions || questions.length < 10) {
      return NextResponse.json({ error: "Not enough questions available" }, { status: 500 });
    }

    // Deterministically select 10 questions using the seed
    const questionIds = selectQuestionsFromSeed(
      questions.map((q) => q.id),
      seed,
      10
    );

    // Create the challenge (expires in 7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: challenge, error: createError } = await supabase
      .from("challenges")
      .insert({
        creator_id: user.id,
        seed,
        question_ids: questionIds,
        status: "open",
        expires_at: expiresAt,
      })
      .select("id, expires_at")
      .single();

    if (createError) {
      console.error("Error creating challenge:", createError);
      return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    return NextResponse.json({
      id: challenge.id,
      shareUrl: `${baseUrl}/challenge/${challenge.id}`,
      questionCount: questionIds.length,
      expiresAt: challenge.expires_at,
    });
  } catch (error) {
    console.error("Error in challenges API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Deterministically select N questions from a list using a seed.
 * Uses seeded Fisher-Yates shuffle so both players get the same questions.
 */
function selectQuestionsFromSeed(allIds: number[], seed: string, count: number): number[] {
  // Create a seeded random number generator using SHA-256
  const ids = [...allIds];
  let hashInput = seed;

  for (let i = ids.length - 1; i > 0; i--) {
    // Generate a deterministic "random" number from the seed
    const hash = crypto.createHash("sha256").update(hashInput + i).digest();
    const rand = hash.readUInt32BE(0) / 0xffffffff;
    const j = Math.floor(rand * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
    hashInput = hash.toString("hex").slice(0, 32);
  }

  return ids.slice(0, count);
}
