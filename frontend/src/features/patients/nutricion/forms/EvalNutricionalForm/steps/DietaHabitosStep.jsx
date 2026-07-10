import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import Grid from '@components/Grid'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import DatePickerComponent from '@ui/DatePickerComponent'
import TimeField from '@ui/TimeField'
import MonitoreoSelectField from '@features/patients/nutricion/forms/MonitoreoSelectField'
import ToggleField from '@features/patients/nutricion/forms/EvalNutricionalForm/ToggleField'
import {
  TIPO_ALIMENTACION_OPTIONS,
  PENSAMIENTOS_DIETA_OPTIONS,
} from '@features/patients/nutricion/constants'
import {
  HORARIO_TIME_FIELDS,
  HORARIO_BOOL_FIELDS,
} from '@features/patients/nutricion/forms/EvalNutricionalForm/fieldConfig'

const TIPO_ALIMENTACION_TOGGLE = TIPO_ALIMENTACION_OPTIONS.map((o) => ({ value: o, label: o }))

export default function DietaHabitosStep() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const tieneAlergia = useWatch({ control, name: 'tiene_alergia' })

  // Si se desmarca la alergia, limpia el "¿cuál?" para no arrastrar un valor
  // huérfano al payload (el input se desmonta pero RHF conserva su estado).
  useEffect(() => {
    if (tieneAlergia !== true) setValue('cual_alergia', '', { shouldDirty: true })
  }, [tieneAlergia, setValue])

  return (
    <div className="space-y-6">
      <FormRow label="Fecha de evaluación" error={errors?.fecha?.message}>
        <DatePickerComponent
          name="fecha"
          control={control}
          birthdate={false}
          hasError={errors?.fecha?.message}
        />
      </FormRow>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Dieta y Alergias
        </Heading>
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 px-4">
          <ToggleField
            name="sigue_dieta"
            control={control}
            label="¿Sigue o ha seguido una dieta prescrita por nutriólogo?"
          />
          <ToggleField name="tiene_alergia" control={control} label="Alergia alimentaria" />
        </div>
        {tieneAlergia === true && (
          <FormRow htmlFor="cual_alergia" label="¿Cuál alergia?">
            <Input
              {...register('cual_alergia')}
              id="cual_alergia"
              type="text"
              placeholder="Ej: lácteos, gluten…"
              variant="outline"
              size="md"
              hasError={errors?.cual_alergia?.message}
            />
          </FormRow>
        )}
      </section>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Horarios de Comida
        </Heading>
        <Grid cols={3} gap={4} mobileCols={2}>
          {HORARIO_TIME_FIELDS.map(({ name, label }) => (
            <TimeField
              key={name}
              name={`horarios_comida_nutricion.${name}`}
              control={control}
              errors={errors?.horarios_comida_nutricion}
              label={label}
              required={false}
            />
          ))}
        </Grid>
      </section>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Problemas de Alimentación
        </Heading>
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 px-4">
          <ToggleField
            name="horarios_comida_nutricion.tipo_alimentacion"
            control={control}
            label="Tipo de alimentación"
            options={TIPO_ALIMENTACION_TOGGLE}
            boolean={false}
          />
          {HORARIO_BOOL_FIELDS.map(({ name, label }) => (
            <ToggleField
              key={name}
              name={`horarios_comida_nutricion.${name}`}
              control={control}
              label={label}
            />
          ))}
        </div>
        <MonitoreoSelectField
          name="horarios_comida_nutricion.pensamientos_sobre_dieta"
          control={control}
          label="¿Qué ha pensado acerca de iniciar una dieta?"
          options={PENSAMIENTOS_DIETA_OPTIONS}
        />
      </section>
    </div>
  )
}
