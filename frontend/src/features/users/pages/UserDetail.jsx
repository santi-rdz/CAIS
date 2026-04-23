import Modal from '@components/Modal'
import Tab from '@components/Tab'
import { useUser } from '../hooks/useUser'
import useMe from '../hooks/useMe'
import UserActionBar from '../components/UserActionBar'
import UserHeader from '../components/UserHeader'
import UserInfoPanel from '../components/UserInfoPanel'
import ActivityPanel from '../components/ActivityPanel'
import UserSkeleton from '../components/UserSkeleton'
import InternForm from '../InternForm'

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
        <Tab defaultTab="info">
          <UserHeader user={user} />
          <div className="mt-4 space-y-4">
            <Tab.Panel value="info" scrollable={false}>
              <UserInfoPanel user={user} />
            </Tab.Panel>
            <Tab.Panel value="actividad" scrollable={false}>
              <ActivityPanel />
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
