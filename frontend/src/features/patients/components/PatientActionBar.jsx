import { Link } from 'react-router'
import {
  HiChevronRight,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'

export default function PatientActionBar({ patientName, isDeleting }) {
  return (
    <div className="flex items-center justify-between">
      <nav className="text-5 flex items-center gap-1.5 text-zinc-400">
        <Link to="/pacientes" className="transition-colors hover:text-zinc-700">
          Pacientes
        </Link>
        <HiChevronRight size={14} />
        <span className="font-medium text-zinc-700">{patientName}</span>
      </nav>
      <div className="flex gap-2">
        <Modal.Open opens="edit-patient">
          <Button variant="secondary" size="md" className="gap-1.5">
            <HiOutlinePencilSquare size={14} />
            Editar paciente
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
