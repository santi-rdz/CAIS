import Heading from '@components/Heading'
import {
  HORARIO_TIME_FIELDS,
  HORARIO_BOOL_FIELDS,
} from '@features/patients/nutricion/forms/EvalNutricionalForm/fieldConfig'

const isFilled = (v) => v != null && v !== ''
const EMPTY = <span className="text-5 text-zinc-300">—</span>

function BoolChip({ value }) {
  if (value == null) return EMPTY
  return value ? (
    <span className="text-6 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 font-semibold text-teal-700">
      Sí
    </span>
  ) : (
    <span className="text-6 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-semibold text-zinc-500">
      No
    </span>
  )
}

function Chip({ value }) {
  if (!isFilled(value)) return EMPTY
  return (
    <span className="text-5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-medium text-zinc-700">
      {value}
    </span>
  )
}

// Par label→valor. Va dentro de un grid de 2 columnas, así el valor queda junto
// al campo (a media anchura) en vez de disparado al borde del panel en desktop.
function Row({ label, children, className = '' }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5 ${className}`}
    >
      <span className="text-5 text-zinc-600">{label}</span>
      {children}
    </div>
  )
}

// Fila full-width para texto largo (alergia, pensamientos).
function TextRow({ label, value, className = '' }) {
  return (
    <div className={`border-b border-zinc-100 py-2.5 ${className}`}>
      <span className="text-6 font-medium tracking-wide text-zinc-400 uppercase">{label}</span>
      <p className={`text-5 ${isFilled(value) ? 'text-zinc-700' : 'text-zinc-300'}`}>
        {isFilled(value) ? value : '—'}
      </p>
    </div>
  )
}

export default function DietaHabitosSummary({ evaluation }) {
  const h = evaluation.horarios_comida_nutricion

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Heading as="h4" showBar>
          Dieta y Alergias
        </Heading>
        <div className="grid grid-cols-2 gap-x-10 max-sm:grid-cols-1">
          <Row label="¿Sigue dieta prescrita por nutriólogo?">
            <BoolChip value={evaluation.sigue_dieta} />
          </Row>
          <Row label="Alergia alimentaria">
            <BoolChip value={evaluation.tiene_alergia} />
          </Row>
          {evaluation.tiene_alergia && (
            <TextRow
              label="¿Cuál alergia?"
              value={evaluation.cual_alergia}
              className="col-span-2"
            />
          )}
        </div>
      </section>

      <section className="space-y-3">
        <Heading as="h4" showBar>
          Horarios de Comida
        </Heading>
        <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
          {HORARIO_TIME_FIELDS.map(({ name, label }) => {
            const filled = isFilled(h?.[name])
            return (
              <div key={name} className="rounded-xl border border-zinc-100 px-3.5 py-2.5">
                <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">{label}</p>
                <p className={`text-4 ${filled ? 'font-semibold text-zinc-800' : 'text-zinc-300'}`}>
                  {filled ? h[name] : '—'}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <Heading as="h4" showBar>
          Problemas de Alimentación
        </Heading>
        <div className="grid grid-cols-2 gap-x-10 max-sm:grid-cols-1">
          <Row label="Tipo de alimentación">
            <Chip value={h?.tipo_alimentacion} />
          </Row>
          {HORARIO_BOOL_FIELDS.map(({ name, label }) => (
            <Row key={name} label={label}>
              <BoolChip value={h?.[name]} />
            </Row>
          ))}
          <TextRow
            label="¿Qué ha pensado sobre iniciar una dieta?"
            value={h?.pensamientos_sobre_dieta}
            className="col-span-2"
          />
        </div>
      </section>
    </div>
  )
}
