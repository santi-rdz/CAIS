import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import Divider from '@components/Divider'
import DatePickerComponent from '@ui/DatePickerComponent'
import CIE10Field from '../../MedicalPatientForm/CIE10Field'

export default function PlanDiagnosticoStep() {
  const { control, register } = useFormContext()

  return (
    <div className="space-y-5">
      <Heading as="h3" showBar>
        Plan y Diagnóstico
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

      <FormRow
        htmlFor="estudiosComplementarios"
        label="Estudios complementarios efectuados"
      >
        <Input
          {...register('estudiosComplementarios')}
          id="estudiosComplementarios"
          textarea
          rows={4}
          placeholder="Laboratorios, imágenes y otros estudios realizados en esta consulta"
          variant="outline"
          size="md"
        />
      </FormRow>

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
