import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineCalculator } from 'react-icons/hi2'
import { formatFecha } from '@lib/dateHelpers'
import Button from '@components/Button'

const round = (n) => Math.round(Number(n) || 0)

// Card de la lista de cálculos de GET. El endpoint de lista incluye los totales
// obtenidos derivados, así que se resume por energía obtenida.
export default function CalGetNutrCard({ registro, onView, onEdit, onDelete }) {
  const totalKcal = round(registro.total_kcal)

  return (
    <div
      onClick={() => onView?.(registro)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView?.(registro)
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`cal-get-nutr-card-${registro.id}`}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-zinc-100 bg-white p-4 transition-all duration-150 hover:border-teal-300 hover:shadow-sm"
    >
      <div className="absolute top-2.5 right-2.5 flex gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700"
          aria-label="Editar cálculo de GET nutricional"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(registro)
          }}
        >
          <HiOutlinePencilSquare size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-red-600"
          aria-label="Eliminar cálculo de GET nutricional"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(registro)
          }}
        >
          <HiOutlineTrash size={14} />
        </Button>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 pr-14">
        <HiOutlineCalculator size={15} className="shrink-0 text-teal-500" />
        <time className="text-6 truncate font-semibold tracking-wide text-zinc-600 uppercase">
          {formatFecha(registro.fecha_eval)}
        </time>
      </div>

      <span className="text-7 text-zinc-400">
        {totalKcal > 0 ? `${totalKcal} kcal obtenidas` : 'Sin equivalentes'}
      </span>
    </div>
  )
}
