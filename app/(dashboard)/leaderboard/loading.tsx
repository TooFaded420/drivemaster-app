import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="h-9 w-40" />
          </div>
          <Skeleton className="h-4 w-56" />
        </div>
        {/* League badge */}
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>

      {/* Weekly reset timer */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main leaderboard table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab strip */}
          <Skeleton className="h-10 w-full rounded-lg" />

          {/* 10-row leaderboard */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                {/* Rank */}
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                {/* Avatar + name */}
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                  <Skeleton className="h-4 w-28" />
                </div>
                {/* XP */}
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly progress card */}
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* League info card */}
          <div className="rounded-xl border bg-card p-5 space-y-3">
            <Skeleton className="h-5 w-28" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="w-7 h-7 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
