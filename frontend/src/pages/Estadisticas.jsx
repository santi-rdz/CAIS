import { lazy, Suspense, useState } from 'react'
import {
  DEFAULT_STATS_RANGE,
  STATS_RANGE_LABELS,
  STATS_RANGE_CAPTIONS,
} from '@cais/shared/constants/stats'
import { useDashboardStats } from '@features/dashboard/hooks/useDashboardStats'
import StatCardsGrid from '@features/dashboard/components/StatCardsGrid'
import RangeSelect from '@features/dashboard/components/RangeSelect'
import ScopeBadge from '@features/dashboard/components/ScopeBadge'
import Button from '@ui/components/Button'
import Heading from '@ui/components/Heading'
import { HiOutlineArrowDownTray } from 'react-icons/hi2'

const TrendChart = lazy(() => import('@features/dashboard/components/TrendChart'))
const GenderPieChart = lazy(() =>
  import('@features/dashboard/components/DistributionPieChart').then((m) => ({
    default: m.GenderPieChart,
  }))
)
const AgePieChart = lazy(() =>
  import('@features/dashboard/components/DistributionPieChart').then((m) => ({
    default: m.AgePieChart,
  }))
)
const ProcedenciaPieChart = lazy(() =>
  import('@features/dashboard/components/DistributionPieChart').then((m) => ({
    default: m.ProcedenciaPieChart,
  }))
)

function ChartFallback({ height = 200 }) {
  return <div className="animate-pulse rounded-xl bg-gray-100" style={{ height }} />
}

// Tarjeta de distribución histórica (no depende del periodo).
function DistributionPanel({ children }) {
  return (
    <div className="shadow-card relative flex min-h-[260px] flex-col rounded-2xl border border-gray-100 bg-white p-5">
      <div className="absolute top-4 right-4 z-10">
        <ScopeBadge muted>Histórico</ScopeBadge>
      </div>
      <Suspense fallback={<ChartFallback height={220} />}>{children}</Suspense>
    </div>
  )
}

export default function Estadisticas() {
  const [range, setRange] = useState(DEFAULT_STATS_RANGE)
  const { stats, isPending } = useDashboardStats(range)

  const counts = stats?.counts
  const rangeLabel = STATS_RANGE_LABELS[range]
  const rangeCaption = STATS_RANGE_CAPTIONS[range]

  return (
    <div className="space-y-6 p-6">
      {/* Header: periodo + exportar */}
      <div className="flex items-center justify-between gap-4">
        <Heading as="h2" data-testid="page-title-estadisticas">
          Estadísticas
        </Heading>
        <div className="flex items-center gap-3">
          <RangeSelect value={range} onChange={setRange} />
          {/* TODO: exportación de estadísticas pendiente (PR siguiente). */}
          <Button variant="primary" size="md" disabled>
            <HiOutlineArrowDownTray size={16} />
            Exportar
          </Button>
        </div>
      </div>

      <StatCardsGrid
        counts={counts}
        loading={isPending}
        rangeCaption={rangeCaption}
        hideConnected
      />

      {/* Distribuciones — históricas */}
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
        <DistributionPanel>
          <GenderPieChart data={stats?.distribucion_genero} loading={isPending} />
        </DistributionPanel>
        <DistributionPanel>
          <AgePieChart data={stats?.distribucion_edad} loading={isPending} />
        </DistributionPanel>
        <DistributionPanel>
          <ProcedenciaPieChart data={stats?.distribucion_procedencia} loading={isPending} />
        </DistributionPanel>
      </div>

      {/* Tendencia */}
      <div className="shadow-card rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Heading as="h4">Tendencia</Heading>
          <ScopeBadge>{rangeLabel}</ScopeBadge>
        </div>
        <Suspense fallback={<ChartFallback height={250} />}>
          <TrendChart data={stats?.tendencia} loading={isPending} range={range} />
        </Suspense>
      </div>
    </div>
  )
}
