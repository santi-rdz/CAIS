import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import Button from '@components/Button'
import Heading from '@components/Heading'
import { formatFecha } from '@lib/dateHelpers'
import { formatNumber } from '@lib/utils'
import { computeIMC, classifyIMC } from '@features/patients/nutricion/constants'
import {
  ADULTO_OBS_FIELDS,
  KID_OBS_FIELDS,
} from '@features/patients/nutricion/forms/EenReportForm/fieldConfig'
import DiagnosticosResumen from '@features/patients/nutricion/forms/EenReportForm/DiagnosticosResumen'

const fmt = (v, unit) => (v == null || v === '' ? '—' : `${formatNumber(v)} ${unit}`)

const IMC_TONE = {
  teal: 'text-teal-700',
  amber: 'text-amber-600',
  red: 'text-red-600',
}

function DatoTile({ label, value, sub, subTone }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-white px-4 py-3">
      <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">{label}</p>
      <p className="text-4 font-semibold text-zinc-800">{value}</p>
      {sub && <p className={`text-6 font-medium ${subTone ?? 'text-zinc-400'}`}>{sub}</p>}
    </div>
  )
}

function ObsBlock({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-white px-4 py-3">
      <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">{label}</p>
      <p className="text-5 whitespace-pre-line text-zinc-700">{value || '—'}</p>
    </div>
  )
}

export default function EenReportDetail({ reporte, onBack, onEdit, onDelete }) {
  const esAdulto = reporte.tipo === 'adulto'
  const imc = computeIMC({ peso: reporte.peso, estatura: reporte.estatura })
  // Los rangos OMS del IMC son de adulto; no se clasifican reportes pediátricos.
  const clasif = esAdulto ? classifyIMC(imc) : null
  const obsFields = esAdulto ? ADULTO_OBS_FIELDS : KID_OBS_FIELDS

  return (
    <div data-testid="een-report-detail">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">Reportes EEN</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-5 font-semibold text-zinc-700">
            {formatFecha(reporte.fecha_eval)}
          </span>
          <span className="text-7 rounded-md bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-500">
            {esAdulto ? 'Adulto' : 'Pediátrico'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            className="p-2 text-zinc-400 hover:text-red-600"
            aria-label="Eliminar reporte EEN"
            onClick={() => onDelete?.(reporte)}
          >
            <HiOutlineTrash size={16} />
          </Button>
          <Button variant="secondary" size="md" className="gap-1.5" onClick={() => onEdit?.(0)}>
            <HiOutlinePencilSquare size={14} />
            Editar reporte
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <Heading as="h4" showBar>
            Evaluación nutricional
          </Heading>
          <div className="grid grid-cols-4 gap-3 max-sm:grid-cols-2">
            <DatoTile label="Peso" value={fmt(reporte.peso, 'kg')} />
            <DatoTile label="Estatura" value={fmt(reporte.estatura, 'cm')} />
            <DatoTile label="Cintura" value={fmt(reporte.cintura, 'cm')} />
            <DatoTile
              label="IMC (kg/m²)"
              value={imc != null ? formatNumber(imc) : '—'}
              sub={clasif?.label}
              subTone={clasif ? IMC_TONE[clasif.tone] : undefined}
            />
          </div>
          <DatoTile label="Apetito" value={reporte.apetito || '—'} />
        </section>

        <section className="space-y-3">
          <Heading as="h4" showBar>
            Observaciones
          </Heading>
          {!esAdulto && (
            <ObsBlock
              label="¿Se solicitó orientación nutricional?"
              value={reporte.solicito_orient == null ? '—' : reporte.solicito_orient ? 'Sí' : 'No'}
            />
          )}
          {obsFields.map((f) => (
            <ObsBlock key={f.name} label={f.label} value={reporte[f.name]} />
          ))}
        </section>

        {esAdulto && (
          <section className="space-y-3">
            <Heading as="h4" showBar>
              Diagnóstico nutricional (PES)
            </Heading>
            <DiagnosticosResumen diagnosticos={reporte.diagnosticos} />
          </section>
        )}
      </div>
    </div>
  )
}
