import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import Grid from '@components/Grid'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import ToggleField from '@features/patients/nutricion/forms/EvalNutricionalForm/ToggleField'
import SintomasGiField from '@features/patients/nutricion/forms/ExamFisicoForm/SintomasGiField'
import { SIGNOS_NUM_FIELDS } from '@features/patients/nutricion/forms/ExamFisicoForm/fieldConfig'

export default function SintomasSignosStep() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const presentaSgi = useWatch({ control, name: 'presenta_sgi' })

  // Si deja de presentar SGI, limpia la lista para no arrastrar síntomas
  // huérfanos (el campo se oculta pero RHF conserva su estado).
  useEffect(() => {
    if (presentaSgi !== true) setValue('sintomas', [], { shouldDirty: true })
  }, [presentaSgi, setValue])

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Heading as="h4" showBar>
          Síntomas Gastrointestinales
        </Heading>
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 px-4">
          <ToggleField
            name="presenta_sgi"
            control={control}
            label="¿El paciente presenta algún síntoma gastrointestinal (SGI)?"
          />
        </div>
        {presentaSgi === true && <SintomasGiField />}
      </section>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Signos Vitales
        </Heading>
        <Grid cols={3} gap={4} mobileCols={1}>
          {SIGNOS_NUM_FIELDS.map(({ name, label, placeholder }) => (
            <FormRow key={name} htmlFor={name} label={label}>
              <Input
                {...register(`signos_vitales.${name}`)}
                id={name}
                type="number"
                step="0.1"
                placeholder={placeholder}
                variant="outline"
                size="md"
                hasError={errors?.signos_vitales?.[name]?.message}
              />
            </FormRow>
          ))}
        </Grid>
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 px-4">
          <ToggleField
            name="signos_vitales.dificultad_respiratoria"
            control={control}
            label="Dificultad respiratoria"
          />
        </div>
      </section>
    </div>
  )
}
