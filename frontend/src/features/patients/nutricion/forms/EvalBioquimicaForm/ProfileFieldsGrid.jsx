import { useFormContext } from 'react-hook-form'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'
import MonitoreoSelectField from '@features/patients/nutricion/forms/MonitoreoSelectField'
import { getFieldError } from '@lib/formErrors'

// Renderiza un grid de campos de un sub-perfil a partir de su config
// declarativa (@features/patients/nutricion/forms/EvalBioquimicaForm/fieldConfig).
// Único lugar que sabe traducir { name, label, hint, type, options } a
// FormRow + Input/MonitoreoSelectField — evita repetir el mapeo en cada step.
export default function ProfileFieldsGrid({ fields, prefix, cols = 3 }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Grid cols={cols} gap={4} mobileCols={2}>
      {fields.map(({ name, label, hint, step, type, options, prefix: fieldPrefix }) => {
        const fieldName = `${fieldPrefix ?? prefix}.${name}`

        if (type === 'select') {
          return (
            <MonitoreoSelectField
              key={fieldName}
              name={fieldName}
              control={control}
              label={label}
              hint={hint}
              options={options}
              error={getFieldError(errors, fieldName)}
            />
          )
        }

        return (
          <FormRow key={fieldName} htmlFor={fieldName} label={label} hint={hint}>
            <Input
              {...register(fieldName)}
              id={fieldName}
              type="number"
              step={step ?? '0.1'}
              placeholder="0.0"
              variant="outline"
              size="md"
              hasError={getFieldError(errors, fieldName)}
            />
          </FormRow>
        )
      })}
    </Grid>
  )
}
