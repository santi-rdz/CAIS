import Button from '@ui/components/Button'
import Modal from '@ui/components/Modal'
import {
  HiChevronRight,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2'
import { Link } from 'react-router'

export default function ActionBar({ emergencyDate, isDeleting }) {
  return (
    <div className="flex items-center justify-between">
      <nav className="text-5 flex items-center gap-1.5 text-zinc-400">
        <Link
          to="/emergencias"
          className="transition-colors hover:text-zinc-700"
        >
          Bitácora
        </Link>
        <HiChevronRight size={14} />
        <span className="font-medium text-zinc-700">{emergencyDate}</span>
      </nav>
      <div className="flex gap-2">
        <Modal.Open opens="edit-emergency">
          <Button variant="secondary" size="md" className="gap-1.5">
            <HiOutlinePencilSquare size={14} />
            Editar
          </Button>
        </Modal.Open>
        <Modal.Open opens="delete-emergency">
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
