import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineScale } from 'react-icons/hi2'
import { formatFecha } from '@lib/dateHelpers'
import Button from '@components/Button'

// Card de la lista de evaluaciones antropométricas. El endpoint de lista ya trae
// los bloques niño/adulto, así que la card resume por fecha, tipo e IMC.
export default function AntroCard({ evalAntro, onView, onEdit, onDelete }) {
  const esAdulto = Boolean(evalAntro.eval_antro_ad_adulto_nutricion)
  const tipo = esAdulto ? 'Adultos' : 'Infantil'

  return (
    <div
      onClick={() => onView?.(evalAntro)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView?.(evalAntro)
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`antro-card-${evalAntro.id}`}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-zinc-100 bg-white p-4 transition-all duration-150 hover:border-teal-300 hover:shadow-sm"
    >
      <div className="absolute top-2.5 right-2.5 flex gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700"
          aria-label="Editar evaluación antropométrica"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(evalAntro)
          }}
        >
          <HiOutlinePencilSquare size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-red-600"
          aria-label="Eliminar evaluación antropométrica"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(evalAntro)
          }}
        >
          <HiOutlineTrash size={14} />
        </Button>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 pr-14">
        <HiOutlineScale size={15} className="shrink-0 text-teal-500" />
        <time className="text-6 truncate font-semibold tracking-wide text-zinc-600 uppercase">
          {formatFecha(evalAntro.fecha)}
        </time>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-7 rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-500">
          {tipo}
        </span>
        {evalAntro.imc != null && <span className="text-7 text-zinc-400">IMC {evalAntro.imc}</span>}
      </div>
    </div>
  )
}
