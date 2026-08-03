import { EQUIVALENTES_NUTRICIONALES } from '@cais/shared/constants/nutricion'
import { formatNumber } from '@lib/utils'
import {
  EQUIVALENTE_LABELS,
  EQUIVALENTE_SECTIONS,
} from '@features/patients/nutricion/forms/CalGetNutrForm/fieldConfig'

// Resumen de la distribución guardada: secciones con los grupos cuyos EQ > 0 y
// su aporte (EQ × valor base) por macronutriente.
export default function DistribucionResumen({ registro }) {
  const secciones = EQUIVALENTE_SECTIONS.map((section) => ({
    ...section,
    grupos: section.grupos.filter((g) => Number(registro[g]) > 0),
  })).filter((section) => section.grupos.length > 0)

  if (secciones.length === 0) {
    return (
      <p className="text-5 rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-zinc-400">
        Sin equivalentes registrados.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {secciones.map((section) => (
        <div key={section.title} className="overflow-hidden rounded-xl border border-zinc-100">
          <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2">
            <p className="text-6 font-semibold tracking-wide text-zinc-500 uppercase">
              {section.title}
            </p>
          </div>
          <div className="divide-y divide-zinc-50">
            {section.grupos.map((grupo) => {
              const eq = Number(registro[grupo]) || 0
              const base = EQUIVALENTES_NUTRICIONALES[grupo]
              return (
                <div
                  key={grupo}
                  className="grid grid-cols-[1.7fr_repeat(4,1fr)] items-center gap-3 px-4 py-2"
                >
                  <span className="text-5 text-zinc-700">
                    {EQUIVALENTE_LABELS[grupo]}
                    <span className="text-6 ml-2 text-zinc-400">{eq} EQ</span>
                  </span>
                  <span className="text-5 text-right text-zinc-500 tabular-nums">
                    {formatNumber(eq * base.kcal)} kcal
                  </span>
                  <span className="text-5 text-right text-zinc-500 tabular-nums">
                    {formatNumber(eq * base.proteinas)} Ps
                  </span>
                  <span className="text-5 text-right text-zinc-500 tabular-nums">
                    {formatNumber(eq * base.grasas)} Ls
                  </span>
                  <span className="text-5 text-right text-zinc-500 tabular-nums">
                    {formatNumber(eq * base.carbohidratos)} HC
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
