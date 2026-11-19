interface PageSkeletonProps {
  statCount?: number
  contentVariant?: "list" | "cards"
}

export function PageSkeleton({ statCount = 4, contentVariant = "list" }: PageSkeletonProps) {
  return (
    <div className="w-full animate-pulse space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-lg bg-white/10" />
          <div className="h-3.5 w-72 rounded-md bg-white/5" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-white/10" />
      </div>

      {statCount > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: statCount }).map((_, idx) => (
            <div
              key={idx}
              className="h-28 rounded-2xl border border-white/5 bg-[#1C1F26] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-24 rounded bg-white/10" />
                <div className="h-8 w-8 rounded-lg bg-white/5" />
              </div>
              <div className="mt-4 h-7 w-20 rounded-md bg-white/10" />
              <div className="mt-2 h-2.5 w-32 rounded bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {contentVariant === "cards" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="space-y-4 rounded-2xl border border-white/5 bg-[#1C1F26] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-5/6 rounded bg-white/5" />
                <div className="h-3 w-4/6 rounded bg-white/5" />
              </div>
              <div className="h-9 w-full rounded-xl bg-white/10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-white/5 bg-[#1C1F26] p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <div className="h-10 w-full rounded-xl bg-white/5 sm:w-72" />
            <div className="h-10 w-32 rounded-xl bg-white/5" />
          </div>

          <div className="space-y-5 pt-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="space-y-2.5 border-b border-white/5 pb-5 last:border-b-0 last:pb-0"
              >
                <div className="h-4 w-1/4 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-11/12 rounded bg-white/5" />
                <div className="h-3 w-3/4 rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
