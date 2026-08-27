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
import useResendInvitation from '@features/users/hooks/useResendInvitation'
import useDeleteInvitation from '@features/users/hooks/useDeleteInvitation'
import useDeleteUser from '@features/users/hooks/useDeleteUser'
import useToggleUserEstado from '@features/users/hooks/useToggleUserEstado'
import usePermissions from '@hooks/usePermissions'
import Can from '@components/Can'
import { PERMISSIONS, canManageUserAccount } from '@lib/permissions'
import DateTime from '@components/DateTime'
import PersonCell from '@components/PersonCell'
import { useNavigate } from 'react-router-dom'

export default function UserRow({ user }) {
  const {
    nombre,
    apellidos,
    rol: roleUp,
    ultimo_acceso: lastLogin,
    correo: email,
    estado: statusUp,
    foto: picture,
    area,
    id,
  } = user

  const fullName = [nombre, apellidos].filter(Boolean).join(' ')

  const { user: me } = usePermissions()
  const userId = me?.id

  const status = statusUp?.toLowerCase() ?? ''
  const role = roleUp?.toLowerCase() ?? ''
  const isPending = status === 'pendiente'

  const { resendInvitation, isResending } = useResendInvitation()
  const { deleteInvitation, isDeleting: isDeletingInvitation } = useDeleteInvitation()
  const { deleteUser, isDeleting: isDeletingUser } = useDeleteUser()
  const { toggleEstado, isPending: isTogglingEstado } = useToggleUserEstado()

  const isInactive = status === 'inactivo'
  const nextEstado = isInactive ? 'ACTIVO' : 'INACTIVO'
  const navigate = useNavigate()
  const isCurrentUser = userId === id
  const showedName = isCurrentUser ? `Tú` : fullName
  const canManage = canManageUserAccount(me, user)

  return (
    <Table.Row
      isCurrentUser={isCurrentUser}
      onClick={!isPending ? () => navigate(`/usuarios/${id}`) : undefined}
      data-testid={`user-row-${id}`}
    >
      <PersonCell
        name={showedName}
        secondary={email}
        avatar={<PersonCell.UserAvatar picture={picture} email={email} />}
      />
      <div className="font-medium text-zinc-700 capitalize">{role}</div>
      <Can permission={PERMISSIONS.SEE_USER_AREA_COLUMN}>
        <div className="text-zinc-700 capitalize">{area?.toLowerCase() ?? '—'}</div>
      </Can>
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
              className="w-full justify-start text-nowrap"
              onClick={(e) => {
                e.stopPropagation()
                resendInvitation(email)
              }}
              disabled={isResending}
            >
              <HiPaperAirplane size={16} />
              Reenviar invitación
            </Button>
            <Modal.Open opens="delete-invitation">
              <Button
                variant="ghost"
                size="md"
                className="w-full justify-start text-nowrap text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={(e) => e.stopPropagation()}
              >
                <HiOutlineTrash size={16} />
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
      ) : canManage ? (
        <Modal>
          <RowActionsMenu data-testid={`row-menu-${email}`}>
            <Modal.Open opens="toggle-estado">
              <Button
                variant="ghost"
                size="md"
                className={`w-full justify-start text-nowrap ${
                  !isInactive ? 'text-red-600 hover:bg-red-50 hover:text-red-700' : ''
                }`}
                onClick={(e) => e.stopPropagation()}
                data-testid="toggle-estado-btn"
              >
                {isInactive ? <HiLockOpen size={16} /> : <HiLockClosed size={16} />}
                {isInactive ? 'Activar usuario' : 'Desactivar usuario'}
              </Button>
            </Modal.Open>
            <Modal.Open opens="delete-user">
              <Button
                variant="ghost"
                size="md"
                className="w-full justify-start text-nowrap text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={(e) => e.stopPropagation()}
                data-testid="delete-user-btn"
              >
                <HiOutlineTrash size={16} />
                Eliminar usuario
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

          <Modal.Content
            name="delete-user"
            noPadding
            variant="alert"
            icon={<HiOutlineTrash size={26} />}
          >
            <DangerConfirm
              title="Eliminar usuario"
              description={
                <>
                  ¿Estás seguro de borrar a <span className="font-medium">{fullName}</span>?
                </>
              }
              confirmLabel="Eliminar"
              onConfirm={() => deleteUser(id)}
              isPending={isDeletingUser}
            />
          </Modal.Content>
        </Modal>
      ) : (
        <div />
      )}
    </Table.Row>
  )
}
