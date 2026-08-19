import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineDocumentText } from 'react-icons/hi2'
import { formatFecha } from '@lib/dateHelpers'
import { formatNumber } from '@lib/utils'
import Button from '@components/Button'
import { computeIMC } from '@features/patients/nutricion/constants'

function buildResumen(reporte) {
  const parts = []
  const imc = computeIMC({ peso: reporte.peso, estatura: reporte.estatura })
  if (imc != null) parts.push(`IMC ${formatNumber(imc)}`)
  if (reporte.tipo === 'adulto') {
    const n = reporte.diagnosticos?.length ?? 0
    parts.push(`${n} diagnóstico${n === 1 ? '' : 's'}`)
  }
  return parts.length ? parts.join(' · ') : 'Sin datos de evaluación'
}

export default function EenReportCard({ reporte, onView, onEdit, onDelete }) {
  const esAdulto = reporte.tipo === 'adulto'

  return (
    <div
      onClick={() => onView?.(reporte)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView?.(reporte)
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`een-report-card-${reporte.id}`}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-zinc-100 bg-white p-4 transition-all duration-150 hover:border-teal-300 hover:shadow-sm"
    >
      <div className="absolute top-2.5 right-2.5 flex gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700"
          aria-label="Editar reporte EEN"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(reporte)
          }}
        >
          <HiOutlinePencilSquare size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-red-600"
          aria-label="Eliminar reporte EEN"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(reporte)
          }}
        >
          <HiOutlineTrash size={14} />
        </Button>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 pr-14">
        <HiOutlineDocumentText size={15} className="shrink-0 text-teal-500" />
        <time className="text-6 truncate font-semibold tracking-wide text-zinc-600 uppercase">
          {formatFecha(reporte.fecha_eval)}
        </time>
        <span className="text-7 rounded-md bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-500">
          {esAdulto ? 'Adulto' : 'Pediátrico'}
        </span>
      </div>

      <span className="text-7 text-zinc-400">{buildResumen(reporte)}</span>
    </div>
  )
}
