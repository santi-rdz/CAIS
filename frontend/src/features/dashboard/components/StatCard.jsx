const ACCENT_COLORS = [
  { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { bg: 'bg-blue-50',    text: 'text-blue-600' },
  { bg: 'bg-amber-50',   text: 'text-amber-600' },
  { bg: 'bg-rose-50',    text: 'text-rose-600' },
  { bg: 'bg-violet-50',  text: 'text-violet-600' },
]

export default function StatCard({ icon, label, value, loading, colorIndex = 0 }) {
  const accent = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${accent.bg} ${accent.text}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" />
        ) : (
          <p className="text-3xl font-bold tabular-nums tracking-tight text-gray-900">
            {value ?? 0}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span className="flex h-1.5 w-1.5 rounded-full bg-green-500" />
        <p className="text-xs font-medium text-gray-400">Últimos 30 días</p>
      </div>
    </div>
  )
}
