import Button from './Button'
import Heading from './Heading'
import SpinnerMini from './SpinnerMini'

export default function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal, isDeleting }) {
  return (
    <div className="flex w-[400px] flex-col gap-4">
      <Heading as="h3">Borrar {resourceName}</Heading>

      <p className="mb-4 text-gray-500">
        Estas seguro de borrar este {resourceName} permanentemente? Esta accion no se puede deshacer
      </p>

      <div className="flex justify-end gap-4">
        <Button type="secondary" disabled={disabled} onClick={onCloseModal}>
          Cancelar
        </Button>

        <Button variation="danger" disabled={disabled} onClick={onConfirm}>
          {!isDeleting ? 'Borrar' : <SpinnerMini />}
        </Button>
      </div>
    </div>
  )
}
