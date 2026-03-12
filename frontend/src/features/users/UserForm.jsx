import Tab from '@ui/Tab'
import InternForm from './InternForm'
import CoordForm from './CoordForm'

export default function UserForm({ onClose }) {
  return (
    <Tab defaultTab="pasante" variant="secondary">
      <Tab.List className="mx-8">
        <Tab.Trigger value="pasante">Pasante</Tab.Trigger>
        <Tab.Trigger value="coordinador">Coordinador</Tab.Trigger>
      </Tab.List>

      <Tab.Panel value="pasante" scrollable={false}>
        <InternForm onClose={onClose} />
      </Tab.Panel>
      <Tab.Panel value="coordinador" scrollable={false}>
        <CoordForm onClose={onClose} />
      </Tab.Panel>
    </Tab>
  )
}
