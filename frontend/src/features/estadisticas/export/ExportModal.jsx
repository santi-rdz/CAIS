import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'
import { HiCheck, HiOutlineTableCells, HiOutlineDocumentText } from 'react-icons/hi2'
import { cn } from '@lib/utils'
import Button from '@components/Button'
import { buildStatsExport, exportFileName } from '@features/estadisticas/export/buildStatsExport'
import { exportStatsExcel } from '@features/estadisticas/export/exportStatsExcel'
import StatsPdfDocument from '@features/estadisticas/export/StatsPdfDocument'

const FORMATS = [
  { key: 'excel', label: 'Excel', hint: 'Formato .xlsx', ext: 'xlsx', icon: HiOutlineTableCells },
  { key: 'pdf', label: 'PDF', hint: 'Formato .pdf', ext: 'pdf', icon: HiOutlineDocumentText },
]

function FormatCard({ format, selected, onSelect }) {
  const Icon = format.icon
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex flex-1 flex-col items-center gap-2 rounded-xl border p-5 transition-colors',
        selected ? 'border-green-800 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-green-800 text-white">
          <HiCheck size={12} strokeWidth={3} />
        </span>
      )}
      <span
        className={cn(
          'grid size-12 place-items-center rounded-xl',
          selected ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-500'
        )}
      >
        <Icon size={24} />
      </span>
      <span className="text-5 font-medium text-gray-800">{format.label}</span>
      <span className="text-6 text-gray-500">{format.hint}</span>
    </button>
  )
}

export default function ExportModal({ context, onCloseModal }) {
  const [selected, setSelected] = useState('excel')
  const [isExporting, setIsExporting] = useState(false)
  const format = FORMATS.find((f) => f.key === selected)

  async function handleExport() {
    if (!context.stats?.counts) {
      toast.error('No hay datos para exportar todavía')
      return
    }
    setIsExporting(true)
    try {
      const model = buildStatsExport(context.stats, context.meta)
      const fileName = exportFileName(context.meta.area, format.ext)
      if (format.key === 'excel') {
        await exportStatsExcel(model, fileName)
      } else {
        const blob = await pdf(<StatsPdfDocument model={model} />).toBlob()
        saveAs(blob, fileName)
      }
      toast.success('Estadísticas exportadas correctamente')
      onCloseModal?.()
    } catch (err) {
      console.error('Error al exportar estadísticas:', err)
      toast.error('No se pudieron exportar las estadísticas')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex w-[440px] flex-col gap-5 max-sm:w-full">
      <div>
        <h3 className="text-3 font-medium text-gray-800">Exportar Estadísticas</h3>
        <p className="text-6 mt-1 text-gray-500">Selecciona el formato para exportar</p>
      </div>

      <div>
        <p className="text-6 mb-2 font-medium text-gray-600">Formato de Exportación</p>
        <div className="flex gap-3">
          {FORMATS.map((f) => (
            <FormatCard
              key={f.key}
              format={f}
              selected={selected === f.key}
              onSelect={() => setSelected(f.key)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <Button variant="outline" size="md" onClick={onCloseModal} disabled={isExporting}>
          Cancelar
        </Button>
        <Button variant="primary" size="md" onClick={handleExport} isLoading={isExporting}>
          Exportar {format.label}
        </Button>
      </div>
    </div>
  )
}
