import Table from '@components/Table'
import Tag from '@components/Tag'
import RowActionsMenu from '@components/RowActionsMenu'
import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import Button from '@components/Button'
import { HiLockClosed, HiOutlineLockClosed } from 'react-icons/hi2'
import useDeleteUser from './hooks/useDeleteUser'
import useMe from './hooks/useMe'
import DateTime from '@components/DateTime'
import PersonCell from '@components/PersonCell'
import { useNavigate } from 'react-router'
import { HiArrowRight } from 'react-icons/hi2'

export default function UserRow({ user }) {
  const {
    nombre,
    apellido,
    rol: roleUp,
    ultimo_acceso: lastLogin,
    correo: email,
    estado: statusUp,
    foto: picture,
    id,
  } = user

  const fullName = [nombre, apellido].filter(Boolean).join(' ')

  const {
    user: { id: userId },
  } = useMe()

  const status = statusUp?.toLowerCase() ?? ''
  const role = roleUp?.toLowerCase() ?? ''

  const { deleteUser, isPending: isDeleting } = useDeleteUser()
  const navigate = useNavigate()
  const isCurrentUser = userId === id
  const showedName = isCurrentUser ? `Tú` : fullName

  return (
    <Table.Row
      isCurrentUser={isCurrentUser}
      onClick={() => navigate(`/usuarios/${id}`)}
    >
      <span className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-blue-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-y-0 right-16 flex translate-x-2 items-center opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        <span className="text-6 flex items-center gap-1.5 rounded-full bg-blue-800 px-3 py-1.5 font-medium text-white shadow-sm">
          Ver detalles
          <span className="animate-nudge-x">
            <HiArrowRight size={11} />
          </span>
        </span>
      </span>
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

      <Modal>
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

        <Modal.Content
          name="block-user"
          noPadding
          variant="alert"
          icon={<HiOutlineLockClosed size={26} />}
        >
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
