import { useController, useFormContext } from 'react-hook-form'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import { formatPhone } from '@lib/utils'

export default function PhoneField({
  control: controlProp,
  errors,
  required = true,
}) {
  const ctx = useFormContext()
  const control = controlProp ?? ctx?.control
  const fieldErrors = errors ?? ctx?.formState.errors

  const {
    field: { value, onChange, onBlur, ref },
  } = useController({
    name: 'telefono',
    control,
    defaultValue: '',
    rules: {
      required: required ? 'Ingresa el número telefónico' : false,
      validate: (v) =>
        !required || v.replace(/\D/g, '').length === 10
          ? true
          : 'Ingresa un número de 10 dígitos',
    },
  })

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(digits)
  }

  return (
    <FormRow
      htmlFor="telefono"
      label="Número telefónico"
      className="w-full"
      required={required}
    >
      <Input
        ref={ref}
        id="telefono"
        type="tel"
        value={formatPhone(value)}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder="(664) 285-1234"
        hasError={fieldErrors?.telefono?.message}
        variant="outline"
        size="lg"
      />
    </FormRow>
  )
}
