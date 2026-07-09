import { Controller, useFormContext } from 'react-hook-form'
import Input from '@components/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'
import { getFieldError } from '@lib/formErrors'
import {
  FRECUENCIA_CONSUMO_OPTIONS,
  CANTIDAD_LIQUIDOS_OPTIONS,
  AZUCAR_TIPO_OPTIONS,
} from '@features/patients/nutricion/constants'

const SELECT_OPTIONS = {
  frecuencia: { options: FRECUENCIA_CONSUMO_OPTIONS, placeholder: 'Seleccionar frecuencia' },
  cantidad: { options: CANTIDAD_LIQUIDOS_OPTIONS, placeholder: 'Seleccionar cantidad' },
  azucar: { options: AZUCAR_TIPO_OPTIONS, placeholder: 'Seleccionar tipo' },
}

// Fila compacta label→control de un campo de FRECUENCIA_GROUPS, bajo el prefix
// `frec_consumo_alimentos_nutricion`. El layout en línea (en vez de label-arriba)
// acorta un cuestionario de ~40 campos a la mitad y lo vuelve escaneable.
export default function FrecuenciaField({ field }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  const { name, label, type } = field
  const fieldName = `frec_consumo_alimentos_nutricion.${name}`
  const error = getFieldError(errors, fieldName)
  const select = SELECT_OPTIONS[type]

  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5 last:border-0">
      <label
        htmlFor={select ? undefined : fieldName}
        className="text-5 min-w-0 flex-1 text-zinc-600"
      >
        {label}
      </label>
      <div className="w-60 shrink-0 max-sm:w-40">
        {select ? (
          <Controller
            name={fieldName}
            control={control}
            render={({ field: f }) => (
              <Select value={f.value ?? ''} onValueChange={f.onChange} fullWidth>
                <SelectTrigger size="md" hasError={error}>
                  <SelectValue placeholder={select.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {select.options.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <Input
            {...register(fieldName)}
            id={fieldName}
            type={type === 'numero' ? 'number' : 'text'}
            placeholder={type === 'numero' ? 'Ej: 2' : 'Ej: 3'}
            variant="outline"
            size="md"
            hasError={error}
          />
        )}
      </div>
    </div>
  )
}
