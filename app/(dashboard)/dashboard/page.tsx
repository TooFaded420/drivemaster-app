import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardView,
  type DashboardCategoryProgress,
  type DashboardLeaderboardEntry,
  type DashboardStats,
} from "./dashboard-view";

export const metadata = {
  title: "Dashboard — Ace Your Permit",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // --- User stats (XP, level, streak) ---------------------------------------
  const { data: statsRow } = await supabase
    .from("user_stats")
    .select("total_xp, current_level, current_streak, longest_streak")
    .eq("user_id", user.id)
    .maybeSingle();

  // --- Attempts → questions answered + accuracy + per-category progress -----
  const { data: attempts } = await supabase
    .from("user_attempts")
    .select("is_correct, question_id")
    .eq("user_id", user.id);

  const attemptRows = attempts ?? [];
  const questionsAnswered = attemptRows.length;
  const correctCount = attemptRows.filter((a) => a.is_correct === true).length;
  const accuracy =
    questionsAnswered > 0 ? Math.round((correctCount / questionsAnswered) * 100) : 0;

  // Build category progress by joining question_id -> category_id, then
  // computing completed = distinct question_ids answered per category.
  let categories: DashboardCategoryProgress[] = [];
  if (attemptRows.length > 0) {
    const questionIds = Array.from(new Set(attemptRows.map((a) => a.question_id)));
    const { data: questions } = await supabase
      .from("questions")
      .select("id, category_id")
      .in("id", questionIds);

    const completedByCategory = new Map<string, Set<number>>();
    (questions ?? []).forEach((q) => {
      if (q.category_id == null) return;
      const set = completedByCategory.get(q.category_id) ?? new Set<number>();
      set.add(q.id);
      completedByCategory.set(q.category_id, set);
    });

    const categoryIds = Array.from(completedByCategory.keys());
    if (categoryIds.length > 0) {
      const { data: categoryRows } = await supabase
        .from("categories")
        .select("id, name, question_count")
        .in("id", categoryIds);

      categories = (categoryRows ?? [])
        .map((cat) => {
          const completed = completedByCategory.get(cat.id)?.size ?? 0;
          const total = cat.question_count ?? 0;
          const progress =
            total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
          return {
            id: cat.id,
            name: cat.name,
            completed,
            total,
            progress,
          };
        })
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 4);
    }
  }

  // --- Leaderboard preview (top 5 by weekly_xp) -----------------------------
  // NOTE: `leaderboard_entries` is a view created in migration 008. The
  // generated types file still carries a stale table definition with a
  // different shape, so we narrow the response type locally here.
  interface LeaderboardEntryRow {
    user_id: string;
    username: string | null;
    display_name: string | null;
    weekly_xp: number | null;
    rank: number | null;
  }
  const { data: leaderboardRowsRaw } = await supabase
    .from("leaderboard_entries")
    .select("user_id, username, display_name, weekly_xp, rank")
    .order("weekly_xp", { ascending: false })
    .limit(5);

  const leaderboardRows = (leaderboardRowsRaw ?? []) as unknown as LeaderboardEntryRow[];

  const leaderboard: DashboardLeaderboardEntry[] = leaderboardRows.map(
    (entry, index) => ({
      userId: entry.user_id,
      rank: entry.rank ?? index + 1,
      name:
        entry.user_id === user.id
          ? "You"
          : entry.display_name || entry.username || "Anonymous",
      weeklyXp: entry.weekly_xp ?? 0,
      isUser: entry.user_id === user.id,
    }),
  );

  const stats: DashboardStats = {
    totalXP: statsRow?.total_xp ?? 0,
    currentLevel: statsRow?.current_level ?? 1,
    currentStreak: statsRow?.current_streak ?? 0,
    longestStreak: statsRow?.longest_streak ?? 0,
    questionsAnswered,
    accuracy,
    hasStats: !!statsRow && ((statsRow.total_xp ?? 0) > 0 || questionsAnswered > 0),
  };

  return (
    <DashboardView stats={stats} categories={categories} leaderboard={leaderboard} />
  );
}
