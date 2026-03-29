import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import Divider from '@components/Divider'
import DatePickerComponent from '@ui/DatePickerComponent'
import PlanTratamientoSection from '../../shared/PlanTratamientoSection'

export default function MotivoConsultaPlanStep() {
  const { register, control } = useFormContext()

  return (
    <div className="space-y-5">
      <Heading as="h3" showBar required>
        Motivo de Consulta y Plan
      </Heading>

      <FormRow label="Fecha de Generación" className="w-1/2">
        <DatePickerComponent
          name="plan_estudio.generado_en"
          control={control}
          birthdate={false}
          label="DD/MM/AAAA"
        />
      </FormRow>

      <Divider />

      <Grid cols={2} gap={4} mobileCols={1}>
        <FormRow htmlFor="motivo_consulta" label="Motivo de Consulta">
          <Input
            {...register('motivo_consulta')}
            id="motivo_consulta"
            textarea
            rows={4}
            placeholder="Describe el motivo principal por el que consulta el paciente"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow
          htmlFor="historia_enfermedad_actual"
          label="Historia de la Enfermedad Actual"
        >
          <Input
            {...register('historia_enfermedad_actual')}
            id="historia_enfermedad_actual"
            textarea
            rows={4}
            placeholder="Describe detalladamente el padecimiento actual del paciente"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Grid>

      <Divider />

      <PlanTratamientoSection>
        <PlanTratamientoSection.Tratamiento />
        <PlanTratamientoSection.Diagnostico />
      </PlanTratamientoSection>
    </div>
  )
}
