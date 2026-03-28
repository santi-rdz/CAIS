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
          name="fechaGeneracion"
          control={control}
          birthdate={false}
          label="DD/MM/AAAA"
        />
      </FormRow>

      <Divider />

      <Grid cols={2} gap={4} mobileCols={1}>
        <FormRow htmlFor="motivoConsulta" label="Motivo de Consulta">
          <Input
            {...register('motivoConsulta')}
            id="motivoConsulta"
            textarea
            rows={4}
            placeholder="Describe el motivo principal por el que consulta el paciente"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow
          htmlFor="historiaEnfermedadActual"
          label="Historia de la Enfermedad Actual"
        >
          <Input
            {...register('historiaEnfermedadActual')}
            id="historiaEnfermedadActual"
            textarea
            rows={4}
            placeholder="Describe detalladamente el padecimiento actual del paciente"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Grid>

      <Divider />

      <PlanTratamientoSection />
    </div>
  )
}
