import Table from '@components/Table'
import Tag from '@components/Tag'
import RowActionsMenu from '@components/RowActionsMenu'
import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import Button from '@components/Button'
import {
  HiLockClosed,
  HiOutlineLockClosed,
  HiPaperAirplane,
  HiOutlineTrash,
  HiLockOpen,
} from 'react-icons/hi2'
import useResendInvitation from './hooks/useResendInvitation'
import useDeleteInvitation from './hooks/useDeleteInvitation'
import useToggleUserEstado from './hooks/useToggleUserEstado'
import useMe from './hooks/useMe'
import DateTime from '@components/DateTime'
import PersonCell from '@components/PersonCell'
import { useNavigate } from 'react-router'
import { HiArrowRight } from 'react-icons/hi2'

export default function UserRow({ user }) {
  const {
    nombre,
    apellidos,
    rol: roleUp,
    ultimo_acceso: lastLogin,
    correo: email,
    estado: statusUp,
    foto: picture,
    id,
  } = user

  const fullName = [nombre, apellidos].filter(Boolean).join(' ')

  const {
    user: { id: userId },
  } = useMe()

  const status = statusUp?.toLowerCase() ?? ''
  const role = roleUp?.toLowerCase() ?? ''
  const isPending = status === 'pendiente'

  const { resendInvitation, isResending } = useResendInvitation()
  const { deleteInvitation, isDeleting: isDeletingInvitation } =
    useDeleteInvitation()
  const { toggleEstado, isPending: isTogglingEstado } = useToggleUserEstado()

  const isInactive = status === 'inactivo'
  const nextEstado = isInactive ? 'ACTIVO' : 'INACTIVO'
  const navigate = useNavigate()
  const isCurrentUser = userId === id
  const showedName = isCurrentUser ? `Tú` : fullName

  return (
    <Table.Row
      isCurrentUser={isCurrentUser}
      onClick={!isPending ? () => navigate(`/usuarios/${id}`) : undefined}
    >
      {!isPending && (
        <>
          <span className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-blue-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-y-0 right-16 flex translate-x-2 items-center opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
            <span className="text-6 flex items-center gap-1.5 rounded-full bg-blue-800 px-3 py-1.5 font-medium text-white shadow-sm">
              Ver detalles
              <span className="animate-nudge-x">
                <HiArrowRight size={11} />
              </span>
            </span>
          </span>
        </>
      )}
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

      {isPending ? (
        <Modal>
          <RowActionsMenu>
            <Button
              variant="ghost"
              size="md"
              className="flex items-center gap-1 text-nowrap"
              onClick={() => resendInvitation(email)}
              disabled={isResending}
            >
              <HiPaperAirplane />
              Reenviar invitación
            </Button>
            <Modal.Open opens="delete-invitation">
              <Button
                variant="ghost"
                size="md"
                className="flex w-full items-center gap-1 text-nowrap text-red-600 hover:text-red-700"
              >
                <HiOutlineTrash />
                Eliminar invitación
              </Button>
            </Modal.Open>
          </RowActionsMenu>

          <Modal.Content
            name="delete-invitation"
            noPadding
            variant="alert"
            icon={<HiOutlineTrash size={26} />}
          >
            <DangerConfirm
              title="Eliminar invitación"
              description={
                <>
                  ¿Eliminar la invitación enviada a<br />
                  <span className="font-medium">{email}</span>?<br />
                  El enlace de registro dejará de funcionar.
                </>
              }
              confirmLabel="Eliminar"
              onConfirm={() => deleteInvitation(email)}
              isPending={isDeletingInvitation}
            />
          </Modal.Content>
        </Modal>
      ) : (
        <Modal>
          <RowActionsMenu>
            <Modal.Open opens="toggle-estado">
              <Button
                variant="ghost"
                size="md"
                className="flex w-full items-center gap-1 text-nowrap"
              >
                {isInactive ? <HiLockOpen /> : <HiLockClosed />}
                {isInactive ? 'Activar usuario' : 'Desactivar usuario'}
              </Button>
            </Modal.Open>
          </RowActionsMenu>

          <Modal.Content
            name="toggle-estado"
            noPadding
            variant="alert"
            icon={<HiOutlineLockClosed size={26} />}
          >
            <DangerConfirm
              title={isInactive ? 'Activar usuario' : 'Desactivar usuario'}
              description={
                isInactive
                  ? '¿Activar este usuario? Volverá a tener acceso a la plataforma.'
                  : '¿Desactivar este usuario? Perderá el acceso a la plataforma.'
              }
              confirmLabel={isInactive ? 'Activar' : 'Desactivar'}
              confirmVariant={isInactive ? 'primary' : 'danger'}
              onConfirm={() => toggleEstado({ id, estado: nextEstado })}
              isPending={isTogglingEstado}
            />
          </Modal.Content>
        </Modal>
      )}
    </Table.Row>
  )
}
