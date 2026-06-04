import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HiOutlineSquares2X2, HiOutlineListBullet, HiOutlineClock } from 'react-icons/hi2'
import EmptyState from '@components/EmptyState'
import Filter from '@ui/Filter'
import ActivityCard from '@features/users/components/ActivityCard'
import { useUserActivity } from '@features/users/hooks/useUserActivity'

const FILTER_GROUPS = [
  {
    label: 'Tipo de actividad',
    field: 'entidad',
    options: [
      { label: 'Nota de evolución', value: 'NOTA_EVOLUCION' },
      { label: 'Historia médica', value: 'HISTORIA_MEDICA' },
      { label: 'Paciente', value: 'PACIENTE' },
      { label: 'Emergencia', value: 'EMERGENCIA' },
    ],
  },
]

export default function ActivityPanel({ userId }) {
  const [layout, setLayout] = useState('list')
  const [searchParams] = useSearchParams()

  const entidadFilter = searchParams.get('entidad')
  const { activity, count, isPending } = useUserActivity(userId, {
    entidad: entidadFilter,
  })

  const filtered = activity

  if (isPending) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-5 text-zinc-400">{count} acciones recientes</p>
        <div className="flex items-center gap-2">
          <Filter groups={FILTER_GROUPS} placeholder="Filtrar actividad" />
          <div className="flex gap-1 rounded-lg border border-gray-200 p-1">
            <button
              className={`rounded p-2 text-gray-500 transition-colors ${
                layout === 'list' ? 'bg-gray-100 text-gray-700' : 'hover:bg-gray-50'
              }`}
              aria-label="Vista en lista"
              onClick={() => setLayout('list')}
            >
              <HiOutlineListBullet size={16} />
            </button>
            <button
              className={`rounded p-2 text-gray-500 transition-colors ${
                layout === 'grid' ? 'bg-gray-100 text-gray-700' : 'hover:bg-gray-50'
              }`}
              aria-label="Vista en grid"
              onClick={() => setLayout('grid')}
            >
              <HiOutlineSquares2X2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<HiOutlineClock size={24} />}
          message="Sin actividad registrada"
          hint="Las acciones de este usuario aparecerán aquí."
        />
      ) : layout === 'list' ? (
        <div>
          {filtered.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              layout="list"
              isLast={index === filtered.length - 1}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 280px)',
            gap: '12px',
          }}
        >
          {filtered.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} layout="grid" />
          ))}
        </div>
      )}
    </div>
  )
}
