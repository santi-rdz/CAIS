import BirthdayField from '@ui/BirthdayField'
import Checkbox from '@components/Checkbox'
import FormRow from '@components/FormRow'
import Heading from '@components/Heading'
import Input from '@components/Input'
import ModalActions from '@components/ModalActions'
import PhoneField from '@ui/PhoneField'
import Row from '@components/Row'
import TimeField from '@ui/TimeField'
import { mergeFechaHora } from '@lib/dateHelpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useCreateEmergency } from './hooks/useCreateEmergency'
import { useUpdateEmergency } from './hooks/useUpdateEmergency'
import { emergencyFormSchema } from '@cais/shared/schemas/medicina/emergency'
import dayjs from 'dayjs'
import Modal from '@components/Modal'

export default function EmergencyForm({ onCloseModal, emergency }) {
  const isEditing = Boolean(emergency)

  const methods = useForm({
    resolver: zodResolver(emergencyFormSchema),
    defaultValues: isEditing
      ? {
          fecha: dayjs(emergency.fecha_hora),
          hora: dayjs(emergency.fecha_hora),
          ubicacion: emergency.ubicacion ?? '',
          nombre: emergency.nombre ?? '',
          matricula: emergency.matricula ?? '',
          telefono: emergency.telefono ?? '',
          recurrente: emergency.recurrente ?? false,
          diagnostico: emergency.diagnostico ?? '',
          accion_realizada: emergency.accion_realizada ?? '',
        }
      : undefined,
  })

  const { createEmergency, isCreating } = useCreateEmergency()
  const { updateEmergency, isUpdating } = useUpdateEmergency()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = methods

  function onSubmit(data) {
    const payload = {
      fecha_hora: mergeFechaHora(data.fecha, data.hora),
      ubicacion: data.ubicacion,
      recurrente: data.recurrente ?? false,
      nombre: data.nombre || undefined,
      matricula: data.matricula || undefined,
      telefono: data.telefono || undefined,
      diagnostico: data.diagnostico || undefined,
      accion_realizada: data.accion_realizada || undefined,
    }

    if (isEditing) {
      updateEmergency(payload, { onSuccess: onCloseModal })
    } else {
      createEmergency(payload, { onSuccess: onCloseModal })
    }
  }

  return (
    <section>
      <Modal.Heading>
        <Modal.Title>
          {isEditing ? 'Editar Emergencia' : 'Registrar Emergencia'}
        </Modal.Title>
        <Modal.Description>
          {isEditing
            ? 'Modifica la información de la emergencia médica'
            : 'Completa la información de la emergencia médica'}
        </Modal.Description>
      </Modal.Heading>

      <FormProvider {...methods}>
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
            primaryAction={{
              label: isEditing ? 'Guardar cambios' : 'Registrar emergencia',
              isLoading: isEditing ? isUpdating : isCreating,
              disabled: isEditing ? isUpdating : isCreating,
              type: 'submit',
            }}
          />
        </form>
      </FormProvider>
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
        <BirthdayField
          birthdate={false}
          name="fecha"
          control={control}
          errors={errors}
        />
        <TimeField control={control} errors={errors} />
      </Row>
      <FormRow htmlFor="ubicacion" label="Ubicación de la emergencia">
        <Input
          {...register('ubicacion')}
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
        <FormRow htmlFor="nombre" label="Nombre" className="w-full">
          <Input
            {...register('nombre')}
            id="nombre"
            type="text"
            placeholder="Ej. Juan Perez"
            hasError={errors?.nombre?.message}
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
      <PhoneField required={false} />
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
      <FormRow htmlFor="accion_realizada" label="Acción realizada">
        <Input
          {...register('accion_realizada')}
          id="accion_realizada"
          placeholder="Ej. Se trasladó al hospital"
          hasError={errors?.accion_realizada?.message}
          variant="outline"
          textarea
        />
      </FormRow>
    </section>
  )
}
