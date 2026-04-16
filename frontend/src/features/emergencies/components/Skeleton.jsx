export default function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-44 animate-pulse rounded-lg bg-zinc-100" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <div className="h-3 w-36 animate-pulse rounded bg-zinc-100" />
          <div className="h-8 w-72 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="mt-5 flex gap-8 border-t border-gray-100 pt-5">
          <div className="h-4 w-20 animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-48 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-52 animate-pulse rounded-xl bg-zinc-100" />
        <div className="h-52 animate-pulse rounded-xl bg-zinc-100" />
      </div>
    </div>
  )
}
