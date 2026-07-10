import { Controller } from 'react-hook-form'
import FormRow from '@components/FormRow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'

// Select de catálogo cerrado para los forms de monitoreo (sueño / act. física /
// evaluación nutricional). Comparte el mismo wiring Controller + FormRow +
// Select que el resto del sistema. `options` acepta strings ('Diario') o pares
// { value, label } cuando el valor guardado difiere de lo que se muestra (ej.
// los selects puntuados de apetito, cuyo label completo no cabe en VARCHAR(20)).
export default function MonitoreoSelectField({
  name,
  control,
  label,
  options,
  error,
  hint,
  placeholder = 'Seleccionar',
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: f }) => (
        <FormRow label={label} error={error} hint={hint}>
          <Select value={f.value ?? ''} onValueChange={f.onChange} fullWidth>
            <SelectTrigger size="md" hasError={error}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((op) => {
                const opt = typeof op === 'string' ? { value: op, label: op } : op
                return (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </FormRow>
      )}
    />
  )
}
