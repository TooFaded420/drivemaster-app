import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getIdentifier,
  getRateLimiter,
  rateLimitHeaders,
} from "@/lib/ratelimit";
import crypto from "crypto";

const TOO_MANY = { error: "Too many requests. Try again soon." };

// Per-route limiters (constructed once per module load via the cached Map).
const rlGenerate = getRateLimiter("parent:generate", 5, 60 * 60); // 5/hour
const rlLink = getRateLimiter("parent:link", 10, 60 * 60); // 10/hour
const rlParentGet = getRateLimiter("parent:get", 60, 60); // 60/min

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
      const { success, retryAfter } = await rlGenerate.limit(
        getIdentifier(request, user.id)
      );
      if (!success) {
        return NextResponse.json(TOO_MANY, {
          status: 429,
          headers: rateLimitHeaders(retryAfter),
        });
      }
      // Don't silently overwrite an approved (active) link. If the teen
      // already has an active parent, they must explicitly remove that
      // link before generating a new invite. Regenerating while the
      // request is still pending_teen_approval (or any earlier state)
      // is fine — the teen hasn't consented yet.
      const { data: existing } = await supabase
        .from("parent_links")
        .select("status")
        .eq("teen_user_id", user.id)
        .maybeSingle();

      if (existing?.status === "active") {
        return NextResponse.json(
          {
            error:
              "You already have an approved parent. Remove the existing link before generating a new code.",
          },
          { status: 409 }
        );
      }

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
      const { success, retryAfter } = await rlLink.limit(
        getIdentifier(request, user.id)
      );
      if (!success) {
        return NextResponse.json(TOO_MANY, {
          status: 429,
          headers: rateLimitHeaders(retryAfter),
        });
      }

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
      if (!link.invite_expires_at || new Date(link.invite_expires_at) < new Date()) {
        return NextResponse.json({ error: "This invite code has expired. Ask your teen for a new one." }, { status: 410 });
      }

      // Prevent self-linking
      if (link.teen_user_id === user.id) {
        return NextResponse.json({ error: "You can't link to your own account" }, { status: 400 });
      }

      // Attach parent and mark as pending teen approval (minor-consent flow).
      const { error: updateError } = await supabase
        .from("parent_links")
        .update({
          parent_user_id: user.id,
          status: "pending_teen_approval",
          linked_at: new Date().toISOString(),
        })
        .eq("id", link.id);

      if (updateError) {
        console.error("Error linking parent:", updateError);
        return NextResponse.json({ error: "Failed to link account" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Request sent. Your teen needs to approve the link before you'll see their progress.",
        status: "pending_teen_approval",
      });
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

    const { success, retryAfter } = await rlParentGet.limit(
      getIdentifier(request, user.id)
    );
    if (!success) {
      return NextResponse.json(TOO_MANY, {
        status: 429,
        headers: rateLimitHeaders(retryAfter),
      });
    }

    // Check if user is a teen with a link
    const { data: asTeenLink } = await supabase
      .from("parent_links")
      .select("invite_code, status, parent_user_id, invite_expires_at")
      .eq("teen_user_id", user.id)
      .maybeSingle();

    // Check if user is a parent with a link. Until the teen approves
    // (status === 'active'), we strip the teen join so the parent gets
    // "pending approval" UI with zero teen PII. This prevents a parent
    // who only knows the invite code from learning who the teen is.
    const { data: asParentLinkRaw } = await supabase
      .from("parent_links")
      .select("status, teen_user_id, teen:profiles!teen_user_id(username)")
      .eq("parent_user_id", user.id)
      .maybeSingle();

    let asParentLink: {
      status: string;
      teen_user_id: string | null;
      teen: { username: string } | null;
    } | null = null;

    if (asParentLinkRaw) {
      if (asParentLinkRaw.status === "active") {
        // Supabase typegen can shape the join as object or array.
        const teenJoin = Array.isArray(asParentLinkRaw.teen)
          ? asParentLinkRaw.teen[0]
          : asParentLinkRaw.teen;
        asParentLink = {
          status: asParentLinkRaw.status,
          teen_user_id: asParentLinkRaw.teen_user_id,
          teen: (teenJoin as { username: string } | null) ?? null,
        };
      } else {
        asParentLink = {
          status: asParentLinkRaw.status,
          teen_user_id: null,
          teen: null,
        };
      }
    }

    return NextResponse.json({
      asTeen: asTeenLink || null,
      asParent: asParentLink,
    });
  } catch (error) {
    console.error("Error in parent GET API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
