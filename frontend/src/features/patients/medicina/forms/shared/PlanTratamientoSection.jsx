import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import CIE10Field from '@features/patients/medicina/forms/shared/CIE10Field'

function Tratamiento({ prefix = 'planes_estudio' }) {
  const { register } = useFormContext()
  const planTratamientoId = `${prefix}_plan_tratamiento`
  const tratamientoId = `${prefix}_tratamiento`

  return (
    <Grid cols={2} gap={4} mobileCols={1}>
      <FormRow htmlFor={planTratamientoId} label="Plan de Tratamiento">
        <Input
          {...register(`${prefix}.plan_tratamiento`)}
          id={planTratamientoId}
          textarea
          rows={4}
          placeholder="Plan de estudio, consideraciones terapéuticas y maniobras diagnósticas"
          variant="outline"
          size="md"
        />
      </FormRow>
      <FormRow htmlFor={tratamientoId} label="Tratamiento">
        <Input
          {...register(`${prefix}.tratamiento`)}
          id={tratamientoId}
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

function Diagnostico({ prefix = 'planes_estudio' }) {
  return (
    <div className="space-y-2">
      <Heading as="h4" showBar>
        Diagnóstico — Código CIE-10
      </Heading>
      <CIE10Field name={`${prefix}.cie10_codes`} />
    </div>
  )
}

export default function PlanTratamientoSection({ children }) {
  return <div className="space-y-5">{children}</div>
}

PlanTratamientoSection.Tratamiento = Tratamiento
PlanTratamientoSection.Diagnostico = Diagnostico
