import {
  REC24H_NUTRIENTES,
  sumNutrient,
  groupByFoodGroup,
} from '@features/patients/nutricion/constants'

const round = (n) => Math.round(n * 10) / 10
const CALORIAS = REC24H_NUTRIENTES[0]
const MACROS = REC24H_NUTRIENTES.slice(1)

function objetivoNum(objetivos, name) {
  const v = objetivos[name]
  const n = Number(v)
  return v !== '' && v != null && n > 0 ? n : null
}

// Resumen compacto de la ingesta para el paso de captura: calorías como dato
// principal + macros secundarios + grupos. Menos ruido que la tabla completa
// (esa vive en el detalle).
export default function IngestaResumen({ objetivos = {}, comidas = [] }) {
  const kcal = round(sumNutrient(comidas, CALORIAS.key))
  const kcalObj = objetivoNum(objetivos, CALORIAS.objName)
  const kcalPct = kcalObj ? Math.round((kcal * 100) / kcalObj) : null
  const grupos = groupByFoodGroup(comidas)

  return (
    <div className="rounded-xl border border-zinc-100 p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">
            Calorías del día
          </p>
          <p className="text-1 leading-none font-semibold text-zinc-800">
            {kcal}
            <span className="text-4 ml-1 font-normal text-zinc-400">
              / {kcalObj != null ? round(kcalObj) : '—'} kcal
            </span>
          </p>
        </div>
        {kcalPct != null && (
          <span
            className={`text-5 rounded-md px-2 py-0.5 font-semibold ${
              kcalPct > 100 ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'
            }`}
          >
            {kcalPct}% del objetivo
          </span>
        )}
      </div>

      {kcalObj != null && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full ${kcalPct > 100 ? 'bg-amber-400' : 'bg-teal-500'}`}
            style={{ width: `${Math.min(kcalPct, 100)}%` }}
          />
        </div>
      )}

      <div className="mt-4 grid grid-cols-4 gap-x-4 gap-y-3 border-t border-zinc-100 pt-4 max-sm:grid-cols-2">
        {MACROS.map(({ key, label, unit, objName }) => {
          const real = round(sumNutrient(comidas, key))
          const obj = objetivoNum(objetivos, objName)
          return (
            <div key={key}>
              <p className="text-6 mb-0.5 tracking-wide text-zinc-400 uppercase">{label}</p>
              <p className="text-5 text-zinc-800">
                <span className="font-semibold">{real}</span>
                <span className="text-zinc-400">
                  {' '}
                  / {obj != null ? round(obj) : '—'} {unit}
                </span>
              </p>
            </div>
          )
        })}
      </div>

      {grupos.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-3">
          {grupos.map(({ grupo, count }) => (
            <span
              key={grupo}
              className="text-6 flex items-center gap-1.5 rounded-md bg-zinc-50 px-2 py-0.5 text-zinc-600"
            >
              {grupo}
              <span className="font-semibold text-teal-600">{count}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
