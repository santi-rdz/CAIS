import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import Grid from '@components/Grid'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import DatePickerComponent from '@ui/DatePickerComponent'
import {
  REC24H_NUTRIENTES,
  REC24H_OBJETIVO_PLACEHOLDERS,
} from '@features/patients/nutricion/constants'

export default function ObjetivosStep() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

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
          Objetivos nutricionales del día
        </Heading>
        <p className="text-5 -mt-1 text-zinc-500">
          Metas diarias contra las que se compara la ingesta real del recordatorio. Todos son
          opcionales.
        </p>
        <Grid cols={4} gap={4} mobileCols={2}>
          {REC24H_NUTRIENTES.map(({ key, label, unit, objName }) => (
            <FormRow key={key} htmlFor={objName} label={`${label} (${unit})`}>
              <Input
                {...register(objName)}
                id={objName}
                type="number"
                step="0.1"
                min="0"
                placeholder={REC24H_OBJETIVO_PLACEHOLDERS[objName]}
                variant="outline"
                size="md"
                hasError={errors?.[objName]?.message}
              />
            </FormRow>
          ))}
        </Grid>
      </section>
    </div>
  )
}
