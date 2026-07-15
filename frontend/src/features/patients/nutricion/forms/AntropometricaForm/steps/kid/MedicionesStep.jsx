import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import DatePickerComponent from '@ui/DatePickerComponent'
import {
  NumberField,
  TextField,
  AutoField,
} from '@features/patients/nutricion/forms/AntropometricaForm/AntroFields'
import { computeImc } from '@features/patients/nutricion/forms/AntropometricaForm/serialize'
import { ANTRO_HINTS } from '@features/patients/nutricion/constants'

export default function MedicionesStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const [pesoActual, estatura] = useWatch({ control, name: ['peso_actual', 'estatura'] })
  const imc = computeImc(pesoActual, estatura)

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <Heading as="h4" showBar>
          Mediciones básicas
        </Heading>

        <FormRow label="Fecha de evaluación" error={errors?.fecha?.message}>
          <DatePickerComponent
            name="fecha"
            control={control}
            birthdate={false}
            hasError={errors?.fecha?.message}
          />
        </FormRow>

        <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
          <NumberField name="peso_actual" label="Peso actual" unit="kg" />
          <NumberField name="estatura" label="Estatura" unit="cm" />
          <AutoField label="IMC" unit="kg/m²" value={imc} tooltip={ANTRO_HINTS.imc} />
        </div>

        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField
            name="kid.percentiles_imc"
            label="DE o percentilas (IMC)"
            placeholder="Z-score o %"
          />
          <TextField
            name="kid.interpretacion_imc"
            label="Interpretación (IMC)"
            placeholder="Interpretación clínica"
          />
        </div>
      </section>

      <section className="space-y-5 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Circunferencias y pliegues cutáneos
        </Heading>

        <NumberField name="pantorrilla" label="Circunferencia de pantorrilla" unit="cm" />

        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="cintura" label="Circunferencia de cintura" unit="cm" />
          <NumberField
            name="kid.percentiles_cintura"
            label="DE o percentilas (Cintura)"
            placeholder="Z-score o %"
          />

          <NumberField name="pb" label="Circunferencia media de brazo / PB" unit="cm" />
          <NumberField
            name="kid.percentiles_pb"
            label="DE o percentilas (PB)"
            placeholder="Z-score o %"
          />

          <NumberField name="pct" label="Pliegue cutáneo tricipital / PCT" unit="mm" />
          <NumberField
            name="kid.percentiles_pct"
            label="DE o percentilas (PCT)"
            placeholder="Z-score o %"
          />

          <NumberField name="pcse" label="Pliegue cutáneo subescapular / PCSE" unit="mm" />
          <NumberField
            name="kid.percentiles_pcse"
            label="DE o percentilas (PCSE)"
            placeholder="Z-score o %"
          />
        </div>
      </section>
    </div>
  )
}
