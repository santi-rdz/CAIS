import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2'
import { formatFecha } from '@lib/dateHelpers'
import Button from '@components/Button'

// Card plana de la lista de exámenes físicos. El endpoint de lista devuelve solo
// campos básicos (id/fecha), así que la card resume por fecha; el detalle
// completo se carga al abrir (por id).
export default function ExamFisCard({ exam, onView, onEdit, onDelete }) {
  return (
    <div
      onClick={() => onView?.(exam)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView?.(exam)
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`exam-card-${exam.id}`}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-zinc-100 bg-white p-4 transition-all duration-150 hover:border-teal-300 hover:shadow-sm"
    >
      <div className="absolute top-2.5 right-2.5 flex gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700"
          aria-label="Editar examen físico"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(exam)
          }}
        >
          <HiOutlinePencilSquare size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-red-600"
          aria-label="Eliminar examen físico"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(exam)
          }}
        >
          <HiOutlineTrash size={14} />
        </Button>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 pr-14">
        <HiOutlineClipboardDocumentCheck size={15} className="shrink-0 text-teal-500" />
        <time className="text-6 truncate font-semibold tracking-wide text-zinc-600 uppercase">
          {formatFecha(exam.fecha ?? exam.creado_at)}
        </time>
      </div>

      <span className="text-7 text-zinc-400">Examen físico</span>
    </div>
  )
}
