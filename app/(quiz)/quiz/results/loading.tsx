import { Skeleton } from "@/components/ui/skeleton";

export default function QuizResultsLoading() {
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>

      {/* Big circular score placeholder */}
      <div className="rounded-xl bg-muted p-6 flex flex-col items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-48" />
        {/* Score percentage */}
        <Skeleton className="h-14 w-28" />
        {/* correct / wrong pills */}
        <div className="flex gap-3">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
      </div>

      {/* XP card */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>

      {/* 3-column stat strip */}
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>

      {/* Mascot placeholder / areas to improve */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </div>
    </div>
  );
}
