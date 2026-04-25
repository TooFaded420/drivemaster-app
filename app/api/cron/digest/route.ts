import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/cron/digest — Weekly parent progress email digest
 *
 * Called by Vercel Cron (weekly, Sunday morning).
 * Sends an email to each linked parent with their teen's progress.
 * Protected by CRON_SECRET.
 *
 * Uses Resend for transactional email. Falls back silently if
 * Resend is not configured.
 */

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret — must be first check before any DB access
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ message: "Resend not configured — skipping digest", sent: 0 });
    }

    // Use service-role client so we can call auth.admin APIs and bypass RLS
    const adminClient = createAdminClient();

    // Get all active parent links (status='active' per teen-consent model, migration 005)
    // Cap at 100 to avoid unbounded scans per cron run
    const { data: links, error } = await adminClient
      .from("parent_links")
      .select("parent_user_id, teen_user_id")
      .eq("status", "active")
      .limit(100);

    if (error || !links || links.length === 0) {
      return NextResponse.json({ message: "No linked parents found", sent: 0, skipped: 0 });
    }

    let sent = 0;
    let skipped = 0;

    for (const link of links) {
      if (!link.parent_user_id) {
        skipped++;
        continue;
      }

      // Resolve parent email from auth.users (profiles does NOT store email)
      const { data: parentAuthUser, error: parentErr } =
        await adminClient.auth.admin.getUserById(link.parent_user_id);

      const parentEmail = parentAuthUser?.user?.email;
      if (parentErr || !parentEmail) {
        skipped++;
        continue;
      }

      // Fetch teen profile for display name and test date
      const { data: teenProfile } = await adminClient
        .from("profiles")
        .select("username, test_date")
        .eq("id", link.teen_user_id)
        .maybeSingle();

      const teenName = teenProfile?.username || "Your teen";
      const testDate = teenProfile?.test_date ?? null;

      // Get teen's attempts for the past week
      // Column is `attempt_date` (not created_at) per database.ts / user_attempts schema
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]; // attempt_date is a DATE column

      const { data: weeklyAttempts } = await adminClient
        .from("user_attempts")
        .select("is_correct, attempt_date")
        .eq("user_id", link.teen_user_id)
        .gte("attempt_date", weekAgo);

      // Get teen's gamification stats
      // Column is `current_streak` (not streak_count) per migration 002 / user_stats schema
      const { data: stats } = await adminClient
        .from("user_stats")
        .select("total_xp, current_level, current_streak")
        .eq("user_id", link.teen_user_id)
        .maybeSingle();

      const totalAnswered = weeklyAttempts?.length ?? 0;
      const correctCount =
        weeklyAttempts?.filter((a) => a.is_correct).length ?? 0;
      const accuracy =
        totalAnswered > 0
          ? Math.round((correctCount / totalAnswered) * 100)
          : 0;
      const daysStudied = new Set(
        weeklyAttempts?.map((a) => a.attempt_date) ?? []
      ).size;

      // Calculate days until test
      let daysUntilTest = "";
      if (testDate) {
        const days = Math.ceil(
          (new Date(testDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        daysUntilTest =
          days > 0 ? `${days} days until their test` : "Test date has passed";
      }

      // Send email via Resend
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Ace Your Permit <updates@aceyourpermit.com>",
            to: parentEmail,
            subject: `${teenName}'s Ace Your Permit Weekly Update`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                <h1 style="color: #2563EB; font-size: 24px;">Ace Your Permit</h1>
                <h2 style="font-size: 20px; margin-top: 16px;">${teenName}'s Weekly Progress</h2>

                <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 16px 0;">
                  <p style="margin: 8px 0;"><strong>Days studied:</strong> ${daysStudied} of 7</p>
                  <p style="margin: 8px 0;"><strong>Questions answered:</strong> ${totalAnswered}</p>
                  <p style="margin: 8px 0;"><strong>Accuracy:</strong> ${accuracy}%</p>
                  <p style="margin: 8px 0;"><strong>Current streak:</strong> ${stats?.current_streak ?? 0} days</p>
                  <p style="margin: 8px 0;"><strong>Level:</strong> ${stats?.current_level ?? 1}</p>
                  ${daysUntilTest ? `<p style="margin: 8px 0;"><strong>${daysUntilTest}</strong></p>` : ""}
                </div>

                <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
                  You're receiving this because you linked your account to ${teenName}'s Ace Your Permit profile.
                </p>
              </div>
            `,
          }),
        });
        sent++;
      } catch (emailErr) {
        console.error(`Failed to send digest to ${parentEmail}:`, emailErr);
        skipped++;
      }
    }

    return NextResponse.json({
      message: `Digest sent to ${sent} parents`,
      sent,
      skipped,
    });
  } catch (error) {
    console.error("Error in digest cron:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
