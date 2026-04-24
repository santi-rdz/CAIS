import Button from './Button'
import Modal from './Modal'

export default function DangerConfirm({
  onCloseModal,
  onConfirm,
  confirmLabel = 'Eliminar',
  confirmVariant = 'danger',
  isPending = false,
  title,
  description,
}) {
  return (
    <>
      <Modal.Heading>
        <Modal.Title>{title}</Modal.Title>
        <Modal.Description>{description}</Modal.Description>
      </Modal.Heading>
      <div className="flex justify-center gap-2 p-8 pt-0">
        <Button variant="secondary" onClick={onCloseModal} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          variant={confirmVariant}
          onClick={() => {
            onConfirm()
            onCloseModal()
          }}
          disabled={isPending}
        >
          {confirmLabel}
        </Button>
      </div>
    </>
  )
}
