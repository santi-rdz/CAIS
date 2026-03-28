import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'

const SISTEMAS = [
  { name: 'neurologico', label: 'Neurológico' },
  { name: 'cardiovascular', label: 'Cardiovascular' },
  { name: 'respiratorio', label: 'Respiratorio' },
  { name: 'hematologico', label: 'Hematológico' },
  { name: 'digestivo', label: 'Digestivo' },
  { name: 'musculoesqueletico', label: 'Musculoesquelético' },
  { name: 'genitourinario', label: 'Genitourinario' },
  { name: 'endocrinologico', label: 'Endocrinología' },
  { name: 'nutricional', label: 'Nutricional' },
  { name: 'metabolico', label: 'Metabólico' },
]

export default function AparatosSistemasStep() {
  const { register } = useFormContext()

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar required>
        Interrogatorio por Aparatos y Sistemas
      </Heading>
      <p className="text-5 text-zinc-500">
        Deje en blanco si no hay alteraciones.
      </p>

      <Grid cols={3} gap={4} mobileCols={2}>
        {SISTEMAS.map(({ name, label }) => (
          <FormRow key={name} htmlFor={name} label={label}>
            <Input
              {...register(`aparatos_sistemas.${name}`)}
              id={name}
              textarea
              rows={2}
              placeholder="Ingresa y agrega"
              variant="outline"
              size="md"
            />
          </FormRow>
        ))}
      </Grid>
    </div>
  )
}
