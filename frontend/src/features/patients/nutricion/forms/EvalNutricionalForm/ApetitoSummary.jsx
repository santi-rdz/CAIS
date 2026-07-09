import ApetitoScoreCard from '@features/patients/nutricion/forms/EvalNutricionalForm/ApetitoScoreCard'
import { APETITO_SCORE_FIELDS, getApetitoOption } from '@features/patients/nutricion/constants'

// Color del badge de puntos según qué tan alto puntúa el ítem (bajo = riesgo).
function pointsTone(points) {
  if (points <= 2) return 'border-rose-100 bg-rose-50 text-rose-600'
  if (points === 3) return 'border-amber-100 bg-amber-50 text-amber-600'
  return 'border-emerald-100 bg-emerald-50 text-emerald-700'
}

// Vista de detalle del apetito: cada ítem muestra su respuesta y los puntos que
// aporta, y el medidor compartido resalta total + clasificación de riesgo.
export default function ApetitoSummary({ apetito }) {
  return (
    <div className="space-y-5">
      <ApetitoScoreCard
        puntaje={apetito?.puntaje_total ?? 0}
        clasif={apetito?.clasif_alteracion_apetito}
      />

      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        {APETITO_SCORE_FIELDS.map(({ name, label }) => {
          const opt = getApetitoOption(name, apetito?.[name])
          return (
            <div
              key={name}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">{label}</p>
                <p className={`text-4 truncate ${opt ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {opt?.label ?? '—'}
                </p>
              </div>
              {opt && (
                <span
                  className={`text-6 shrink-0 rounded-full border px-2.5 py-1 font-bold ${pointsTone(
                    opt.points
                  )}`}
                >
                  {opt.points} pts
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
