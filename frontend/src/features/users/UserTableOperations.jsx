import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@ui/Button'
import Modal from '@ui/Modal'
import SortBy from '@ui/SortBy'
import TableOperations from '@ui/TableOperations'
import UserModal from './UserModal'
import Filter from '@ui/Filter'

const SORT_BY_OPTIONS = [
  { label: 'Nombre (asc)', value: 'nombre-asc' },
  { label: 'Nombre (desc)', value: 'nombre-desc' },
  { label: 'Login (asc)', value: 'login-asc' },
  { label: 'Login (desc)', value: 'login-desc' },
  { label: 'Limpiar', value: 'clear' },
]

export default function UserTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: 'default', label: 'Todos' },
          { value: 'activo', label: 'Activo' },
          { value: 'inactivo', label: 'Inactivo' },
          { value: 'pendiente', label: 'Pendiente' },
        ]}
      />
      <SortBy options={SORT_BY_OPTIONS} />
      <Modal>
        <Modal.Open opens="userModal">
          <Button size="md" className="py-2.5">
            <HiOutlinePlus size="16" strokeWidth="2.5" />
            Agregar usuario
          </Button>
        </Modal.Open>
        <Modal.Content name="userModal">
          <UserModal />
        </Modal.Content>
      </Modal>
    </TableOperations>
  )
}
