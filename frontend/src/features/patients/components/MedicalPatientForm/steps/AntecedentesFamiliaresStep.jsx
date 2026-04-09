import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'

const FAMILIARES = [
  { name: 'padre', label: 'Padre', placeholder: 'Enfermedades o condiciones del padre' },
  { name: 'madre', label: 'Madre', placeholder: 'Enfermedades o condiciones de la madre' },
  { name: 'abuelo_paterno', label: 'Abuelo Paterno', placeholder: 'Enfermedades o condiciones' },
  { name: 'abuela_paterna', label: 'Abuela Paterna', placeholder: 'Enfermedades o condiciones' },
  { name: 'abuelo_materno', label: 'Abuelo Materno', placeholder: 'Enfermedades o condiciones' },
  { name: 'abuela_materna', label: 'Abuela Materna', placeholder: 'Enfermedades o condiciones' },
]

export default function AntecedentesFamiliaresStep() {
  const { register } = useFormContext()

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar required>
        Antecedentes Heredofamiliares
      </Heading>

      <Grid cols={2} gap={4} mobileCols={1}>
        {FAMILIARES.map(({ name, label, placeholder }) => (
          <FormRow key={name} htmlFor={name} label={label}>
            <Input
              {...register(`antecedentes_familiares.${name}`)}
              id={name}
              textarea
              rows={3}
              placeholder={placeholder}
              variant="outline"
              size="md"
            />
          </FormRow>
        ))}
      </Grid>

      <FormRow htmlFor="otros_familiares" label="Otros familiares">
        <Input
          {...register('antecedentes_familiares.otros')}
          id="otros_familiares"
          textarea
          rows={3}
          placeholder="Hermanos, tíos u otros familiares con condiciones relevantes"
          variant="outline"
          size="md"
        />
      </FormRow>
    </div>
  )
}
