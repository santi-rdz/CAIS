import { HiOutlineCheckBadge, HiOutlineExclamationTriangle } from 'react-icons/hi2'
import {
  APETITO_UMBRAL,
  APETITO_PUNTAJE_MAX,
  CLASIF_SIN_RIESGO,
} from '@features/patients/nutricion/constants'

// Medidor de riesgo del apetito: barra 0 → máx con el umbral clínico (14 pts)
// marcado, para leer de un vistazo qué tan lejos está el paciente del corte.
// Compartido por el form (en vivo) y el detalle, así se ven idénticos.
export default function ApetitoScoreCard({ puntaje = 0, clasif }) {
  const completo = clasif != null
  const sinRiesgo = clasif === CLASIF_SIN_RIESGO
  const pct = Math.min(100, Math.max(0, (puntaje / APETITO_PUNTAJE_MAX) * 100))
  const thresholdPct = (APETITO_UMBRAL / APETITO_PUNTAJE_MAX) * 100

  // Sin los 4 campos no hay clasificación válida → estado neutro (ni riesgo ni
  // sin riesgo), para no comunicar un resultado engañoso a medio llenar.
  const tone = !completo
    ? { text: 'text-zinc-500', fill: 'bg-zinc-300', Icon: null }
    : sinRiesgo
      ? { text: 'text-emerald-600', fill: 'bg-emerald-500', Icon: HiOutlineCheckBadge }
      : { text: 'text-rose-500', fill: 'bg-rose-500', Icon: HiOutlineExclamationTriangle }

  const Icon = tone.Icon

  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <span className="text-7 font-semibold tracking-widest text-zinc-400 uppercase">
            Clasificación de alteración del apetito
          </span>
          <div className="flex items-center gap-2">
            {Icon && <Icon size={18} className={`shrink-0 ${tone.text}`} strokeWidth={2} />}
            <p className={`text-3 leading-tight font-bold ${tone.text}`}>
              {clasif ?? 'Evaluación incompleta'}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-1 leading-none font-bold text-zinc-800 tabular-nums">
              {puntaje}
            </span>
            <span className="text-4 font-medium text-zinc-300">/{APETITO_PUNTAJE_MAX}</span>
          </div>
          <span className="text-7 font-medium tracking-wide text-zinc-400 uppercase">puntos</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative h-2 w-full rounded-full bg-zinc-100">
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${tone.fill} transition-[width] duration-500 ease-out`}
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute -inset-y-1 w-px bg-zinc-300"
            style={{ left: `${thresholdPct}%` }}
          />
        </div>

        <div className="text-7 relative mt-2 h-4 text-zinc-400 tabular-nums">
          <span className="absolute left-0">0</span>
          <span
            className="absolute -translate-x-1/2 font-medium whitespace-nowrap text-zinc-500"
            style={{ left: `${thresholdPct}%` }}
          >
            Meta · {APETITO_UMBRAL}
          </span>
          <span className="absolute right-0">{APETITO_PUNTAJE_MAX}</span>
        </div>
      </div>
    </div>
  )
}
