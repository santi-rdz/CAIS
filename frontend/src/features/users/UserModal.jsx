import Tab from '@ui/Tab'
import InvitationalLinksForm from './InvitationalLinksForm'
import UserForm from './UserForm'

const options = [
  {
    title: 'Invitaciones de registro',
    desc: 'Ingresa correos electrónicos destino para enviar el link de registro',
    label: 'Pre-registro',
    value: 'pre',
    component: (onClose) => <InvitationalLinksForm onClose={onClose} />,
  },
  {
    title: 'Registro completo',
    desc: 'Completa la información del usuario',
    label: 'Registro completo',
    value: 'full',
    component: (onClose) => <UserForm onClose={onClose} />,
  },
]

export default function UserModal({ onCloseModal }) {
  return (
    <Tab options={options} defaultTab="pre">
      <Tab.Header>
        <Tab.Title />
        <Tab.Description />
      </Tab.Header>
      <Tab.Options />
      <Tab.Content onClose={onCloseModal} />
    </Tab>
  )
}
