import Tab from '@ui/Tab'
import InvitationalLinksForm from './InvitationalLinksForm'
import UserForm from './UserForm'
import {
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
} from 'react-icons/hi2'

export default function UserRegisterForms({ onCloseModal }) {
  return (
    <Tab defaultTab="invitations">
      <Tab.Header>
        <Tab.Title />
        <Tab.List>
          <Tab.Trigger
            value="invitations"
            title="Invitaciones de registro"
            desc="Envia invitaciones de registro por correo electrónico."
          >
            <span className="flex items-center justify-center gap-1.5">
              <HiOutlineEnvelope size={14} />
              Invitaciones
            </span>
          </Tab.Trigger>
          <Tab.Trigger
            value="full"
            title="Registro completo"
            desc="Registra a un nuevo usuario llenando todos sus datos."
          >
            <span className="flex items-center justify-center gap-1.5">
              <HiOutlineClipboardDocumentList size={14} />
              Registro completo
            </span>
          </Tab.Trigger>
        </Tab.List>
        <Tab.Description />
      </Tab.Header>

      <Tab.Panel value="invitations" scrollable={false}>
        <InvitationalLinksForm onClose={onCloseModal} />
      </Tab.Panel>
      <Tab.Panel value="full" scrollable={false}>
        <UserForm onClose={onCloseModal} />
      </Tab.Panel>
    </Tab>
  )
}
