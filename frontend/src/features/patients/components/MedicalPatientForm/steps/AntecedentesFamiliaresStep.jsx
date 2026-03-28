import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Row from '@components/Row'

export default function AntecedentesFamiliaresStep() {
  const { register } = useFormContext()

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar required>
        Antecedentes Heredofamiliares
      </Heading>

      <Row className="gap-4">
        <FormRow htmlFor="padre" label="Padre" className="w-full">
          <Input
            {...register('padre')}
            id="padre"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones del padre"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow htmlFor="madre" label="Madre" className="w-full">
          <Input
            {...register('madre')}
            id="madre"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones de la madre"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Row>

      <Row className="gap-4">
        <FormRow htmlFor="abuelo_paterno" label="Abuelo Paterno" className="w-full">
          <Input
            {...register('abuelo_paterno')}
            id="abuelo_paterno"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow htmlFor="abuela_paterna" label="Abuela Paterna" className="w-full">
          <Input
            {...register('abuela_paterna')}
            id="abuela_paterna"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Row>

      <Row className="gap-4">
        <FormRow htmlFor="abuelo_materno" label="Abuelo Materno" className="w-full">
          <Input
            {...register('abuelo_materno')}
            id="abuelo_materno"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow htmlFor="abuela_materna" label="Abuela Materna" className="w-full">
          <Input
            {...register('abuela_materna')}
            id="abuela_materna"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Row>

      <FormRow htmlFor="otros" label="Otros familiares">
        <Input
          {...register('otros')}
          id="otros"
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
