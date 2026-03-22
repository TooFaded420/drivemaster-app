import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * Parent Linking API
 *
 * POST /api/parent         — Generate invite code (teen) or link with code (parent)
 * GET  /api/parent         — Get current link status
 *
 * Flow:
 *   Teen generates 6-char invite code → shares with parent →
 *   Parent enters code → link request created (status: pending) →
 *   Teen approves → status: approved → parent gets weekly digest
 */

// POST: generate code OR link with code
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, inviteCode } = await request.json();

    if (action === "generate") {
      // Teen generates an invite code
      const code = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-char hex
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h expiry

      // Upsert: replace any existing code for this teen
      const { data, error } = await supabase
        .from("parent_links")
        .upsert({
          teen_user_id: user.id,
          invite_code: code,
          invite_expires_at: expiresAt,
          status: "pending",
        }, { onConflict: "teen_user_id" })
        .select("invite_code, invite_expires_at")
        .single();

      if (error) {
        console.error("Error generating invite code:", error);
        return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
      }

      return NextResponse.json({ code: data.invite_code, expiresAt: data.invite_expires_at });
    }

    if (action === "link") {
      // Parent links with an invite code
      if (!inviteCode || inviteCode.length !== 6) {
        return NextResponse.json({ error: "Invalid invite code" }, { status: 400 });
      }

      // Find the pending link with this code
      const { data: link, error: findError } = await supabase
        .from("parent_links")
        .select("id, teen_user_id, invite_expires_at, status")
        .eq("invite_code", inviteCode.toUpperCase())
        .eq("status", "pending")
        .maybeSingle();

      if (!link) {
        return NextResponse.json({ error: "Invalid or expired invite code" }, { status: 404 });
      }

      // Check expiry
      if (new Date(link.invite_expires_at) < new Date()) {
        return NextResponse.json({ error: "This invite code has expired. Ask your teen for a new one." }, { status: 410 });
      }

      // Prevent self-linking
      if (link.teen_user_id === user.id) {
        return NextResponse.json({ error: "You can't link to your own account" }, { status: 400 });
      }

      // Update the link with parent info
      const { error: updateError } = await supabase
        .from("parent_links")
        .update({
          parent_user_id: user.id,
          status: "approved", // Auto-approve for v1 (teen approval flow deferred)
          linked_at: new Date().toISOString(),
        })
        .eq("id", link.id);

      if (updateError) {
        console.error("Error linking parent:", updateError);
        return NextResponse.json({ error: "Failed to link account" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Linked! You'll receive weekly progress updates." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in parent API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: check link status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a teen with a link
    const { data: asTeenLink } = await supabase
      .from("parent_links")
      .select("invite_code, status, parent_user_id, invite_expires_at")
      .eq("teen_user_id", user.id)
      .maybeSingle();

    // Check if user is a parent with a link
    const { data: asParentLink } = await supabase
      .from("parent_links")
      .select("status, teen_user_id, teen:profiles!teen_user_id(username)")
      .eq("parent_user_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      asTeen: asTeenLink || null,
      asParent: asParentLink || null,
    });
  } catch (error) {
    console.error("Error in parent GET API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
