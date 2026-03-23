export default function PatientSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-7 w-32 animate-pulse rounded-lg bg-zinc-100" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 animate-pulse rounded-full bg-zinc-100" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-64 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-40 animate-pulse rounded bg-zinc-100" />
            <div className="mt-3 flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
              <div className="h-6 w-32 animate-pulse rounded-full bg-zinc-100" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-100" />
            </div>
          </div>
        </div>
        <div className="mt-5 h-9 animate-pulse rounded-lg bg-zinc-100" />
      </div>
      <div className="space-y-3">
        <div className="h-28 animate-pulse rounded-xl bg-zinc-100" />
        <div className="h-28 animate-pulse rounded-xl bg-zinc-100" />
      </div>
    </div>
  )
}
