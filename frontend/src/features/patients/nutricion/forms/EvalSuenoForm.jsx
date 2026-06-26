import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { evalSuenoFormSchema } from '@schemas/evalMonitoreo'
import Modal from '@components/Modal'
import ModalBody from '@components/ModalBody'
import ModalActions from '@components/ModalActions'
import SuenoFormFields from '@features/patients/nutricion/forms/SuenoFormFields'
import {
  SUENO_ROW_KEYS,
  buildMonitoringRow,
} from '@features/patients/nutricion/forms/monitoreoRows'
import { useEvalMonitoreo } from '@features/patients/nutricion/hooks/useEvalMonitoreo'

export default function EvalSuenoForm({ historiaId, eval: evalRow, title, onCloseModal }) {
  const isEdit = !!evalRow
  const { saveSueno, isSavingSueno } = useEvalMonitoreo(historiaId)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(evalSuenoFormSchema),
    defaultValues: buildMonitoringRow(SUENO_ROW_KEYS, evalRow),
  })

  async function onSubmit(data) {
    await saveSueno({ formData: data, editId: evalRow?.id ?? null })
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
        <SuenoFormFields control={control} register={register} errors={errors} />
      </ModalBody>
      <ModalActions
        onClose={onCloseModal}
        primaryAction={{
          label: isEdit ? 'Guardar cambios' : 'Registrar',
          type: 'submit',
          isLoading: isSavingSueno,
        }}
      />
    </form>
  )
}
