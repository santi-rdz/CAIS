import { useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlineClock,
} from 'react-icons/hi2'
import EmptyState from '@components/EmptyState'
import Filter from '@ui/Filter'
import ActivityCard from './ActivityCard'

const FILTER_GROUPS = [
  {
    label: 'Tipo de actividad',
    field: 'entidad',
    options: [
      { label: 'Nota médica', value: 'NOTA_MEDICA' },
      { label: 'Historia médica', value: 'EXPEDIENTE_MEDICO' },
      { label: 'Paciente', value: 'PACIENTE' },
      { label: 'Emergencia', value: 'EMERGENCIA' },
    ],
  },
]

// Static activity data — will be replaced with real API data
const STATIC_ACTIVITIES = [
  {
    id: 1,
    accion: 'CREAR',
    entidad: 'NOTA_MEDICA',
    objetivo_nombre: 'María González Pérez',
    fecha_hora: '2026-04-19T10:30:00',
  },
  {
    id: 2,
    accion: 'CREAR',
    entidad: 'PACIENTE',
    objetivo_nombre: 'Carlos Ramírez López',
    fecha_hora: '2026-04-19T09:15:00',
  },
  {
    id: 3,
    accion: 'CREAR',
    entidad: 'EXPEDIENTE_MEDICO',
    objetivo_nombre: 'Ana Martínez Torres',
    fecha_hora: '2026-04-18T16:45:00',
  },
  {
    id: 4,
    accion: 'EDITAR',
    entidad: 'PACIENTE',
    objetivo_nombre: 'Roberto Sánchez Díaz',
    fecha_hora: '2026-04-18T09:00:00',
  },
  {
    id: 5,
    accion: 'CREAR',
    entidad: 'EMERGENCIA',
    objetivo_nombre: 'Laura Torres Vega',
    fecha_hora: '2026-04-17T11:20:00',
  },
  {
    id: 6,
    accion: 'CREAR',
    entidad: 'NOTA_MEDICA',
    objetivo_nombre: 'Pedro Ramírez Cruz',
    fecha_hora: '2026-04-16T13:00:00',
  },
  {
    id: 7,
    accion: 'EDITAR',
    entidad: 'EXPEDIENTE_MEDICO',
    objetivo_nombre: 'Juan Pérez Ramírez',
    fecha_hora: '2026-04-15T08:50:00',
  },
  {
    id: 8,
    accion: 'CREAR',
    entidad: 'PACIENTE',
    objetivo_nombre: 'Isabel Flores Mendoza',
    fecha_hora: '2026-04-14T15:30:00',
  },
]

export default function ActivityPanel() {
  const [layout, setLayout] = useState('list')
  const [searchParams] = useSearchParams()

  const entidadFilter = searchParams.get('entidad')
  const activeEntidades = entidadFilter ? entidadFilter.split(',') : []

  const filtered =
    activeEntidades.length > 0
      ? STATIC_ACTIVITIES.filter((a) => activeEntidades.includes(a.entidad))
      : STATIC_ACTIVITIES

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-5 text-zinc-400">
          {filtered.length} acciones recientes
        </p>
        <div className="flex items-center gap-2">
          <Filter groups={FILTER_GROUPS} placeholder="Filtrar actividad" />
          <div className="flex gap-1 rounded-lg border border-gray-200 p-1">
            <button
              className={`rounded p-2 text-gray-500 transition-colors ${
                layout === 'list'
                  ? 'bg-gray-100 text-gray-700'
                  : 'hover:bg-gray-50'
              }`}
              aria-label="Vista en lista"
              onClick={() => setLayout('list')}
            >
              <HiOutlineListBullet size={16} />
            </button>
            <button
              className={`rounded p-2 text-gray-500 transition-colors ${
                layout === 'grid'
                  ? 'bg-gray-100 text-gray-700'
                  : 'hover:bg-gray-50'
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
