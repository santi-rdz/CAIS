import BirthdayField from '@ui/BirthdayField'
import DomainEmailInput from '@ui/DomainEmailInput'
import PhoneField from '@ui/PhoneField'
import FormRow from '@components/FormRow'
import Heading from '@components/Heading'
import Input from '@components/Input'
import Row from '@components/Row'
import { useFormContext } from 'react-hook-form'

export default function CoordPersonalInfoForm({
  disabledEmail,
  isUabcDomain,
  setIsUabcDomain,
}) {
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
        <FormRow htmlFor="apellidos" label="Apellidos" className="w-full">
          <Input
            {...register('apellidos')}
            id="apellidos"
            type="text"
            placeholder="Ej. Perez Lopez"
            hasError={errors?.apellidos?.message}
            variant="outline"
          />
        </FormRow>
      </Row>

      <Row className="gap-4">
        {disabledEmail ? (
          <FormRow
            htmlFor="correo"
            label="Correo electrónico"
            className="w-full"
          >
            <Input
              {...register('correo')}
              id="correo"
              type="email"
              disabled
              variant="outline"
            />
          </FormRow>
        ) : (
          <DomainEmailInput
            id="correo"
            isDomain={isUabcDomain}
            setIsDomain={setIsUabcDomain}
            fieldName="correo"
            register={register}
            error={errors?.correo?.message}
            className="w-full"
          />
        )}
      </Row>

      <Row className="gap-4">
        <BirthdayField control={control} errors={errors} />
        <PhoneField />
      </Row>

      <Row className="gap-4">
        <FormRow htmlFor="cedula" label="Cédula Profesional" className="w-full">
          <Input
            {...register('cedula')}
            id="cedula"
            type="text"
            placeholder="Ej. 1234567"
            hasError={errors?.cedula?.message}
            variant="outline"
          />
        </FormRow>
      </Row>
    </div>
  )
}
