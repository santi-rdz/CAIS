export default function PatientSearchSkeleton() {
  return (
    <div className="py-1">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 px-3 py-2.5">
          <div className="flex-1 space-y-1.5">
            <div
              className="h-3 animate-pulse rounded bg-zinc-100"
              style={{ width: `${60 - i * 8}%` }}
            />
            <div className="h-2.5 w-24 animate-pulse rounded bg-zinc-100" />
          </div>
          <div className="h-2.5 w-16 animate-pulse rounded bg-zinc-100" />
        </div>
      ))}
    </div>
  )
}
