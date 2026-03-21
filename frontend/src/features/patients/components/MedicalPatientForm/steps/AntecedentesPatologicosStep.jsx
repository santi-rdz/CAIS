import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Grid from '@components/Grid'

const CAMPOS = [
  { name: 'ap_cronicoDegenerativos', label: 'Crónico-Degenerativos' },
  { name: 'ap_quirurgicos', label: 'Quirúrgicos' },
  { name: 'ap_hospitalizaciones', label: 'Hospitalizaciones' },
  { name: 'ap_traumaticos', label: 'Traumáticos' },
  { name: 'ap_transfusionales', label: 'Transfusionales' },
  { name: 'ap_transplantes', label: 'Trasplantes' },
  { name: 'ap_alergicos', label: 'Alérgicos' },
  { name: 'ap_infectocontagiosos', label: 'Enfermedades Infecciosas' },
  { name: 'ap_toxicomanias', label: 'Toxicomanías' },
  { name: 'ap_covid19', label: 'COVID-19' },
  { name: 'ap_psicologiaPsiquiatria', label: 'Psicología / Psiquiatría' },
  { name: 'ap_gyo', label: 'Gineco-Obstétricos (GYO)' },
  { name: 'ap_enfermedadesCongenitas', label: 'Enfermedades Congénitas' },
  { name: 'ap_enfermedadesInfancia', label: 'Enfermedades de Infancia' },
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
              {...register(name)}
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
