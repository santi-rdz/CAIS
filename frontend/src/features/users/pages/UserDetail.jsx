import Modal from '@components/Modal'
import Tab from '@components/Tab'
import { useUser } from '@features/users/hooks/useUser'
import useMe from '@features/users/hooks/useMe'
import UserActionBar from '@features/users/components/UserActionBar'
import UserHeader from '@features/users/components/UserHeader'
import UserInfoPanel from '@features/users/components/UserInfoPanel'
import ActivityPanel from '@features/users/components/ActivityPanel'
import UserSkeleton from '@features/users/components/UserSkeleton'
import InternForm from '@features/users/InternForm'

export default function UserDetail() {
  const { user, isPending } = useUser()
  const { user: me } = useMe()

  if (isPending) return <UserSkeleton />
  if (!user) return null

  const viewedRole = user.rol?.toLowerCase()
  const myRole = me?.rol?.toLowerCase()
  const canEdit = myRole === 'coordinador' && viewedRole === 'pasante'

  return (
    <Modal>
      <div className="space-y-5">
        <UserActionBar
          userName={[user.nombre, user.apellidos].filter(Boolean).join(' ')}
          canEdit={canEdit}
        />
        <Tab defaultTab="info" syncUrl>
          <UserHeader user={user} />
          <div className="mt-4 space-y-4">
            <Tab.Panel value="info" scrollable={false}>
              <UserInfoPanel user={user} />
            </Tab.Panel>
            <Tab.Panel value="actividad" scrollable={false}>
              <ActivityPanel userId={user.id} />
            </Tab.Panel>
          </div>
        </Tab>
      </div>

      {canEdit && (
        <Modal.Content name="edit-user" size="md" noPadding>
          <InternForm user={user} />
        </Modal.Content>
      )}
    </Modal>
  )
}
