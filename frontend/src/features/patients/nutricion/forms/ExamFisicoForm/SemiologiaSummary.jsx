import Heading from '@components/Heading'
import { ANTROPOMETRICO_FIELDS } from '@features/patients/nutricion/forms/ExamFisicoForm/fieldConfig'
import {
  SEMIOLOGIA_SEVERIDAD_LABELS,
  RESERVA_MUSCULAR_LABELS,
  EDEMA_LABELS,
} from '@features/patients/nutricion/constants'

const isFilled = (v) => v != null && v !== ''
const EMPTY = <span className="text-5 text-zinc-300">—</span>

// Color del badge según severidad (código estable NORMAL→SEVERO).
function severityTone(code) {
  if (code === 'NORMAL' || code === 'SIN_ALT')
    return 'border-emerald-100 bg-emerald-50 text-emerald-700'
  if (code === 'LEVE') return 'border-amber-100 bg-amber-50 text-amber-700'
  if (code === 'MODERADO' || code === 'MOD') return 'border-orange-100 bg-orange-50 text-orange-700'
  return 'border-rose-100 bg-rose-50 text-rose-600'
}

function SeverityBadge({ code, label }) {
  if (!isFilled(code)) return EMPTY
  return (
    <span
      className={`text-6 shrink-0 rounded-full border px-2.5 py-1 font-semibold ${severityTone(code)}`}
    >
      {label ?? code}
    </span>
  )
}

function DiagRow({ label, code, labels }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 px-4 py-3">
      <span className="text-5 text-zinc-600">{label}</span>
      <SeverityBadge code={code} label={labels[code]} />
    </div>
  )
}

export default function SemiologiaSummary({ semiologia }) {
  const s = semiologia ?? {}

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Heading as="h4" showBar>
          Indicadores Antropométricos / Físicos
        </Heading>
        <div className="grid grid-cols-2 gap-x-8 max-sm:grid-cols-1">
          {ANTROPOMETRICO_FIELDS.map(({ name, label }) => (
            <div
              key={name}
              className="flex items-center justify-between gap-3 border-b border-zinc-50 py-2.5"
            >
              <span className="text-5 text-zinc-600">{label}</span>
              <SeverityBadge code={s[name]} label={SEMIOLOGIA_SEVERIDAD_LABELS[s[name]]} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Heading as="h4" showBar>
          Diagnóstico de Reservas
        </Heading>
        <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
          <DiagRow
            label="Reserva grasa"
            code={s.diag_reservagrasa}
            labels={SEMIOLOGIA_SEVERIDAD_LABELS}
          />
          <DiagRow
            label="Reserva muscular"
            code={s.diag_reserva_muscular}
            labels={RESERVA_MUSCULAR_LABELS}
          />
          <DiagRow label="Edema" code={s.edema} labels={EDEMA_LABELS} />
        </div>
      </section>

      <section className="space-y-3">
        <Heading as="h4" showBar>
          Notas Observacionales
        </Heading>
        <p className={`text-5 ${isFilled(s.descripcion) ? 'text-zinc-700' : 'text-zinc-300'}`}>
          {isFilled(s.descripcion) ? s.descripcion : 'Sin observaciones registradas.'}
        </p>
      </section>
    </div>
  )
}
