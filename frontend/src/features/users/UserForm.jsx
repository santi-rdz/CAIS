import RoleSelect from '@ui/RoleSelect'

import InternForm from './InternForm'
import CoordForm from './CoordForm'
import Tab from '@ui/Tab'

const options = [
  {
    title: 'Pasante',
    desc: 'Completa la información del pasante',
    label: 'Pasante',
    value: 'pasante',
    component: (onClose) => <InternForm onClose={onClose} />,
  },
  {
    title: 'Coordinador',
    desc: 'Completa la información del coordinador',
    label: 'Coordinador',
    value: 'coordinador',
    component: (onClose) => <CoordForm onClose={onClose} />,
  },
]

export default function UserForm() {
  return (
    <Tab options={options} defaultTab="pasante" variant="secondary">
      <Tab.Options />
      <Tab.Content />
    </Tab>
  )
}
