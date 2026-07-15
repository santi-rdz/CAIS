import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import DatePickerComponent from '@ui/DatePickerComponent'
import {
  NumberField,
  TextField,
  SelectField,
  AutoField,
} from '@features/patients/nutricion/forms/AntropometricaForm/AntroFields'
import {
  computeEstaturaM,
  computePesoSinEdema,
  computePesoIdealPor,
} from '@features/patients/nutricion/forms/AntropometricaForm/serialize'
import { complexionOptions, ANTRO_HINTS } from '@features/patients/nutricion/constants'

export default function EstructuraPesoStep({ femenino }) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const [estatura, pesoActual, edemaLiq, piKg] = useWatch({
    control,
    name: ['estatura', 'peso_actual', 'adulto.edema_liq', 'adulto.pi_kg'],
  })
  const estaturaM = computeEstaturaM(estatura)
  const pesoSinEdema = computePesoSinEdema(pesoActual, edemaLiq)
  const pesoIdealPor = computePesoIdealPor(pesoSinEdema, piKg)

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <Heading as="h4" showBar>
          Identificación y estructura corporal
        </Heading>

        <FormRow label="Fecha de monitoreo" error={errors?.fecha?.message}>
          <DatePickerComponent
            name="fecha"
            control={control}
            birthdate={false}
            hasError={errors?.fecha?.message}
          />
        </FormRow>

        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="estatura" label="Estatura" unit="cm" />
          <AutoField label="Estatura" unit="m" value={estaturaM} />

          <NumberField name="adulto.codo" label="Ancho de codo" unit="mm" />
          <NumberField name="adulto.frisancho" label="Frisancho (percentil)" />

          <SelectField
            name="adulto.complexion"
            label="Complexión (método Frisancho)"
            options={complexionOptions(femenino)}
          />
          <NumberField name="adulto.pi_kg" label="Peso ideal" unit="kg" />
        </div>
      </section>

      <section className="space-y-5 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Análisis de peso
        </Heading>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="peso_actual" label="Peso actual" unit="kg" />
          <NumberField name="adulto.edema_liq" label="Edema / líquido diario" unit="kg" />

          <AutoField
            label="Peso sin edema"
            unit="kg"
            value={pesoSinEdema}
            tooltip={ANTRO_HINTS.peso_sin_edema}
          />
          <NumberField name="adulto.peso_ajustado" label="Peso ajustado" unit="kg" />

          <AutoField
            label="% Peso ideal"
            value={pesoIdealPor}
            tooltip={ANTRO_HINTS.peso_ideal_por}
          />
          <TextField
            name="adulto.diagnostico_pi"
            label="Diagnóstico PI"
            placeholder="Diagnóstico de peso ideal"
          />
        </div>
      </section>
    </div>
  )
}
