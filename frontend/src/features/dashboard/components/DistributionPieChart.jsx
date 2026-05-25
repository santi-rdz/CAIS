import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const GENDER_ITEMS = [
  { key: 'Masculino', label: 'Hombres', color: '#3b82f6' }, // Blue-500
  { key: 'Femenino', label: 'Mujeres', color: '#ec4899' }, // Pink-500
]

const AGE_ITEMS = [
  { key: '< 18', label: '< 18 años', color: '#14b8a6' }, // Emerald-500
  { key: '18 - 59', label: '18 - 59 años', color: '#0ea5e9' }, // Teal-500
  { key: '>= 60', label: '>= 59 años', color: '#f59e0b' }, // Amber-500
]

function LegendItem({ color, label, count }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-gray-50/50 px-3 py-2 transition-colors hover:bg-gray-50">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900 tabular-nums">{count}</span>
    </div>
  )
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
        <p className="text-xs font-medium text-gray-500">{data.label}</p>
        <p className="mt-1 text-lg font-bold text-gray-900">{data.count}</p>
      </div>
    )
  }
  return null
}

function DistributionCard({ title, items, loading }) {
  if (loading) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
        <div className="grid grid-cols-[1fr_1.5fr] items-center gap-6">
          <div className="flex justify-center">
            <div className="h-32 w-32 animate-pulse rounded-full bg-gray-100" />
          </div>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.key} className="h-8 w-full animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const pieData = items.filter((item) => item.count > 0)

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <h3 className="shrink-0 text-sm font-semibold tracking-wider text-gray-500 uppercase">
        {title.replace('\n', ' ')}
      </h3>

      <div className="flex min-h-0 flex-1 flex-row items-center gap-6">
        {/* Chart Container */}
        <div className="relative h-[140px] w-[140px] shrink-0">
          {pieData.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-full border-2 border-dashed border-gray-200">
              <p className="text-xs font-medium text-gray-400">Sin datos</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Pie
                  data={pieData}
                  dataKey="count"
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="100%"
                  paddingAngle={4}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  cornerRadius={6}
                >
                  {pieData.map((item) => (
                    <Cell key={item.key} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend Container */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {items.map((item) => (
            <LegendItem key={item.key} color={item.color} label={item.label} count={item.count} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function GenderPieChart({ data, loading }) {
  const byKey = Object.fromEntries((data ?? []).map((d) => [d.genero, d.count]))
  const items = GENDER_ITEMS.map((g) => ({ ...g, count: byKey[g.key] ?? 0 }))

  return (
    <DistributionCard
      title={'Distribución por\ngenero de pacientes'}
      items={items}
      loading={loading}
    />
  )
}

export function AgePieChart({ data, loading }) {
  const byKey = Object.fromEntries((data ?? []).map((d) => [d.rango, d.count]))
  const items = AGE_ITEMS.map((a) => ({ ...a, count: byKey[a.key] ?? 0 }))

  return (
    <DistributionCard
      title={'Distribución por\nedad de pacientes'}
      items={items}
      loading={loading}
    />
  )
}
