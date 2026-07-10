import Heading from '@components/Heading'
import Divider from '@components/Divider'
import { FRECUENCIA_GROUPS } from '@features/patients/nutricion/forms/EvalNutricionalForm/fieldConfig'

const isFilled = (v) => v != null && v !== ''

// Vista de detalle de la frecuencia de consumo: índice de grupos que salta a
// cada sección + filas compactas donde el valor registrado resalta como píldora
// y lo no capturado queda atenuado. Evita el grid disperso lleno de "—".
export default function FrecuenciaSummary({ frec }) {
  const data = frec ?? {}

  return (
    <div className="space-y-6">
      {/* Índice: salta a cada grupo (ancla) y marca los que tienen registro. */}
      <div className="flex flex-wrap gap-1.5">
        {FRECUENCIA_GROUPS.map((group) => {
          const filled = group.fields.filter((f) => isFilled(data[f.name])).length
          const has = filled > 0
          return (
            <a
              key={group.id}
              href={`#det-${group.id}`}
              className={`text-6 flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium transition-colors ${
                has
                  ? 'border-teal-200 bg-teal-50 text-teal-700'
                  : 'border-zinc-200 text-zinc-400 hover:bg-zinc-50'
              }`}
            >
              {group.title}
              {has && <span className="text-6 tabular-nums opacity-70">{filled}</span>}
            </a>
          )
        })}
      </div>

      {FRECUENCIA_GROUPS.map((group, i) => (
        <div key={group.id} id={`det-${group.id}`} className="scroll-mt-24 space-y-3">
          {i > 0 && <Divider />}
          <Heading as="h4" showBar>
            {group.title}
          </Heading>
          <div className="grid grid-cols-2 gap-x-8 max-sm:grid-cols-1">
            {group.fields.map((field) => {
              const value = data[field.name]
              return (
                <div
                  key={field.name}
                  className="flex items-center justify-between gap-3 border-b border-zinc-50 py-2.5"
                >
                  <span className="text-5 text-zinc-600">{field.label}</span>
                  {isFilled(value) ? (
                    <span className="text-5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-medium text-zinc-700">
                      {value}
                    </span>
                  ) : (
                    <span className="text-5 text-zinc-300">—</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
