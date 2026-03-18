import Table from '@components/Table'
import Tag from '@components/Tag'
import RowActionsMenu from '@components/RowActionsMenu'
import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import Button from '@components/Button'
import { HiLockClosed, HiOutlineLockClosed } from 'react-icons/hi2'
import useDeleteUser from './hooks/useDeleteUser'
import useUser from './hooks/useUser'
import DateTime from '@components/DateTime'
import PersonCell from '@components/PersonCell'

export default function UserRow({ user }) {
  const {
    nombre: name,
    rol: roleUp,
    ultimo_acceso: lastLogin,
    correo: email,
    estado: statusUp,
    foto: picture,
    id,
  } = user

  const {
    user: { id: userId },
  } = useUser()

  const status = statusUp?.toLowerCase() ?? ''
  const role = roleUp?.toLowerCase() ?? ''

  const { deleteUser, isPending: isDeleting } = useDeleteUser()
  const isCurrentUser = userId === id
  const showedName = isCurrentUser ? `Tú` : name

  return (
    <Table.Row isCurrentUser={isCurrentUser}>
      <PersonCell
        name={showedName}
        secondary={email}
        avatar={<PersonCell.UserAvatar picture={picture} email={email} />}
      />
      <div className="capitalize">{role}</div>
      <DateTime value={lastLogin} />
      <div>
        <Tag type={status}>{status}</Tag>
      </div>

      <Modal variant="alert" icon={<HiOutlineLockClosed size={26} />}>
        <RowActionsMenu>
          <Modal.Open opens="block-user">
            <Button
              variant="ghost"
              size="md"
              className="flex items-center gap-1 text-nowrap"
            >
              <HiLockClosed />
              Bloquear usuario
            </Button>
          </Modal.Open>
        </RowActionsMenu>

        <Modal.Content name="block-user" noPadding>
          <DangerConfirm
            title="Bloquear usuario"
            description="¿Estás seguro de bloquear a este usuario?"
            confirmLabel="Bloquear"
            onConfirm={() => deleteUser(id)}
            isPending={isDeleting}
          />
        </Modal.Content>
      </Modal>
    </Table.Row>
  )
}
