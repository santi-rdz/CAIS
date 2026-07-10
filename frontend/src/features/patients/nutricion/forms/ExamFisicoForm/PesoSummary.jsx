import PesoLossCard from '@features/patients/nutricion/forms/ExamFisicoForm/PesoLossCard'
import { PESO_FIELDS } from '@features/patients/nutricion/forms/ExamFisicoForm/fieldConfig'
import { PESO_PERDIDA_UMBRAL } from '@features/patients/nutricion/constants'

const isFilled = (v) => v != null && v !== ''

export default function PesoSummary({ peso }) {
  const porcentaje = peso?.porcentaje_peso_perdido
  const enRiesgo = porcentaje != null && porcentaje > PESO_PERDIDA_UMBRAL

  return (
    <div className="space-y-5">
      <PesoLossCard porcentaje={porcentaje ?? null} enRiesgo={enRiesgo} />

      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        {PESO_FIELDS.map(({ name, label }) => {
          const filled = isFilled(peso?.[name])
          return (
            <div key={name} className="rounded-xl border border-zinc-100 px-4 py-3">
              <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">{label}</p>
              <p className={`text-4 ${filled ? 'font-semibold text-zinc-800' : 'text-zinc-300'}`}>
                {filled ? `${peso[name]} kg` : '—'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
