import FormRow from './FormRow'
import DatePickerComponent from './DatePickerComponent'

export default function BirthdayField({
  control,
  errors,
  birthdate = true,
  name = 'fechaNacimiento',
}) {
  const label = birthdate ? 'Fecha de nacimiento' : 'Fecha'
  const requiredMessage = birthdate
    ? 'Ingresa la fecha de nacimiento'
    : 'Ingresa la fecha'
  return (
    <FormRow className="w-full" htmlFor={name} label={label}>
      <DatePickerComponent
        name={name}
        control={control}
        rules={{
          required: requiredMessage,
          validate: (val) => val !== 'invalid' || 'Ingresa una fecha válida',
        }}
        hasError={errors?.[name]?.message}
        birthdate={birthdate}
      />
    </FormRow>
  )
}
