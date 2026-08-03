import { useFormContext } from 'react-hook-form'
import { calcularObjetivosGET } from '@cais/shared/calculations/nutricion'
import Heading from '@components/Heading'
import Grid from '@components/Grid'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import DatePickerComponent from '@ui/DatePickerComponent'
import { formatNumber } from '@lib/utils'
import { GET_INPUT_FIELDS } from '@features/patients/nutricion/forms/CalGetNutrForm/fieldConfig'

const ROW = 'grid grid-cols-[1.6fr_1fr_1fr_0.8fr] items-center gap-3 px-4'
const pct = (n) => `${Math.round(n)}%`

export default function GetEstimacionStep() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext()

  const objetivos = calcularObjetivosGET(watch())
  const macros = [
    { label: 'Proteínas', data: objetivos.proteinas },
    { label: 'Hidratos de carbono', data: objetivos.carbohidratos },
    { label: 'Lípidos', data: objetivos.grasas },
  ]
  const totalPct =
    objetivos.proteinas.porcentaje +
    objetivos.carbohidratos.porcentaje +
    objetivos.grasas.porcentaje
  // La fórmula rápida no fuerza el cuadre a 100%; se avisa si la suma se aleja.
  const totalDescuadrado = objetivos.get > 0 && Math.abs(totalPct - 100) > 5

  return (
    <div className="space-y-6">
      <FormRow label="Fecha de evaluación" error={errors?.fecha_eval?.message}>
        <DatePickerComponent
          name="fecha_eval"
          control={control}
          birthdate={false}
          hasError={errors?.fecha_eval?.message}
        />
      </FormRow>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Estimación del GET (fórmula rápida)
        </Heading>
        <p className="text-5 -mt-1 text-zinc-500">
          La proteína se prescribe por kg de peso; hidratos y lípidos como % del GET; la energía
          total por kcal/kg.
        </p>
        <Grid cols={3} gap={4} mobileCols={2}>
          {GET_INPUT_FIELDS.map((f) => (
            <FormRow key={f.name} htmlFor={f.name} label={f.label}>
              <Input
                {...register(f.name)}
                id={f.name}
                type="number"
                step={f.step}
                min="0"
                variant="outline"
                size="md"
                hasError={errors?.[f.name]?.message}
              />
            </FormRow>
          ))}
        </Grid>
      </section>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Objetivos calculados
        </Heading>
        <div className="overflow-hidden rounded-xl border border-zinc-100">
          <div
            className={`${ROW} text-6 border-b border-zinc-100 bg-zinc-50 py-2.5 font-medium tracking-wide text-zinc-400 uppercase`}
          >
            <span>Nutrimento</span>
            <span className="text-right">Gramos</span>
            <span className="text-right">Energía</span>
            <span className="text-right">%</span>
          </div>
          <div className="divide-y divide-zinc-50">
            {macros.map(({ label, data }) => (
              <div key={label} className={`${ROW} py-2.5`}>
                <span className="text-5 font-medium text-zinc-700">{label}</span>
                <span className="text-5 text-right font-semibold text-zinc-800 tabular-nums">
                  {formatNumber(data.g)} g
                </span>
                <span className="text-5 text-right text-zinc-500 tabular-nums">
                  {formatNumber(data.kcal)} kcal
                </span>
                <span className="text-5 text-right text-zinc-500 tabular-nums">
                  {pct(data.porcentaje)}
                </span>
              </div>
            ))}
          </div>
          <div className={`${ROW} border-t border-zinc-100 bg-teal-50/60 py-2.5`}>
            <span className="text-5 font-semibold text-teal-700">Energía total (GET)</span>
            <span className="text-right text-zinc-300">—</span>
            <span className="text-4 text-right font-bold text-teal-700 tabular-nums">
              {formatNumber(objetivos.get)} kcal
            </span>
            <span
              className={`text-5 text-right font-semibold tabular-nums ${
                totalDescuadrado ? 'text-amber-600' : 'text-teal-600'
              }`}
            >
              {pct(totalPct)}
            </span>
          </div>
        </div>
        {totalDescuadrado && (
          <p className="text-6 text-amber-600">
            La suma de porcentajes ({pct(totalPct)}) se aleja de 100%. Revisa la distribución de
            proteína, hidratos y lípidos.
          </p>
        )}
      </section>
    </div>
  )
}
