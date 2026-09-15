import { Controller, useFormContext } from 'react-hook-form'
import { AREA_LABELS } from '@cais/shared/constants/users'
import FormRow from './components/FormRow'
import Input from './components/Input'
import AreaSelect from './AreaSelect'

// Campo de área integrado a react-hook-form. `disabled` muestra el valor
// heredado como solo-lectura (coordinador / registro); editable elige el área.
export default function AreaField({ name = 'area', disabled = false, required = true, className }) {
  const { control, formState } = useFormContext()
  const error = formState.errors?.[name]?.message

  return (
    <FormRow
      label="Área"
      className={className}
      required={required && !disabled}
      error={disabled ? undefined : error}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          disabled ? (
            <Input value={AREA_LABELS[field.value] ?? '—'} variant="muted" size="lg" disabled />
          ) : (
            <AreaSelect
              value={field.value}
              onValueChange={field.onChange}
              hasError={error}
              fullWidth
            />
          )
        }
      />
    </FormRow>
  )
}
