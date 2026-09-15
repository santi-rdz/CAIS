import Tab from '@components/Tab'
import InternForm from '@features/users/InternForm'
import CoordForm from '@features/users/CoordForm'
import AdminForm from '@features/users/AdminForm'
import usePermissions from '@hooks/usePermissions'

export default function UserForm({ onClose }) {
  const { isAdmin } = usePermissions()

  return (
    <Tab defaultTab="pasante" variant="secondary">
      <Tab.List className="mx-(--mpx)">
        <Tab.Trigger value="pasante">Pasante</Tab.Trigger>
        <Tab.Trigger value="coordinador">Coordinador</Tab.Trigger>
        {isAdmin && <Tab.Trigger value="admin">Admin</Tab.Trigger>}
      </Tab.List>

      <Tab.Panel value="pasante" scrollable={false}>
        <InternForm onClose={onClose} />
      </Tab.Panel>
      <Tab.Panel value="coordinador" scrollable={false}>
        <CoordForm onClose={onClose} />
      </Tab.Panel>
      {isAdmin && (
        <Tab.Panel value="admin" scrollable={false}>
          <AdminForm onClose={onClose} />
        </Tab.Panel>
      )}
    </Tab>
  )
}
