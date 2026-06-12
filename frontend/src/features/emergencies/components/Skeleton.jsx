// Mantiene la silueta real de EmergencyDetail (action bar + header card + grid)
// con el mismo chrome (rounded-2xl, shadow-card) para una transición sin saltos.
export default function Skeleton() {
  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-44 animate-pulse rounded bg-zinc-100" />
        <div className="flex gap-2">
          <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100" />
        </div>
      </div>

      {/* Header card */}
      <div className="shadow-card rounded-2xl border border-gray-100 bg-white p-6">
        <div className="space-y-2">
          <div className="h-3 w-36 animate-pulse rounded bg-zinc-100" />
          <div className="h-7 w-72 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
          <div className="h-6 w-40 animate-pulse rounded-md bg-zinc-100" />
          <div className="h-6 w-44 animate-pulse rounded-md bg-zinc-100" />
        </div>
      </div>

      {/* Patient + Medical */}
      <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
        <div className="h-52 animate-pulse rounded-2xl bg-zinc-100" />
        <div className="h-52 animate-pulse rounded-2xl bg-zinc-100" />
      </div>
    </div>
  )
}
