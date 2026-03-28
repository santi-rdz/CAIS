import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import CIE10Field from '../MedicalPatientForm/CIE10Field'

function Tratamiento() {
  const { register } = useFormContext()
  return (
    <Grid cols={2} gap={4} mobileCols={1}>
      <FormRow htmlFor="plan_tratamiento" label="Plan de Tratamiento">
        <Input
          {...register('plan_estudio.plan_tratamiento')}
          id="plan_tratamiento"
          textarea
          rows={4}
          placeholder="Plan de estudio, consideraciones terapéuticas y maniobras diagnósticas"
          variant="outline"
          size="md"
        />
      </FormRow>
      <FormRow htmlFor="tratamiento" label="Tratamiento">
        <Input
          {...register('plan_estudio.tratamiento')}
          id="tratamiento"
          textarea
          rows={4}
          placeholder="Medicamentos, dosis y frecuencia"
          variant="outline"
          size="md"
        />
      </FormRow>
    </Grid>
  )
}

function Diagnostico() {
  return (
    <div className="space-y-2">
      <Heading as="h4" showBar>
        Diagnóstico — Código CIE-10
      </Heading>
      <CIE10Field />
    </div>
  )
}

export default function PlanTratamientoSection({ children }) {
  return <div className="space-y-5">{children}</div>
}

PlanTratamientoSection.Tratamiento = Tratamiento
PlanTratamientoSection.Diagnostico = Diagnostico
