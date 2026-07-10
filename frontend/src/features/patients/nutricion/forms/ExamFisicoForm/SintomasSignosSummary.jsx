import Heading from '@components/Heading'
import { SIGNOS_NUM_FIELDS } from '@features/patients/nutricion/forms/ExamFisicoForm/fieldConfig'
import { parseSintomas } from '@features/patients/nutricion/forms/ExamFisicoForm/serialize'

const isFilled = (v) => v != null && v !== ''
const SIGNOS_UNITS = { tas: 'mmHg', tad: 'mmHg', temperatura: '°C' }

function BoolChip({ value }) {
  if (value == null) return <span className="text-5 text-zinc-300">—</span>
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

export default function SintomasSignosSummary({ sintomas: filas, signos }) {
  const { presenta_sgi, sintomas } = parseSintomas(filas)

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Heading as="h4" showBar>
          Síntomas Gastrointestinales
        </Heading>
        {presenta_sgi === true && sintomas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {sintomas.map((s) => (
              <span
                key={s}
                className="text-5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 font-medium text-teal-700"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-5 text-zinc-500">
            {presenta_sgi === false
              ? 'El paciente no presenta síntomas gastrointestinales.'
              : 'Sin registro de síntomas gastrointestinales.'}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <Heading as="h4" showBar>
          Signos Vitales
        </Heading>
        <div className="grid grid-cols-4 gap-3 max-sm:grid-cols-2">
          {SIGNOS_NUM_FIELDS.map(({ name, label }) => {
            const filled = isFilled(signos?.[name])
            return (
              <div key={name} className="rounded-xl border border-zinc-100 px-4 py-3">
                <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">{label}</p>
                <p className={`text-4 ${filled ? 'font-semibold text-zinc-800' : 'text-zinc-300'}`}>
                  {filled ? `${signos[name]} ${SIGNOS_UNITS[name]}` : '—'}
                </p>
              </div>
            )
          })}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-100 px-4 py-3">
            <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">
              Dif. respiratoria
            </p>
            <div className="mt-1">
              <BoolChip value={signos?.dificultad_respiratoria} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
