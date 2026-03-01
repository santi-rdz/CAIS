import DatePickerComponent from '@ui/DatePickerComponent'
import FormRow from '@ui/FormRow'
import Input from '@ui/Input'
import Row from '@ui/Row'
import { Controller, useFormContext } from 'react-hook-form'

export default function PersonalInfoForm() {
  const { register, control, formState } = useFormContext()
  const { errors } = formState

  return (
    <div className="space-y-4">
      <Row className="gap-4">
        <FormRow htmlFor="firstName" label="Nombre(s)" className="w-full">
          <Input
            {...register('firstName', { required: 'Ingresa el nombre del pasante' })}
            id="firstName"
            type="text"
            placeholder="Ej. Juan Carlos"
            hasError={errors?.firstName?.message}
            variant="outline"
          />
        </FormRow>
        <FormRow htmlFor="lastName" label="Apellidos" className="w-full">
          <Input
            {...register('lastName', { required: 'Ingresa apellidos del pasante' })}
            id="lastName"
            type="text"
            placeholder="Ej. Perez Lopez"
            hasError={errors?.lastName?.message}
            variant="outline"
          />
        </FormRow>
      </Row>
      <Row className="gap-4">
        <FormRow className="w-full" htmlFor="birthday" label="Fecha de nacimiento">
          <Controller
            name="birthday"
            control={control}
            rules={{ required: 'Ingresa la fecha de nacimiento' }}
            render={({ field: { onChange, value } }) => (
              <DatePickerComponent
                date={value ?? null}
                setDate={onChange}
                label="DD/MM/YYYY"
                hasError={!!errors?.birthday}
              />
            )}
          />
        </FormRow>
        <FormRow htmlFor="phone" label="Número telefónico" className="w-full">
          <Input
            {...register('phone', {
              required: 'Ingresa el número telefónico',
              pattern: { value: /^[0-9]{10}$/, message: 'Ingresa un número de 10 dígitos' },
            })}
            id="phone"
            type="tel"
            placeholder="Ej. 6641234567"
            hasError={errors?.phone?.message}
            variant="outline"
          />
        </FormRow>
      </Row>
    </div>
  )
}
