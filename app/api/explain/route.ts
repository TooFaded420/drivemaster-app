import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/explain — AI-powered wrong answer explanation
 *
 * Calls synthetic.new API with Dash's hype-beast personality.
 * Caches results in ai_explanations table (same mistake = same explanation).
 * Falls back to static explanation if API is down/slow.
 *
 * Error handling:
 *   API timeout (>5s)  → static fallback
 *   API error          → static fallback
 *   API garbage        → static fallback
 *   Cache hit          → instant response
 */

const SYNTHETIC_API_URL = "https://api.synthetic.new/v1/chat/completions";
const TIMEOUT_MS = 5000;

const DASH_SYSTEM_PROMPT = `You are Dash, a hype-beast car mascot helping teens study for their driving test.
The user just answered a question wrong. Explain why they're wrong in 2-3 sentences.
Be ultra-casual, Gen Z, friendly. Never say "incorrect" or "wrong" — say "nah", "oof", or "close but".
Use at most one emoji. No exclamation marks after bad news.
Start by acknowledging their choice, then explain the right answer with a memorable hook.`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient() as any;
    const { questionId, selectedAnswerIndex, questionText, selectedAnswerText, correctAnswerText, staticExplanation } = await request.json();

    if (!questionId || selectedAnswerIndex === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check cache first
    const { data: cached } = await supabase
      .from("ai_explanations")
      .select("explanation")
      .eq("question_id", questionId)
      .eq("wrong_answer_index", selectedAnswerIndex)
      .maybeSingle();

    if (cached) {
      return NextResponse.json({ explanation: cached.explanation, source: "cache" });
    }

    // Call synthetic.new API
    const apiKey = process.env.SYNTHETIC_API_KEY;
    if (!apiKey) {
      // No API key configured — use static explanation
      return NextResponse.json({ explanation: staticExplanation || "Check the explanation above for the correct answer.", source: "static" });
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(SYNTHETIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "synthetic-small",
          messages: [
            { role: "system", content: DASH_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Question: ${questionText}\nThey picked: ${selectedAnswerText}\nCorrect answer: ${correctAnswerText}`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const explanation = data.choices?.[0]?.message?.content?.trim();

      if (!explanation || explanation.length < 10) {
        throw new Error("Empty or invalid response from API");
      }

      // Cache the result
      await supabase.from("ai_explanations").upsert({
        question_id: questionId,
        wrong_answer_index: selectedAnswerIndex,
        explanation,
      }, { onConflict: "question_id,wrong_answer_index" }).select();

      return NextResponse.json({ explanation, source: "ai" });
    } catch (err) {
      // API failed — fall back to static explanation
      console.error("synthetic.new API error:", err);
      return NextResponse.json({
        explanation: staticExplanation || "Check the explanation above for the correct answer.",
        source: "static_fallback",
      });
    }
  } catch (error) {
    console.error("Error in explain API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
