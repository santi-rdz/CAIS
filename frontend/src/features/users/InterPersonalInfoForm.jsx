import BirthdayField from '@ui/BirthdayField'
import PhoneField from '@ui/PhoneField'
import FormRow from '@components/FormRow'
import Heading from '@components/Heading'
import Input from '@components/Input'
import Row from '@components/Row'
import { useFormContext } from 'react-hook-form'

export default function InterPersonalInfoForm() {
  const { register, control, formState } = useFormContext()
  const { errors } = formState

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar required>
        Información Personal
      </Heading>
      <Row className="gap-4">
        <FormRow htmlFor="nombre" label="Nombre(s)" className="w-full">
          <Input
            {...register('nombre')}
            id="nombre"
            type="text"
            placeholder="Ej. Juan Carlos"
            hasError={errors?.nombre?.message}
            variant="outline"
          />
        </FormRow>
        <FormRow htmlFor="apellido" label="Apellidos" className="w-full">
          <Input
            {...register('apellido')}
            id="apellido"
            type="text"
            placeholder="Ej. Perez Lopez"
            hasError={errors?.apellido?.message}
            variant="outline"
          />
        </FormRow>
      </Row>
      <Row className="gap-4">
        <BirthdayField control={control} errors={errors} />
        <PhoneField />
      </Row>
    </div>
  )
}
