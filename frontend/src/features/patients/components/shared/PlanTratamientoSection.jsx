import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import Divider from '@components/Divider'
import CIE10Field from '../MedicalPatientForm/CIE10Field'

/**
 * Sección compartida de Plan de Tratamiento y Diagnóstico CIE-10.
 * Usada en MotivoConsultaPlanStep (historia) y PlanDiagnosticoStep (evolución).
 */
export default function PlanTratamientoSection() {
  const { register } = useFormContext()

  return (
    <div className="space-y-5">
      <Grid cols={2} gap={4} mobileCols={1}>
        <FormRow htmlFor="planTratamiento" label="Plan de Tratamiento">
          <Input
            {...register('planTratamiento')}
            id="planTratamiento"
            textarea
            rows={4}
            placeholder="Plan de estudio, consideraciones terapéuticas y maniobras diagnósticas"
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

      <Divider />

      <div className="space-y-2">
        <Heading as="h4" showBar>
          Diagnóstico — Código CIE-10
        </Heading>
        <CIE10Field />
      </div>
    </div>
  )
}
