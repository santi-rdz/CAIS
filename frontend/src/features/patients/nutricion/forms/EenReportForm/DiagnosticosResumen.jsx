import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import EmptyState from '@components/EmptyState'

const CAMPOS = [
  { name: 'intervencion', label: 'Intervención' },
  { name: 'objetivos', label: 'Objetivo' },
  { name: 'indicadores', label: 'Indicadores' },
  { name: 'criterio', label: 'Criterio' },
  { name: 'progreso', label: 'Progreso' },
]

export default function DiagnosticosResumen({ diagnosticos = [] }) {
  if (!diagnosticos.length) {
    return (
      <EmptyState
        icon={<HiOutlineClipboardDocumentList size={24} />}
        message="Sin diagnósticos registrados"
        hint="Este reporte no tiene diagnósticos PES."
      />
    )
  }

  return (
    <div className="space-y-3">
      {diagnosticos.map((d, i) => (
        <div key={d.id ?? i} className="space-y-3 rounded-xl border border-zinc-100 p-4">
          <div className="flex items-center gap-2">
            <span className="text-6 flex size-6 items-center justify-center rounded-full bg-teal-600 font-semibold text-white">
              {i + 1}
            </span>
            <p className="text-5 font-medium text-zinc-800">{d.pes || 'Sin diagnóstico'}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-sm:grid-cols-1">
            {CAMPOS.map(({ name, label }) => (
              <div key={name} className="min-w-0">
                <p className="text-7 font-medium tracking-wide text-zinc-400 uppercase">{label}</p>
                <p className="text-5 text-zinc-700">{d[name] || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
