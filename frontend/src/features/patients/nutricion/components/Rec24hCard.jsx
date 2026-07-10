import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineListBullet } from 'react-icons/hi2'
import { formatFecha } from '@lib/dateHelpers'
import Button from '@components/Button'
import { sumNutrient } from '@features/patients/nutricion/constants'

// Card de la lista de recordatorios. El endpoint de lista incluye las comidas, así
// que se resume por # de alimentos y calorías totales.
export default function Rec24hCard({ rec, onView, onEdit, onDelete }) {
  const comidas = rec.rec_24h_comidas ?? []
  const totalKcal = Math.round(sumNutrient(comidas, 'calorias'))

  return (
    <div
      onClick={() => onView?.(rec)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView?.(rec)
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`rec-24h-card-${rec.id}`}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-zinc-100 bg-white p-4 transition-all duration-150 hover:border-teal-300 hover:shadow-sm"
    >
      <div className="absolute top-2.5 right-2.5 flex gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700"
          aria-label="Editar recordatorio de 24 horas"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(rec)
          }}
        >
          <HiOutlinePencilSquare size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-red-600"
          aria-label="Eliminar recordatorio de 24 horas"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(rec)
          }}
        >
          <HiOutlineTrash size={14} />
        </Button>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 pr-14">
        <HiOutlineListBullet size={15} className="shrink-0 text-teal-500" />
        <time className="text-6 truncate font-semibold tracking-wide text-zinc-600 uppercase">
          {formatFecha(rec.fecha_eval)}
        </time>
      </div>

      <span className="text-7 text-zinc-400">
        {comidas.length} {comidas.length === 1 ? 'alimento' : 'alimentos'}
        {totalKcal > 0 && ` · ${totalKcal} kcal`}
      </span>
    </div>
  )
}
