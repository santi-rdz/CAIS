import usePermissions from '@hooks/usePermissions'
import { PERMISSIONS } from '@lib/permissions'
import { useDashboardStats } from '@features/dashboard/hooks/useDashboardStats'
import StatCard from '@features/dashboard/components/StatCard'
import ActivityFeed from '@features/dashboard/components/ActivityFeed'
import WeeklyTrendChart from '@features/dashboard/components/WeeklyTrendChart'
import { GenderPieChart, AgePieChart } from '@features/dashboard/components/DistributionPieChart'
import Heading from '@ui/components/Heading'
import {
  HiOutlineDocumentText,
  HiOutlineClipboardDocument,
  HiOutlineExclamationTriangle,
  HiOutlineUsers,
  HiOutlineUserGroup,
} from 'react-icons/hi2'

const MEDICINA_CARDS = (counts) => [
  {
    key: 'notas_evolucion',
    label: 'Notas de evolución',
    value: counts?.notas_evolucion,
    icon: <HiOutlineDocumentText size={18} />,
  },
  {
    key: 'historias_medicas',
    label: 'Historias médicas',
    value: counts?.historias_medicas,
    icon: <HiOutlineClipboardDocument size={18} />,
  },
  {
    key: 'emergencias',
    label: 'Emergencias',
    value: counts?.emergencias,
    icon: <HiOutlineExclamationTriangle size={18} />,
  },
]

const COMMON_CARDS = (counts) => [
  {
    key: 'pacientes',
    label: 'Pacientes registrados',
    value: counts?.pacientes,
    icon: <HiOutlineUsers size={18} />,
  },
  {
    key: 'usuarios_conectados',
    label: 'Usuarios conectados',
    value: counts?.usuarios_conectados,
    icon: <HiOutlineUserGroup size={18} />,
  },
]

export default function Dashboard() {
  const { can } = usePermissions()
  const { stats, isPending } = useDashboardStats()

  const counts = stats?.counts
  const areaCards = can(PERMISSIONS.SEE_MEDICINA_STATS) ? MEDICINA_CARDS(counts) : []

  const allCards = [...areaCards, ...COMMON_CARDS(counts)]

  return (
    <div className="space-y-6 p-6">
      <Heading as="h2" data-testid="page-title-dashboard">
        Dashboard
      </Heading>

      {/* Stat cards */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${allCards.length}, minmax(0, 1fr))` }}
      >
        {allCards.map((card, i) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            value={card.value}
            loading={isPending}
            colorIndex={i}
          />
        ))}
      </div>

      {/* Middle: activity + pie charts */}
      <div className="grid h-full grid-cols-3 grid-rows-[500px] gap-4">
        {/* Actividad reciente */}
        <section className="shadow-card col-span-2 flex min-h-0 flex-col rounded-2xl border border-gray-100 bg-white p-5">
          <Heading as="h4" className="mb-3 shrink-0">
            Actividad reciente
          </Heading>
          <ActivityFeed activity={stats?.actividad_reciente} loading={isPending} />
        </section>

        {/* Distribuciones */}
        <div className="flex h-full min-h-0 flex-col gap-4">
          <div className="shadow-card flex min-h-0 flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5">
            <GenderPieChart data={stats?.distribucion_genero} loading={isPending} />
          </div>
          <div className="shadow-card flex min-h-0 flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5">
            <AgePieChart data={stats?.distribucion_edad} loading={isPending} />
          </div>
        </div>
      </div>

      {/* Tendencia semanal */}
      <div className="shadow-card rounded-2xl border border-gray-100 bg-white p-5">
        <Heading as="h4" className="mb-4">
          Tendencia últimos 7 días
        </Heading>
        <WeeklyTrendChart data={stats?.tendencia_semanal} loading={isPending} />
      </div>
    </div>
  )
}
