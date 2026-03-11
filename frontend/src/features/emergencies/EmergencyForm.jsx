import BirthdayField from '@ui/BirthdayField'
import Checkbox from '@ui/Checkbox'
import FormRow from '@ui/FormRow'
import Heading from '@ui/Heading'
import Input from '@ui/Input'
import ModalActions from '@ui/ModalActions'
import ModalHeading, { ModalDescription, ModalTitle } from '@ui/ModalHeading'
import PhoneField from '@ui/PhoneField'
import Row from '@ui/Row'
import TimeField from '@ui/TimeField'
import dayjs from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import { useCreateEmergency } from './useCreateEmergency'

export default function EmergencyForm({ onCloseModal }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { createEmergency, isCreating } = useCreateEmergency()

  function onSubmit(data) {
    createEmergency(
      {
        fecha_hora: dayjs(data.birthday)
          .hour(data.hora.hour())
          .minute(data.hora.minute())
          .second(0)
          .format(),
        ubicacion: data.ubicacion,
        recurrente: data.recurrente ?? false,
        nombre: data.name || undefined,
        matricula: data.matricula || undefined,
        telefono: data.phone || undefined,
        diagnostico: data.diagnostico || undefined,
        accion_realizada: data.accion || undefined,
      },
      { onSuccess: onCloseModal }
    )
  }

  return (
    <section>
      <ModalHeading>
        <ModalTitle>Registrar Emergencia</ModalTitle>
        <ModalDescription>
          Completa la información de la emergencia médica
        </ModalDescription>
      </ModalHeading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-[500px] space-y-8 overflow-y-auto px-8 py-4">
          <RequiredSection
            register={register}
            control={control}
            errors={errors}
          />
          <PatientSection
            register={register}
            control={control}
            errors={errors}
          />
          <MedicalSection register={register} errors={errors} />
        </div>
        <ModalActions
          onClose={onCloseModal}
          primaryAction={{ label: 'Registrar emergencia', isCreating }}
        />
      </form>
    </section>
  )
}

function RequiredSection({ register, control, errors }) {
  return (
    <section className="space-y-4">
      <Heading as="h4" showBar required>
        Información requerida
      </Heading>
      <Row className="gap-4">
        <BirthdayField birthdate={false} control={control} errors={errors} />
        <TimeField control={control} errors={errors} />
      </Row>
      <FormRow htmlFor="ubicacion" label="Ubicación de la emergencia">
        <Input
          {...register('ubicacion', {
            required: 'Ingresa la ubicación de la emergencia',
          })}
          id="ubicacion"
          type="text"
          placeholder="Ej. Laboratorio de Química"
          hasError={errors?.ubicacion?.message}
          variant="outline"
        />
      </FormRow>
    </section>
  )
}

function PatientSection({ register, control, errors }) {
  return (
    <section className="space-y-4">
      <Heading as="h4" showBar>
        Información del paciente (opcional)
      </Heading>
      <Row className="gap-4">
        <FormRow htmlFor="name" label="Nombre" className="w-full">
          <Input
            {...register('name')}
            id="name"
            type="text"
            placeholder="Ej. Juan Perez"
            hasError={errors?.name?.message}
            variant="outline"
          />
        </FormRow>
        <FormRow htmlFor="matricula" label="Matrícula" className="w-full">
          <Input
            {...register('matricula')}
            id="matricula"
            type="text"
            placeholder="Ej. 12345678"
            hasError={errors?.matricula?.message}
            variant="outline"
          />
        </FormRow>
      </Row>
      <PhoneField required={false} register={register} errors={errors} />
      <Controller
        name="recurrente"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <Checkbox
            id="recurrente"
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            label="Es recurrente"
          />
        )}
      />
    </section>
  )
}

function MedicalSection({ register, errors }) {
  return (
    <section className="space-y-4">
      <Heading as="h4" showBar>
        Información médica (opcional)
      </Heading>
      <FormRow htmlFor="diagnostico" label="Diagnóstico">
        <Input
          {...register('diagnostico')}
          id="diagnostico"
          placeholder="Ej. Fractura de brazo"
          hasError={errors?.diagnostico?.message}
          variant="outline"
          textarea
        />
      </FormRow>
      <FormRow htmlFor="accion" label="Acción realizada">
        <Input
          {...register('accion')}
          id="accion"
          placeholder="Ej. Se trasladó al hospital"
          hasError={errors?.accion?.message}
          variant="outline"
          textarea
        />
      </FormRow>
    </section>
  )
}
