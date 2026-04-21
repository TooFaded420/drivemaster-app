import { Skeleton } from "@/components/ui/skeleton";

export default function QuizLobbyLoading() {
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>

      {/* Quick Stats strip (3 cols) */}
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>

      {/* Quiz Modes section label */}
      <Skeleton className="h-5 w-28" />

      {/* 5 quiz-mode tiles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
          </div>
        </div>
      ))}

      {/* Daily Goal strip */}
      <div className="rounded-xl bg-blue-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-24 bg-blue-200" />
            <Skeleton className="h-3 w-40 bg-blue-200" />
          </div>
          <Skeleton className="h-7 w-14 rounded-full bg-blue-200" />
        </div>
        <Skeleton className="h-2 w-full rounded-full bg-blue-200" />
      </div>
    </div>
  );
}
