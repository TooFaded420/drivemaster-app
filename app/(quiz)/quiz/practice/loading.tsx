import { Skeleton } from "@/components/ui/skeleton";

export default function PracticeQuizLoading() {
  return (
    <div className="space-y-6 p-4">
      {/* Progress bar at top */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Question card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-28 rounded-full" />

        {/* Question text — 2-3 lines */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/6" />
        </div>
      </div>

      {/* 4 answer bars */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>

      {/* Navigation row */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
}
