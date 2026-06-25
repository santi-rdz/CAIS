import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { evalActFisicaFormSchema } from '@schemas/evalMonitoreo'
import Modal from '@components/Modal'
import ModalBody from '@components/ModalBody'
import ModalActions from '@components/ModalActions'
import ActFisicaFormFields from '@features/patients/nutricion/forms/ActFisicaFormFields'
import {
  ACT_FISICA_ROW_KEYS,
  buildMonitoringRow,
} from '@features/patients/nutricion/forms/monitoreoRows'
import { useEvalMonitoreo } from '@features/patients/nutricion/hooks/useEvalMonitoreo'

export default function EvalActFisicaForm({
  historiaId,
  historia,
  eval: evalRow,
  title,
  onCloseModal,
}) {
  const isEdit = !!evalRow
  const { saveActFisica, isSavingActFisica } = useEvalMonitoreo(historiaId)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(evalActFisicaFormSchema),
    defaultValues: buildMonitoringRow(ACT_FISICA_ROW_KEYS, evalRow),
  })

  async function onSubmit(data) {
    await saveActFisica({
      currentRows: historia.eval_act_fisica_nutricion ?? [],
      formData: data,
      editId: evalRow?.id ?? null,
    })
    onCloseModal?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
      {title && (
        <Modal.Heading>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Heading>
      )}
      <ModalBody>
        <ActFisicaFormFields control={control} register={register} errors={errors} />
      </ModalBody>
      <ModalActions
        onClose={onCloseModal}
        primaryAction={{
          label: isEdit ? 'Guardar cambios' : 'Registrar',
          type: 'submit',
          isLoading: isSavingActFisica,
        }}
      />
    </form>
  )
}
