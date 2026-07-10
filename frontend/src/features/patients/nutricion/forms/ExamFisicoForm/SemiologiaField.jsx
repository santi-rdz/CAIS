import { Controller, useFormContext } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'
import { getFieldError } from '@lib/formErrors'

// Fila compacta label→select de un indicador semiológico, bajo el prefix
// `semiologia`. El layout en línea (en vez de label-arriba) mantiene escaneable
// el bloque de ~12 indicadores en vez de la rejilla dispersa del formato original.
export default function SemiologiaField({ name, label, options, placeholder = 'Seleccionar' }) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const fieldName = `semiologia.${name}`
  const error = getFieldError(errors, fieldName)

  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5 last:border-0">
      <span className="text-5 min-w-0 flex-1 text-zinc-600">{label}</span>
      <div className="w-60 shrink-0 max-sm:w-40">
        <Controller
          name={fieldName}
          control={control}
          render={({ field: f }) => (
            <Select value={f.value ?? ''} onValueChange={f.onChange} fullWidth>
              <SelectTrigger size="md" hasError={error}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  )
}
