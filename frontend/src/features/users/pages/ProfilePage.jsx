import { HiArrowRight } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import Modal from '@components/Modal'
import Tab from '@components/Tab'
import useMe from '@features/users/hooks/useMe'
import { useMyProfile } from '@features/users/hooks/useMyProfile'
import ProfileActionBar from '@features/users/components/ProfileActionBar'
import ProfileHeader from '@features/users/components/ProfileHeader'
import UserInfoPanel from '@features/users/components/UserInfoPanel'
import ActivityPanel from '@features/users/components/ActivityPanel'
import UserSkeleton from '@features/users/components/UserSkeleton'
import ChangePasswordForm from '@features/users/ChangePasswordForm'
import InternForm from '@features/users/InternForm'
import CoordForm from '@features/users/CoordForm'

function ConfigHint({ onGoToConfig }) {
  return (
    <p className="mt-1 text-sm text-zinc-500">
      Para cambiar tu contraseña, ve a la pestaña{' '}
      <button
        type="button"
        onClick={onGoToConfig}
        className="inline-flex items-center gap-0.5 font-medium text-green-700 underline-offset-2 hover:underline"
      >
        Configuración
        <HiArrowRight size={12} />
      </button>
    </p>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user: me } = useMe()
  const { user, isPending } = useMyProfile()

  if (isPending) return <UserSkeleton />
  if (!user) return null

  const EditForm = me?.rol?.toLowerCase() === 'coordinador' ? CoordForm : InternForm

  return (
    <Modal>
      <div className="space-y-5">
        <ProfileActionBar />
        <Tab defaultTab="info" syncUrl>
          <ProfileHeader user={user} />
          <div className="mt-4 space-y-4">
            <Tab.Panel value="info" scrollable={false}>
              <UserInfoPanel user={user} />
            </Tab.Panel>
            <Tab.Panel value="actividad" scrollable={false}>
              <ActivityPanel userId={user.id} />
            </Tab.Panel>
            <Tab.Panel value="configuracion" scrollable={false}>
              <ChangePasswordForm />
            </Tab.Panel>
          </div>
        </Tab>
      </div>

      <Modal.Content name="edit-profile" size="md" noPadding>
        <EditForm
          user={user}
          title="Editar mi perfil"
          hint={(closeModal) => (
            <ConfigHint
              onGoToConfig={() => {
                closeModal()
                navigate('?tab=configuracion', { replace: true })
              }}
            />
          )}
        />
      </Modal.Content>
    </Modal>
  )
}
