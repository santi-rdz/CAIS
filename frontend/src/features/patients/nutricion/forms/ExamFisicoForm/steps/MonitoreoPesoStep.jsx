import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import Grid from '@components/Grid'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import DatePickerComponent from '@ui/DatePickerComponent'
import PesoLossCard from '@features/patients/nutricion/forms/ExamFisicoForm/PesoLossCard'
import { PESO_FIELDS } from '@features/patients/nutricion/forms/ExamFisicoForm/fieldConfig'
import { computePesoLoss } from '@features/patients/nutricion/constants'

export default function MonitoreoPesoStep() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

  const peso = useWatch({ control, name: 'eval_perdida_peso' })
  const { porcentaje, enRiesgo } = computePesoLoss(peso)

  return (
    <div className="space-y-6">
      <FormRow label="Fecha de monitoreo" error={errors?.fecha?.message}>
        <DatePickerComponent
          name="fecha"
          control={control}
          birthdate={false}
          hasError={errors?.fecha?.message}
        />
      </FormRow>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Monitoreo de Peso
        </Heading>
        <p className="text-5 -mt-1 text-zinc-500">
          Evaluación de cambios de peso y cálculo automático del porcentaje de pérdida.
        </p>
        <Grid cols={2} gap={4} mobileCols={1}>
          {PESO_FIELDS.map(({ name, label, placeholder }) => (
            <FormRow key={name} htmlFor={name} label={label}>
              <Input
                {...register(`eval_perdida_peso.${name}`)}
                id={name}
                type="number"
                step="0.1"
                placeholder={placeholder}
                variant="outline"
                size="md"
                hasError={errors?.eval_perdida_peso?.[name]?.message}
              />
            </FormRow>
          ))}
        </Grid>
      </section>

      <PesoLossCard porcentaje={porcentaje} enRiesgo={enRiesgo} />
    </div>
  )
}
