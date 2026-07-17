import { lazy, Suspense, useState } from 'react'
import { cn } from '@lib/utils'
import usePermissions from '@hooks/usePermissions'
import {
  DEFAULT_STATS_RANGE,
  STATS_RANGE_LABELS,
  STATS_RANGE_CAPTIONS,
} from '@cais/shared/constants/stats'
import { useDashboardStats } from '@features/dashboard/hooks/useDashboardStats'
import StatCardsGrid from '@features/dashboard/components/StatCardsGrid'
import RangeSelect from '@features/dashboard/components/RangeSelect'
import ScopeBadge from '@features/dashboard/components/ScopeBadge'
import ActivityFeed from '@features/dashboard/components/ActivityFeed'
import Heading from '@ui/components/Heading'

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

function ChartFallback({ height = 200 }) {
  return <div className="animate-pulse rounded-xl bg-gray-100" style={{ height }} />
}

export default function Dashboard() {
  const { isPasante } = usePermissions()
  const [range, setRange] = useState(DEFAULT_STATS_RANGE)
  const { stats, isPending } = useDashboardStats(range)

  const counts = stats?.counts
  const activityTitle = isPasante ? 'Mi actividad reciente' : 'Actividad reciente'
  const trendTitle = isPasante ? 'Mi actividad' : 'Tendencia'
  const rangeLabel = STATS_RANGE_LABELS[range]
  const rangeCaption = STATS_RANGE_CAPTIONS[range]

  return (
    <div className="space-y-6 p-6">
      {/* Header + selector de periodo */}
      <div className="flex items-center justify-between gap-4">
        <Heading as="h2" data-testid="page-title-dashboard">
          Dashboard
        </Heading>
        <RangeSelect value={range} onChange={setRange} />
      </div>

      <StatCardsGrid counts={counts} loading={isPending} rangeCaption={rangeCaption} />

      {/* Middle: activity + pie charts (el pasante no ve distribuciones globales) */}
      <div className="grid h-full grid-cols-3 grid-rows-[500px] gap-4">
        {/* Actividad reciente */}
        <section
          className={cn(
            'shadow-card flex min-h-0 flex-col rounded-2xl border border-gray-100 bg-white p-5',
            isPasante ? 'col-span-3' : 'col-span-2'
          )}
        >
          <Heading as="h4" className="mb-3 shrink-0">
            {activityTitle}
          </Heading>
          <ActivityFeed activity={stats?.actividad_reciente} loading={isPending} />
        </section>

        {/* Distribuciones — históricas, no dependen del periodo */}
        {!isPasante && (
          <div className="flex h-full min-h-0 flex-col gap-4">
            <div className="shadow-card relative flex min-h-0 flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5">
              <div className="absolute top-4 right-4 z-10">
                <ScopeBadge muted>Histórico</ScopeBadge>
              </div>
              <Suspense fallback={<ChartFallback height={220} />}>
                <GenderPieChart data={stats?.distribucion_genero} loading={isPending} />
              </Suspense>
            </div>
            <div className="shadow-card relative flex min-h-0 flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5">
              <div className="absolute top-4 right-4 z-10">
                <ScopeBadge muted>Histórico</ScopeBadge>
              </div>
              <Suspense fallback={<ChartFallback height={220} />}>
                <AgePieChart data={stats?.distribucion_edad} loading={isPending} />
              </Suspense>
            </div>
          </div>
        )}
      </div>

      {/* Tendencia */}
      <div className="shadow-card rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Heading as="h4">{trendTitle}</Heading>
          <ScopeBadge>{rangeLabel}</ScopeBadge>
        </div>
        <Suspense fallback={<ChartFallback height={250} />}>
          <TrendChart data={stats?.tendencia} loading={isPending} range={range} />
        </Suspense>
      </div>
    </div>
  )
}
