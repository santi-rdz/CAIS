import { useWatch } from 'react-hook-form'
import dayjs from 'dayjs'
import FormRow from '@components/FormRow'
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

  const fecha = useWatch({ control, name })
  const edad =
    birthdate && fecha && fecha !== 'invalid' && dayjs.isDayjs(fecha)
      ? dayjs().diff(fecha, 'year')
      : null

  return (
    <FormRow
      className="w-full"
      htmlFor={name}
      label={label}
      required={birthdate}
    >
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
      {birthdate && edad !== null && (
        <p className="mt-1 text-xs text-zinc-500">{edad} años</p>
      )}
    </FormRow>
  )
}
