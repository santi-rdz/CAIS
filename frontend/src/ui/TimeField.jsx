import FormRow from './FormRow'
import TimePickerComponent from './TimePickerComponent'

export default function TimeField({
  control,
  errors,
  name = 'hora',
  label = 'Hora',
  required = true,
}) {
  return (
    <FormRow className="w-full" htmlFor={name} label={label}>
      <TimePickerComponent
        name={name}
        control={control}
        rules={{
          required: required ? 'Ingresa la hora' : false,
          validate: (val) => val !== 'invalid' || 'Ingresa una hora válida',
        }}
        hasError={errors?.[name]?.message}
      />
    </FormRow>
  )
}
