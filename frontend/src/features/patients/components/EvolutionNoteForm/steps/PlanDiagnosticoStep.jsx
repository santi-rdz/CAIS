import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Divider from '@components/Divider'
import DatePickerComponent from '@ui/DatePickerComponent'
import PlanTratamientoSection from '../../shared/PlanTratamientoSection'

export default function PlanDiagnosticoStep() {
  const { control, register } = useFormContext()

  return (
    <div className="space-y-5">
      <Heading as="h3" showBar>
        Plan y Diagnóstico
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

      <PlanTratamientoSection>
        <PlanTratamientoSection.Tratamiento />

        <Divider />

        <FormRow
          htmlFor="estudios_complementarios"
          label="Estudios complementarios efectuados"
        >
          <Input
            {...register('plan_estudio.estudios_complementarios')}
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
