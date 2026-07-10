import { HiOutlineCheckBadge, HiOutlineExclamationTriangle } from 'react-icons/hi2'
import { PESO_PERDIDA_UMBRAL, PESO_PERDIDA_MAX } from '@features/patients/nutricion/constants'

// Medidor de riesgo por pérdida de peso: barra 0 → máx con el umbral clínico
// (5%) marcado, para leer de un vistazo qué tan lejos está el paciente del corte.
// Compartido por el form (en vivo) y el detalle, así se ven idénticos.
export default function PesoLossCard({ porcentaje, enRiesgo }) {
  const completo = porcentaje != null
  const pct = completo ? Math.min(100, Math.max(0, (porcentaje / PESO_PERDIDA_MAX) * 100)) : 0
  const thresholdPct = (PESO_PERDIDA_UMBRAL / PESO_PERDIDA_MAX) * 100

  // Sin peso habitual válido no hay % → estado neutro (ni riesgo ni sin riesgo).
  const tone = !completo
    ? { text: 'text-zinc-500', fill: 'bg-zinc-300', Icon: null }
    : enRiesgo
      ? { text: 'text-rose-500', fill: 'bg-rose-500', Icon: HiOutlineExclamationTriangle }
      : { text: 'text-emerald-600', fill: 'bg-emerald-500', Icon: HiOutlineCheckBadge }

  const Icon = tone.Icon

  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <span className="text-7 font-semibold tracking-widest text-zinc-400 uppercase">
            % de pérdida de peso en 3 meses
          </span>
          <div className="flex items-center gap-2">
            {Icon && <Icon size={18} className={`shrink-0 ${tone.text}`} strokeWidth={2} />}
            <p className={`text-3 leading-tight font-bold ${tone.text}`}>
              {!completo ? 'Sin peso habitual' : enRiesgo ? 'En riesgo' : 'Sin riesgo'}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-1 leading-none font-bold text-zinc-800 tabular-nums">
            {completo ? porcentaje.toFixed(2) : '0.00'}%
          </span>
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
          <span className="absolute left-0">0%</span>
          <span
            className="absolute -translate-x-1/2 font-medium whitespace-nowrap text-zinc-500"
            style={{ left: `${thresholdPct}%` }}
          >
            Riesgo · {PESO_PERDIDA_UMBRAL}%
          </span>
          <span className="absolute right-0">{PESO_PERDIDA_MAX}%</span>
        </div>
      </div>

      <p className="text-6 mt-4 text-zinc-400">Cálculo: (peso perdido × 100) / peso habitual.</p>
    </div>
  )
}
