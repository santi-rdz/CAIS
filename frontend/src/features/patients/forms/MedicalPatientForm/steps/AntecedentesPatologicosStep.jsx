import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'

const CAMPOS = [
  { name: 'cronico_degenerativos', label: 'Crónico-Degenerativos' },
  { name: 'quirurgicos', label: 'Quirúrgicos' },
  { name: 'hospitalizaciones', label: 'Hospitalizaciones' },
  { name: 'traumaticos', label: 'Traumáticos' },
  { name: 'transfusionales', label: 'Transfusionales' },
  { name: 'transplantes', label: 'Trasplantes' },
  { name: 'alergicos', label: 'Alérgicos' },
  { name: 'infectocontagiosos', label: 'Enfermedades Infecciosas' },
  { name: 'toxicomanias', label: 'Toxicomanías' },
  { name: 'covid_19', label: 'COVID-19' },
  { name: 'psicologia_psiquiatria', label: 'Psicología / Psiquiatría' },
  { name: 'gyo', label: 'Gineco-Obstétricos (GYO)' },
  { name: 'enfermedades_congenitas', label: 'Enfermedades Congénitas' },
  { name: 'enfermedades_infancia', label: 'Enfermedades de Infancia' },
]

export default function AntecedentesPatologicosStep() {
  const { register } = useFormContext()

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar required>
        Antecedentes Patológicos
      </Heading>

      <Grid cols={3} gap={4} mobileCols={2}>
        {CAMPOS.map(({ name, label }) => (
          <FormRow key={name} htmlFor={name} label={label}>
            <Input
              {...register(`antecedentes_patologicos.${name}`)}
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
