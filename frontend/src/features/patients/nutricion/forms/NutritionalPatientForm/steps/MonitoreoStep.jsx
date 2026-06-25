import { useFieldArray, useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'

// Shell común de los steps de monitoreo (sueño / actividad física): heading +
// descripción + el set de campos de la primera evaluación. `Fields` es el
// componente de campos del dominio (referencia estable de módulo, no inline).
export default function MonitoreoStep({ title, name, Fields }) {
  const {
    formState: { errors },
    control,
    register,
  } = useFormContext()

  const { fields } = useFieldArray({ control, name })

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar>
        {title}
      </Heading>
      <p className="text-6 text-zinc-500">
        Evaluación inicial. Puedes agregar más registros desde la historia del paciente.
      </p>
      {fields.map((field, index) => (
        <Fields
          key={field.id}
          control={control}
          register={register}
          errors={errors?.[name]?.[index]}
          namePrefix={`${name}.${index}`}
        />
      ))}
    </div>
  )
}
