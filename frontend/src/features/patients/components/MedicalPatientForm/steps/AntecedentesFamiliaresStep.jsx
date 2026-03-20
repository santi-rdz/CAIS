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
        <FormRow htmlFor="af_padre" label="Padre" className="w-full">
          <Input
            {...register('af_padre')}
            id="af_padre"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones del padre"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow htmlFor="af_madre" label="Madre" className="w-full">
          <Input
            {...register('af_madre')}
            id="af_madre"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones de la madre"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Row>

      <Row className="gap-4">
        <FormRow
          htmlFor="af_abueloPaterno"
          label="Abuelo Paterno"
          className="w-full"
        >
          <Input
            {...register('af_abueloPaterno')}
            id="af_abueloPaterno"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow
          htmlFor="af_abuelaPaterna"
          label="Abuela Paterna"
          className="w-full"
        >
          <Input
            {...register('af_abuelaPaterna')}
            id="af_abuelaPaterna"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Row>

      <Row className="gap-4">
        <FormRow
          htmlFor="af_abueloMaterno"
          label="Abuelo Materno"
          className="w-full"
        >
          <Input
            {...register('af_abueloMaterno')}
            id="af_abueloMaterno"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones"
            variant="outline"
            size="md"
          />
        </FormRow>
        <FormRow
          htmlFor="af_abuelaMaterna"
          label="Abuela Materna"
          className="w-full"
        >
          <Input
            {...register('af_abuelaMaterna')}
            id="af_abuelaMaterna"
            textarea
            rows={3}
            placeholder="Enfermedades o condiciones"
            variant="outline"
            size="md"
          />
        </FormRow>
      </Row>

      <FormRow htmlFor="af_otros" label="Otros familiares">
        <Input
          {...register('af_otros')}
          id="af_otros"
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
