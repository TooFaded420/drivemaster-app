import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ message: "Resend not configured — skipping digest", sent: 0 });
    }

    const supabase = await createClient() as any;

    // Get all approved parent links with parent emails
    const { data: links, error } = await supabase
      .from("parent_links")
      .select(`
        parent_user_id,
        teen_user_id,
        parent:profiles!parent_user_id(email, username),
        teen:profiles!teen_user_id(username, test_date)
      `)
      .eq("status", "active");

    if (error || !links || links.length === 0) {
      return NextResponse.json({ message: "No linked parents found", sent: 0 });
    }

    let sent = 0;

    for (const link of links) {
      const parentEmail = (link.parent as any)?.email;
      const teenName = (link.teen as any)?.username || "Your teen";
      const testDate = (link.teen as any)?.test_date;

      if (!parentEmail) continue;

      // Get teen's stats for the past week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data: weeklyAttempts } = await supabase
        .from("user_attempts")
        .select("is_correct")
        .eq("user_id", link.teen_user_id)
        .gte("created_at", weekAgo);

      const { data: stats } = await supabase
        .from("user_stats")
        .select("total_xp, current_level, streak_count")
        .eq("user_id", link.teen_user_id)
        .maybeSingle();

      const totalAnswered = weeklyAttempts?.length || 0;
      const correctCount = weeklyAttempts?.filter((a: any) => a.is_correct).length || 0;
      const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
      const daysStudied = new Set(
        weeklyAttempts?.map((a: any) => new Date(a.created_at).toDateString()) || []
      ).size;

      // Calculate days until test
      let daysUntilTest = "";
      if (testDate) {
        const days = Math.ceil((new Date(testDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        daysUntilTest = days > 0 ? `${days} days until their test` : "Test date has passed";
      }

      // Send email via Resend
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "DriveMaster <updates@drivemaster.app>",
            to: parentEmail,
            subject: `${teenName}'s DriveMaster Weekly Update`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                <h1 style="color: #2563EB; font-size: 24px;">DriveMaster</h1>
                <h2 style="font-size: 20px; margin-top: 16px;">${teenName}'s Weekly Progress</h2>

                <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 16px 0;">
                  <p style="margin: 8px 0;"><strong>Days studied:</strong> ${daysStudied} of 7</p>
                  <p style="margin: 8px 0;"><strong>Questions answered:</strong> ${totalAnswered}</p>
                  <p style="margin: 8px 0;"><strong>Accuracy:</strong> ${accuracy}%</p>
                  <p style="margin: 8px 0;"><strong>Current streak:</strong> ${stats?.streak_count || 0} days</p>
                  <p style="margin: 8px 0;"><strong>Level:</strong> ${stats?.current_level || 1}</p>
                  ${daysUntilTest ? `<p style="margin: 8px 0;"><strong>${daysUntilTest}</strong></p>` : ""}
                </div>

                <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
                  You're receiving this because you linked your account to ${teenName}'s DriveMaster profile.
                </p>
              </div>
            `,
          }),
        });
        sent++;
      } catch (emailErr) {
        console.error(`Failed to send digest to ${parentEmail}:`, emailErr);
      }
    }

    return NextResponse.json({ message: `Digest sent to ${sent} parents`, sent });
  } catch (error) {
    console.error("Error in digest cron:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
