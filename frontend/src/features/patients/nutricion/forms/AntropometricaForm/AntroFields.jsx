import { Controller, useFormContext } from 'react-hook-form'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'
import { useAutoSuggest } from '@features/patients/nutricion/forms/AntropometricaForm/useAutoSuggest'

// Lee el error anidado por path ('adulto.codo' → errors.adulto.codo.message).
function errorAt(errors, name) {
  return name.split('.').reduce((acc, key) => acc?.[key], errors)?.message
}

// Normaliza opciones: acepta ['A','B'] o [{ value, label }].
function normalize(options) {
  return options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
}

export function NumberField({ name, label, placeholder = '0.0', tooltip, unit }) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errorAt(errors, name)
  return (
    <FormRow
      htmlFor={name}
      label={unit ? `${label} (${unit})` : label}
      tooltip={tooltip}
      error={error}
    >
      <Input
        {...register(name)}
        id={name}
        type="number"
        step="any"
        inputMode="decimal"
        placeholder={placeholder}
        variant="outline"
        size="md"
        hasError={error}
      />
    </FormRow>
  )
}

export function TextField({ name, label, placeholder, tooltip }) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errorAt(errors, name)
  return (
    <FormRow htmlFor={name} label={label} tooltip={tooltip} error={error}>
      <Input
        {...register(name)}
        id={name}
        type="text"
        placeholder={placeholder}
        variant="outline"
        size="md"
        hasError={error}
      />
    </FormRow>
  )
}

export function SelectField({ name, label, options, placeholder = 'Seleccionar', tooltip }) {
  const { control } = useFormContext()
  return (
    <FormRow label={label} tooltip={tooltip}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value ?? ''} onValueChange={field.onChange} fullWidth>
            <SelectTrigger size="md">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {normalize(options).map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormRow>
  )
}

// Select con sugerencia automática (editable): rellena `suggested` mientras no
// se toque a mano.
export function AutoSelectField({
  name,
  label,
  options,
  suggested,
  placeholder = 'Seleccionar',
  tooltip,
}) {
  const { control } = useFormContext()
  const release = useAutoSuggest(name, suggested)
  return (
    <FormRow label={label} tooltip={tooltip}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? ''}
            onValueChange={(v) => {
              release()
              field.onChange(v)
            }}
            fullWidth
          >
            <SelectTrigger size="md">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {normalize(options).map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormRow>
  )
}

// Campo de solo lectura para valores auto-calculados.
export function AutoField({ label, value, tooltip, unit }) {
  const display = value == null || value === '' ? '' : `${value}`
  return (
    <FormRow label={unit ? `${label} (${unit})` : label} tooltip={tooltip}>
      <Input value={display} placeholder="Auto" variant="outline" size="md" disabled readOnly />
    </FormRow>
  )
}
