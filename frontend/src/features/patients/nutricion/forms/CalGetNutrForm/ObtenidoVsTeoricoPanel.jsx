import { formatNumber } from '@lib/utils'
import { BALANCE_ROWS } from '@features/patients/nutricion/forms/CalGetNutrForm/fieldConfig'

// Balance = teórico − obtenido (igual que la hoja de nutrición): negativo =
// exceso sobre el objetivo, positivo = déficit. Cerca de 0 se pinta neutro;
// desviaciones marcadas en ámbar (la fórmula rápida no fuerza el cuadre exacto).
function balanceTone(balance, teorico) {
  if (teorico == null || teorico === 0) return 'text-zinc-400'
  const ratio = Math.abs(balance) / teorico
  if (ratio <= 0.05) return 'text-teal-600'
  if (ratio <= 0.15) return 'text-amber-600'
  return 'text-red-600'
}

const fmtBalance = (n) => `${n > 0 ? '+' : ''}${formatNumber(n)}`

// Compara la distribución de EQ (obtenido) contra los objetivos de la fórmula
// rápida (teórico). `objetivos` puede venir null cuando no se capturó el GET.
export default function ObtenidoVsTeoricoPanel({ obtenido, objetivos }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-100">
      <div className="text-6 grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-3 border-b border-zinc-100 bg-zinc-50 px-4 py-2.5 font-medium tracking-wide text-zinc-400 uppercase">
        <span>Nutriente</span>
        <span className="text-right">Obtenido</span>
        <span className="text-right">Teórico</span>
        <span className="text-right">Balance</span>
      </div>
      <div className="divide-y divide-zinc-50">
        {BALANCE_ROWS.map(({ label, unit, obtenido: obtKey, objetivo: objKey }) => {
          const obt = Number(obtenido?.[obtKey]) || 0
          const teo = objKey === 'get' ? objetivos?.get : objetivos?.[objKey]?.g
          const hasTeo = teo != null && teo > 0
          const balance = hasTeo ? teo - obt : null

          return (
            <div
              key={label}
              className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center gap-3 px-4 py-2.5"
            >
              <span className="text-5 font-medium text-zinc-700">
                {label} <span className="text-6 text-zinc-400">({unit})</span>
              </span>
              <span className="text-5 text-right font-semibold text-zinc-800">
                {formatNumber(obt)}
              </span>
              <span className="text-5 text-right text-zinc-500">
                {hasTeo ? formatNumber(teo) : '—'}
              </span>
              <span className={`text-5 text-right font-semibold ${balanceTone(balance, teo)}`}>
                {balance == null ? '—' : fmtBalance(balance)}
              </span>
            </div>
          )
        })}
      </div>
      <p className="text-6 border-t border-zinc-100 bg-zinc-50/60 px-4 py-2 text-zinc-400">
        Balance = teórico − obtenido · <span className="text-zinc-500">negativo</span> = exceso
        sobre el objetivo · <span className="text-zinc-500">positivo</span> = déficit
      </p>
    </div>
  )
}
