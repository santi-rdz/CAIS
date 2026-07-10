import { REC24H_NUTRIENTES, sumNutrient } from '@features/patients/nutricion/constants'

const round = (n) => Math.round(n * 10) / 10

// Barra de progreso ingesta/objetivo, acotada al 100% visual; >100% se pinta ámbar.
function ProgressBar({ pct }) {
  if (pct == null) return <div className="h-1.5 rounded-full bg-zinc-100" />
  const over = pct > 100
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
      <div
        className={`h-full rounded-full ${over ? 'bg-amber-400' : 'bg-teal-500'}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  )
}

// Objetivo diario vs ingesta real (suma de los alimentos). Presentacional: recibe
// los objetivos (obj_*) y la lista de comidas ya resueltos.
export default function ObjetivoVsRealPanel({ objetivos = {}, comidas = [] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-100">
      <div className="text-6 grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-3 border-b border-zinc-100 bg-zinc-50 px-4 py-2.5 font-medium tracking-wide text-zinc-400 uppercase max-sm:grid-cols-[1.4fr_1fr_1fr]">
        <span>Nutriente</span>
        <span className="text-right">Objetivo</span>
        <span className="text-right">Real</span>
        <span className="max-sm:hidden">Avance</span>
      </div>
      <div className="divide-y divide-zinc-50">
        {REC24H_NUTRIENTES.map(({ key, label, unit, objName }) => {
          const obj = Number(objetivos[objName])
          const hasObj = objetivos[objName] !== '' && objetivos[objName] != null && obj > 0
          const real = round(sumNutrient(comidas, key))
          const pct = hasObj ? (real * 100) / obj : null

          return (
            <div
              key={key}
              className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr] items-center gap-3 px-4 py-2.5 max-sm:grid-cols-[1.4fr_1fr_1fr]"
            >
              <span className="text-5 font-medium text-zinc-700">
                {label} <span className="text-6 text-zinc-400">({unit})</span>
              </span>
              <span className="text-5 text-right text-zinc-500">{hasObj ? round(obj) : '—'}</span>
              <span className="text-5 text-right font-semibold text-zinc-800">{real}</span>
              <div className="flex items-center gap-2 max-sm:hidden">
                <div className="flex-1">
                  <ProgressBar pct={pct} />
                </div>
                <span className="text-6 w-10 shrink-0 text-right text-zinc-400">
                  {pct == null ? '—' : `${Math.round(pct)}%`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
