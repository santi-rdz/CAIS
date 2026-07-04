import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import { formatFecha } from '@lib/dateHelpers'
import Button from '@components/Button'

// Card plana para una evaluación de monitoreo (sueño / actividad física).
// Genérica: `icon`, `summary` ({ key, label, format? }) y `row` la
// parametrizan — misma UX que BioqCard pero para recursos de una sola sección.
export default function MonitoreoCard({ row, icon: Icon, summary, onView, onEdit, onDelete }) {
  return (
    <div
      onClick={() => onView?.(row)}
      onKeyDown={(e) => {
        // Ignora Enter/Space que burbujea de los botones anidados de la card.
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView?.(row)
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`monitoreo-card-${row.id}`}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-zinc-100 bg-white p-4 transition-all duration-150 hover:border-teal-300 hover:shadow-sm"
    >
      <div className="absolute top-2.5 right-2.5 flex gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700"
          aria-label="Editar evaluación"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(row)
          }}
        >
          <HiOutlinePencilSquare size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-red-600"
          aria-label="Eliminar evaluación"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(row)
          }}
        >
          <HiOutlineTrash size={14} />
        </Button>
      </div>

      <div className="flex items-center gap-1.5 pr-14">
        <Icon size={15} className="shrink-0 text-teal-500" />
        <time className="text-6 truncate font-semibold tracking-wide text-zinc-600 uppercase">
          {formatFecha(row.fecha)}
        </time>
      </div>

      <dl className="flex flex-col gap-1.5">
        {summary.map(({ key, label, format }) => {
          const raw = row[key]
          const value = format ? format(raw) : raw
          const hasValue = value != null && String(value).trim() !== ''
          return (
            <div key={key} className="flex items-baseline justify-between gap-2">
              <dt className="text-7 tracking-wide text-zinc-400 uppercase">{label}</dt>
              <dd className={`text-6 truncate ${hasValue ? 'text-zinc-700' : 'text-zinc-300'}`}>
                {hasValue ? value : '—'}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
