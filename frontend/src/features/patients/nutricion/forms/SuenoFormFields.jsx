import FormRow from '@components/FormRow'
import Input from '@components/Input'
import DatePickerComponent from '@ui/DatePickerComponent'
import MonitoreoSelectField from '@features/patients/nutricion/forms/MonitoreoSelectField'
import {
  CLASIF_HORAS_SUENO_OPTIONS,
  INSOMNIO_OPTIONS,
  MEDICACION_SUENO_OPTIONS,
} from '@features/patients/nutricion/constants'

export default function SuenoFormFields({ control, register, errors, namePrefix = '' }) {
  const n = (field) => (namePrefix ? `${namePrefix}.${field}` : field)

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormRow label="Fecha monitoreo" error={errors?.fecha?.message}>
        <DatePickerComponent
          name={n('fecha')}
          control={control}
          birthdate={false}
          hasError={errors?.fecha?.message}
        />
      </FormRow>
      <FormRow label="Horas de sueño" error={errors?.horas_sueno?.message}>
        <Input
          {...register(n('horas_sueno'))}
          type="number"
          placeholder="0"
          variant="outline"
          size="md"
          hasError={errors?.horas_sueno?.message}
        />
      </FormRow>
      <MonitoreoSelectField
        name={n('clasif_horas_sueno')}
        control={control}
        label="Clasif. Hrs sueño"
        options={CLASIF_HORAS_SUENO_OPTIONS}
        error={errors?.clasif_horas_sueno?.message}
      />
      <MonitoreoSelectField
        name={n('insomnio')}
        control={control}
        label="Insomnio"
        options={INSOMNIO_OPTIONS}
        error={errors?.insomnio?.message}
      />
      <MonitoreoSelectField
        name={n('medicacion')}
        control={control}
        label="Med. para dormir"
        options={MEDICACION_SUENO_OPTIONS}
        error={errors?.medicacion?.message}
      />
    </div>
  )
}
