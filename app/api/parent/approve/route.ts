import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/parent/approve — teen approves or rejects a pending parent link.
 *
 * Body: { approve: boolean }
 *
 * Called by the authenticated TEEN. Flips a pending_teen_approval row
 * on parent_links to either `active` (approve) or `rejected` (decline).
 *
 * This enforces minor consent: a parent cannot see their teen's data
 * until the teen explicitly approves the link. All downstream queries
 * (e.g. the weekly digest) MUST filter on status = 'active'.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const approve = body?.approve;

    if (typeof approve !== "boolean") {
      return NextResponse.json({ error: "Missing 'approve' boolean" }, { status: 400 });
    }

    // Find the pending link where the caller is the teen.
    const { data: link, error: findError } = await supabase
      .from("parent_links")
      .select("id, teen_user_id, parent_user_id, status")
      .eq("teen_user_id", user.id)
      .eq("status", "pending_teen_approval")
      .maybeSingle();

    if (findError) {
      console.error("Error looking up pending link:", findError);
      return NextResponse.json({ error: "Failed to load link" }, { status: 500 });
    }

    if (!link || !link.parent_user_id) {
      return NextResponse.json({ error: "No pending parent link to approve" }, { status: 404 });
    }

    const nextStatus = approve ? "active" : "rejected";

    const { error: updateError } = await supabase
      .from("parent_links")
      .update({
        status: nextStatus,
        approved_at: approve ? new Date().toISOString() : null,
      })
      .eq("id", link.id)
      .eq("teen_user_id", user.id); // defense in depth

    if (updateError) {
      console.error("Error updating parent link status:", updateError);
      return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
    }

    return NextResponse.json({ success: true, status: nextStatus });
  } catch (error) {
    console.error("Error in parent approve API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
