import { HiArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'

export default function PatientActionBar({ onBack, isDeleting }) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
        <HiArrowLeft size={14} />
        Pacientes
      </Button>
      <div className="flex gap-2">
        <Modal.Open opens="edit-patient">
          <Button variant="secondary" size="md" className="gap-1.5">
            <HiOutlinePencilSquare size={14} />
            Editar
          </Button>
        </Modal.Open>
        <Modal.Open opens="delete-patient">
          <Button
            variant="danger-o"
            size="md"
            className="gap-1.5 text-red-600"
            isLoading={isDeleting}
          >
            <HiOutlineTrash size={14} />
            Eliminar
          </Button>
        </Modal.Open>
      </div>
    </div>
  )
}
