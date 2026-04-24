import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Divider from '@components/Divider'
import PlanTratamientoSection from '../../shared/PlanTratamientoSection'

export default function PlanDiagnosticoStep() {
  const { register } = useFormContext()

  return (
    <div className="space-y-5">
      <Heading as="h3" showBar>
        Plan y Diagnóstico
      </Heading>

      <Divider />

      <PlanTratamientoSection>
        <PlanTratamientoSection.Tratamiento />

        <Divider />

        <FormRow
          htmlFor="estudios_complementarios"
          label="Estudios complementarios efectuados"
        >
          <Input
            {...register('planes_estudio.estudios_complementarios')}
            id="estudios_complementarios"
            textarea
            rows={4}
            placeholder="Laboratorios, imágenes y otros estudios realizados en esta consulta"
            variant="outline"
            size="md"
          />
        </FormRow>

        <Divider />

        <PlanTratamientoSection.Diagnostico />
      </PlanTratamientoSection>
    </div>
  )
}
