import FormRow from './FormRow'
import Input from './Input'

export default function PhoneField({ register, errors, required = true }) {
  return (
    <FormRow htmlFor="phone" label="Número telefónico" className="w-full">
      <Input
        {...register('phone', {
          required: required ? 'Ingresa el número telefónico' : false,
          pattern: {
            value: /^[0-9]{10}$/,
            message: 'Ingresa un número de 10 dígitos',
          },
        })}
        id="phone"
        type="tel"
        placeholder="Ej. 6641234567"
        hasError={errors?.phone?.message}
        variant="outline"
      />
    </FormRow>
  )
}
