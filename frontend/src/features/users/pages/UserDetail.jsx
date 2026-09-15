import Modal from '@components/Modal'
import Tab from '@components/Tab'
import { useUser } from '@features/users/hooks/useUser'
import usePermissions from '@hooks/usePermissions'
import { canEditUserAccount } from '@lib/permissions'
import UserActionBar from '@features/users/components/UserActionBar'
import UserHeader from '@features/users/components/UserHeader'
import UserInfoPanel from '@features/users/components/UserInfoPanel'
import ActivityPanel from '@features/users/components/ActivityPanel'
import UserSkeleton from '@features/users/components/UserSkeleton'
import InternForm from '@features/users/InternForm'
import CoordForm from '@features/users/CoordForm'
import AdminForm from '@features/users/AdminForm'

const EDIT_FORMS = { pasante: InternForm, coordinador: CoordForm, admin: AdminForm }

export default function UserDetail() {
  const { user, isPending } = useUser()
  const { user: currentUser } = usePermissions()

  if (isPending) return <UserSkeleton />
  if (!user) return null

  const viewedRole = user.rol?.toLowerCase()
  const EditForm = EDIT_FORMS[viewedRole]
  const canEdit = Boolean(EditForm) && canEditUserAccount(currentUser, user)

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
              <ActivityPanel userId={user.id} area={user.area} />
            </Tab.Panel>
          </div>
        </Tab>
      </div>

      {canEdit && (
        <Modal.Content name="edit-user" size="md" noPadding>
          <EditForm user={user} />
        </Modal.Content>
      )}
    </Modal>
  )
}
