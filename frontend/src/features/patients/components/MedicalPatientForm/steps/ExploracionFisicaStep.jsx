import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import Divider from '@components/Divider'

const SOMATOMETRIA = [
  [
    { name: 'peso', label: 'Peso / kg', step: '0.1' },
    { name: 'altura', label: 'Altura / cm', step: '0.1' },
    { name: 'pa_sistolica', label: 'T/A Sistólica' },
    { name: 'pa_diastolica', label: 'T/A Diastólica' },
  ],
  [
    { name: 'fc', label: 'FC (lpm)' },
    { name: 'fr', label: 'FR (rpm)' },
    { name: 'circ_cintura', label: 'Circ. Cintura (cm)', step: '0.1' },
    { name: 'circ_cadera', label: 'Circ. Cadera (cm)', step: '0.1' },
  ],
  [
    { name: 'sp_o2', label: 'SpO₂ (%)', step: '0.1' },
    { name: 'glucosa_capilar', label: 'Glucosa Capilar (mg/dL)', step: '0.1' },
    { name: 'temperatura', label: 'Temperatura (°C)', step: '0.1' },
  ],
]

const IMC_LEVELS = [
  { max: 18.5, label: 'Bajo peso',  color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { max: 24.9, label: 'Normal',     color: 'bg-green-50 text-green-700 border-green-100' },
  { max: 29.9, label: 'Sobrepeso',  color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
  { max: Infinity, label: 'Obesidad', color: 'bg-red-50 text-red-700 border-red-100' },
]

function ImcDisplay({ peso, altura }) {
  const imc =
    peso > 0 && altura > 0
      ? (peso / Math.pow(altura / 100, 2)).toFixed(1)
      : null

  const level = imc ? IMC_LEVELS.find((l) => parseFloat(imc) <= l.max) : null

  return (
    <FormRow label="IMC">
      <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
        {imc ? (
          <div className="flex items-baseline gap-2">
            <span className="font-lato text-4 font-semibold text-zinc-800">
              {imc}
              <span className="text-6 ml-1 font-normal text-zinc-400">kg/m²</span>
            </span>
            <span className={`text-6 inline-flex items-center rounded-full border px-2 py-px font-medium ${level.color}`}>
              {level.label}
            </span>
          </div>
        ) : (
          <div className="flex items-center" style={{ minHeight: '22px' }}>
            <span className="text-6 text-zinc-300">Ingresa peso y altura</span>
          </div>
        )}
      </div>
    </FormRow>
  )
}

export default function ExploracionFisicaStep() {
  const { register, control } = useFormContext()
  const peso = useWatch({ control, name: 'informacion_fisica.peso' })
  const altura = useWatch({ control, name: 'informacion_fisica.altura' })

  return (
    <div className="space-y-5">
      <Heading as="h3" showBar>
        Exploración Física y Somatometría
      </Heading>

      {/* ── Somatometría ── */}
      <div className="space-y-4">
        <p className="text-5 font-medium text-zinc-700">Somatometría</p>

        {SOMATOMETRIA.map((row, i) => (
          <Grid key={i} cols={4} gap={4} mobileCols={2}>
            {row.map(({ name, label, step }) => (
              <FormRow key={name} htmlFor={name} label={label}>
                <Input
                  {...register(`informacion_fisica.${name}`)}
                  id={name}
                  type="number"
                  step={step}
                  placeholder="0000"
                  variant="outline"
                  size="md"
                />
              </FormRow>
            ))}
            {/* IMC al final del último row de somatometría */}
            {i === SOMATOMETRIA.length - 1 && (
              <ImcDisplay peso={Number(peso)} altura={Number(altura)} />
            )}
          </Grid>
        ))}
      </div>

      <Divider />

      <Grid cols={2} gap={4} mobileCols={1}>
        <FormRow htmlFor="habito_exterior" label="Hábito Exterior">
          <Input
            {...register('informacion_fisica.habito_exterior')}
            id="habito_exterior"
            textarea
            rows={3}
            placeholder="Descripción del hábito exterior del paciente: talla, complexión, estado nutricional, facies y actitud"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow htmlFor="exploracion_fisica" label="Exploración Física">
          <Input
            {...register('informacion_fisica.exploracion_fisica')}
            id="exploracion_fisica"
            textarea
            rows={3}
            placeholder="Descripción de hallazgos de la exploración física general"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Grid>
    </div>
  )
}
