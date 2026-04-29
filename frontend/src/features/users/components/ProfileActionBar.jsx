import { HiOutlinePencilSquare } from 'react-icons/hi2'
import Button from '@components/Button'
import Heading from '@components/Heading'
import Modal from '@components/Modal'

export default function ProfileActionBar() {
  return (
    <div className="flex items-center justify-between">
      <Heading as="h1">Mi Perfil</Heading>
      <Modal.Open opens="edit-profile">
        <Button variant="secondary" size="md" className="gap-1.5">
          <HiOutlinePencilSquare size={14} />
          Editar mi información
        </Button>
      </Modal.Open>
    </div>
  )
}
