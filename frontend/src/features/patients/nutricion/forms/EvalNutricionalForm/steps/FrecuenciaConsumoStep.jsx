import { useFormContext, useWatch } from 'react-hook-form'
import FrecuenciaField from '@features/patients/nutricion/forms/EvalNutricionalForm/FrecuenciaField'
import { FRECUENCIA_GROUPS } from '@features/patients/nutricion/forms/EvalNutricionalForm/fieldConfig'

const isFilled = (v) => v != null && v !== ''

export default function FrecuenciaConsumoStep() {
  const { control } = useFormContext()
  const values = useWatch({ control, name: 'frec_consumo_alimentos_nutricion' }) ?? {}

  return (
    <div className="space-y-4">
      {/* Sub-navegación sticky: anclas nativas <a href="#id"> a cada sección; el
          offset bajo la barra lo da `scroll-mt-*` en la sección destino.
          `-top-(--mpy)` la fija al borde del scrollport (no al de contenido) para
          cubrir el padding superior del ModalBody; `-mt`+`pt` la dejan a ras. */}
      <div className="sticky -top-(--mpy) z-20 -mx-(--mpx) -mt-(--mpy) border-b border-zinc-100 bg-white px-(--mpx) pt-(--mpy) pb-2.5">
        <div className="flex flex-wrap gap-1.5">
          {FRECUENCIA_GROUPS.map((group) => {
            const total = group.fields.length
            const filled = group.fields.filter((f) => isFilled(values[f.name])).length
            const done = filled === total
            const partial = filled > 0 && !done

            return (
              <a
                key={group.id}
                href={`#${group.id}`}
                className={`text-6 flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium transition-colors ${
                  done
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : partial
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : 'border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    done ? 'bg-emerald-500' : partial ? 'bg-amber-500' : 'bg-zinc-300'
                  }`}
                />
                {group.title}
                <span className="text-7 tabular-nums opacity-70">
                  {filled}/{total}
                </span>
              </a>
            )
          })}
        </div>
      </div>

      {FRECUENCIA_GROUPS.map((group) => (
        <div key={group.id} id={group.id} className="scroll-mt-28 space-y-2">
          <h5 className="text-5 flex items-center gap-2 font-semibold text-zinc-700">
            <span className="h-3.5 w-1 rounded-full bg-gray-400" />
            {group.title}
          </h5>
          <div className="rounded-xl border border-zinc-100 px-4">
            {group.fields.map((field) => (
              <FrecuenciaField key={field.name} field={field} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
