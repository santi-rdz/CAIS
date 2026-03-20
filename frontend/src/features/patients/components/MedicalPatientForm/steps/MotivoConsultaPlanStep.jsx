import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import Divider from '@components/Divider'
import DatePickerComponent from '@ui/DatePickerComponent'
import CIE10Field from '../CIE10Field'

export default function MotivoConsultaPlanStep() {
  const { register, control } = useFormContext()

  return (
    <div className="space-y-5">
      <Heading as="h3" showBar required>
        Motivo de Consulta y Plan
      </Heading>

      {/* Fecha de Generación */}
      <FormRow label="Fecha de Generación" className="w-1/2">
        <DatePickerComponent
          name="fechaGeneracion"
          control={control}
          birthdate={false}
          label="DD/MM/AAAA"
        />
      </FormRow>

      {/* Divider */}
      <Divider />

      {/* Motivo + Historia */}
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

      {/* Divider */}
      <Divider />

      {/* Plan + Tratamiento */}
      <Grid cols={2} gap={4} mobileCols={1}>
        <FormRow htmlFor="planTratamiento" label="Plan de Tratamiento">
          <Input
            {...register('planTratamiento')}
            id="planTratamiento"
            textarea
            rows={4}
            placeholder="Especifica el plan de estudio, consideraciones terapéuticas, maniobras diagnósticas y otras indicaciones"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow htmlFor="tratamiento" label="Tratamiento">
          <Input
            {...register('tratamiento')}
            id="tratamiento"
            textarea
            rows={4}
            placeholder="Medicamentos, dosis y frecuencia"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Grid>

      {/* Divider */}
      <Divider />

      {/* ── Diagnóstico CIE-10 ── */}
      <div className="space-y-2">
        <Heading as="h4" showBar required>
          Diagnóstico — Código CIE-10
        </Heading>
        <CIE10Field />
      </div>
    </div>
  )
}
