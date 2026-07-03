import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Divider from '@components/Divider'
import DatePickerComponent from '@ui/DatePickerComponent'
import ProfileFieldsGrid from '@features/patients/nutricion/forms/EvalBioquimicaForm/ProfileFieldsGrid'
import {
  PERFIL_ANEMIA_FIELDS,
  PERFIL_ENDOCRINO_FIELDS,
} from '@features/patients/nutricion/forms/EvalBioquimicaForm/fieldConfig'

export default function HematologiaEndocrinoStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-5">
      <FormRow label="Fecha de Evaluación" htmlFor="fecha">
        <DatePickerComponent
          name="fecha"
          control={control}
          birthdate={false}
          hasError={errors?.fecha?.message}
        />
      </FormRow>

      <Divider />

      <div className="space-y-4">
        <Heading as="h4" showBar>
          Perfil de Anemia Nutricia
        </Heading>
        <ProfileFieldsGrid fields={PERFIL_ANEMIA_FIELDS} prefix="perfil_anemia_nutricion" />
      </div>

      <Divider />

      <div className="space-y-4">
        <Heading as="h4" showBar>
          Perfil Endócrino
        </Heading>
        <ProfileFieldsGrid fields={PERFIL_ENDOCRINO_FIELDS} prefix="perfil_endocrino" />
      </div>
    </div>
  )
}
