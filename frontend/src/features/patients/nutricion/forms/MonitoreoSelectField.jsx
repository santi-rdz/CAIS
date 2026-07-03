import { Controller } from 'react-hook-form'
import FormRow from '@components/FormRow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'

// Select de catálogo cerrado para los forms de monitoreo (sueño / act. física).
// Comparte el mismo wiring Controller + FormRow + Select que el resto del sistema.
export default function MonitoreoSelectField({ name, control, label, options, error, hint }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: f }) => (
        <FormRow label={label} error={error} hint={hint}>
          <Select value={f.value ?? ''} onValueChange={f.onChange} fullWidth>
            <SelectTrigger size="md" hasError={error}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {options.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormRow>
      )}
    />
  )
}
