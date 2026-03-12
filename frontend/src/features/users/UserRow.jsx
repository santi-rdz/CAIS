import Table from '@ui/Table'
import Tag from '@ui/Tag'
import RowActionsMenu from '@ui/RowActionsMenu'
import Modal from '@ui/Modal'
import DangerConfirm from '@ui/DangerConfirm'
import Button from '@ui/Button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { HiLockClosed, HiOutlineLockClosed } from 'react-icons/hi2'
import useDeleteUser from './useDeleteUser'
import useUser from './useUser'

export default function UserRow({ user, openMenu, setOpenMenu }) {
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
  const isMenuOpen = openMenu === id
  const hasPicture = Boolean(picture)
  const isCurrentUser = userId === id
  const showedName = isCurrentUser ? `Tú` : name

  function handleClick() {
    setOpenMenu(isMenuOpen ? null : id)
  }

  return (
    <Table.Row isCurrentUser={isCurrentUser}>
      <UserPicture>
        {hasPicture ? (
          <img src={picture} className="size-full" />
        ) : (
          <div className="flex size-full items-center justify-center text-base uppercase">
            {email?.at(0)}
          </div>
        )}
      </UserPicture>
      <div>
        <Stacked>
          <span>{showedName ?? '---'}</span>
          <span className="font-normal text-neutral-500">{email}</span>
        </Stacked>
      </div>
      <div className="capitalize">{role}</div>
      <div>
        {lastLogin ? format(lastLogin, 'dd MMM yyyy', { locale: es }) : '---'}
      </div>
      <div>
        <Tag type={status}>{status}</Tag>
      </div>

      <Modal variant="alert" icon={<HiOutlineLockClosed size={26} />}>
        <RowActionsMenu
          isOpen={isMenuOpen}
          onToggle={handleClick}
          onClose={() => setOpenMenu(null)}
        >
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

function Stacked({ children }) {
  return <div className="flex flex-col gap-1">{children}</div>
}

function UserPicture({ children }) {
  return (
    <div
      alt="User Picture"
      className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 object-cover"
    >
      {children}
    </div>
  )
}
