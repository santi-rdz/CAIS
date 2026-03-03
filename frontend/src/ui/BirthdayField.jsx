import FormRow from './FormRow'
import DatePickerComponent from './DatePickerComponent'

export default function BirthdayField({ control, errors }) {
  return (
    <FormRow className="w-full" htmlFor="birthday" label="Fecha de nacimiento">
      <DatePickerComponent
        name="birthday"
        control={control}
        rules={{
          required: 'Ingresa la fecha de nacimiento',
          validate: (val) => val !== 'invalid' || 'Ingresa una fecha válida',
        }}
        hasError={errors?.birthday?.message}
      />
    </FormRow>
  )
}
