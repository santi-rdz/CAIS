import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { STATS_RANGES } from '@cais/shared/constants/stats'

const SERIES = [
  // Medicina
  { key: 'notas_evolucion', label: 'Notas de evolución', color: '#10b981' },
  { key: 'historias_medicas', label: 'Historias médicas', color: '#3b82f6' },
  { key: 'emergencias', label: 'Emergencias', color: '#ef4444' },
  // Nutrición
  { key: 'historias_nutricion', label: 'Historias de nutrición', color: '#3b82f6' },
  { key: 'eval_antropometricas', label: 'Eval. antropométricas', color: '#8b5cf6' },
  { key: 'eval_nutricionales', label: 'Eval. nutricionales', color: '#14b8a6' },
  // Común
  { key: 'pacientes', label: 'Pacientes', color: '#f59e0b' },
]

// Año agrupa por mes ('YYYY-MM'); semana/mes por día ('YYYY-MM-DD').
function formatBucket(bucket, range) {
  try {
    if (range === STATS_RANGES.YEAR) {
      return format(parseISO(`${bucket}-01`), 'LLL', { locale: es })
    }
    return format(parseISO(bucket), 'd MMM', { locale: es })
  } catch {
    return bucket
  }
}

export default function TrendChart({ data, loading, range }) {
  if (loading) {
    return <div className="h-56 animate-pulse rounded-xl bg-gray-100" />
  }

  if (!data?.length) {
    return <p className="text-5 py-4 text-neutral-400">Sin datos de tendencia</p>
  }

  const chartData = data.map((d) => ({ ...d, fecha: formatBucket(d.fecha, range) }))
  const activeSeries = SERIES.filter(({ key }) =>
    data.some((item) => Object.prototype.hasOwnProperty.call(item, key))
  )

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          {activeSeries.map(({ key, color }) => (
            <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={16}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {activeSeries.map(({ key, label, color }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${key})`}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
