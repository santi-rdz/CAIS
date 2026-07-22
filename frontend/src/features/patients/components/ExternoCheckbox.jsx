import { Controller, useFormContext } from 'react-hook-form'
import Checkbox from '@components/Checkbox'

export default function ExternoCheckbox() {
  const { control } = useFormContext()
  return (
    <Controller
      name="es_externo"
      control={control}
      render={({ field }) => (
        <Checkbox
          id="es_externo"
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          label="Paciente externo"
        />
      )}
    />
  )
}
