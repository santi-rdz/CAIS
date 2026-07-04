import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import Button from '@components/Button'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import { formatFecha } from '@lib/dateHelpers'

// Detalle de solo-lectura de una evaluación de monitoreo. Genérico como
// MonitoreoCard; a diferencia de BioqDetail no lleva tabs internas porque estos
// recursos son de una sola sección. `columns` reutiliza las mismas defs de la
// card ({ key, label, format? }); la `fecha` se muestra en el breadcrumb, así
// que se omite del cuerpo.
export default function MonitoreoDetail({
  row,
  title,
  backLabel,
  columns,
  onBack,
  onEdit,
  onDelete,
}) {
  const fields = columns
    .filter(({ key }) => key !== 'fecha')
    .map(({ key, label, format }) => ({
      label,
      value: format ? format(row[key]) : row[key],
    }))

  return (
    <div data-testid="monitoreo-detail">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">{backLabel}</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-5 font-semibold text-zinc-700">{formatFecha(row.fecha)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            className="p-2 text-zinc-400 hover:text-red-600"
            aria-label={`Eliminar ${title}`}
            onClick={() => onDelete?.(row)}
          >
            <HiOutlineTrash size={16} />
          </Button>
          <Button variant="secondary" size="md" className="gap-1.5" onClick={() => onEdit?.(row)}>
            <HiOutlinePencilSquare size={14} />
            Editar
          </Button>
        </div>
      </div>

      <div className="pt-1">
        <FieldsSection fields={fields} cols={3} />
      </div>
    </div>
  )
}
