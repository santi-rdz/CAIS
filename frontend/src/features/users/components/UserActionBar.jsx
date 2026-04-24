import { Link } from 'react-router'
import { HiChevronRight, HiOutlinePencilSquare } from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'

export default function UserActionBar({ userName, canEdit }) {
  return (
    <div className="flex items-center justify-between">
      <nav className="text-5 flex items-center gap-1.5 text-zinc-400">
        <Link to="/usuarios" className="transition-colors hover:text-zinc-700">
          Usuarios
        </Link>
        <HiChevronRight size={14} />
        <span className="font-medium text-zinc-700">{userName}</span>
      </nav>
      {canEdit && (
        <Modal.Open opens="edit-user">
          <Button variant="secondary" size="md" className="gap-1.5">
            <HiOutlinePencilSquare size={14} />
            Editar usuario
          </Button>
        </Modal.Open>
      )}
    </div>
  )
}
