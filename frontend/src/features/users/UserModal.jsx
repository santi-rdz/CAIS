import EmailsRegister from './EmailsRegister'
import Tab from '@ui/Tab'

const options = [
  {
    label: 'Pre-registro',
    value: 'pre',
    component: (onClose) => <EmailsRegister onClose={onClose} />,
  },
  {
    label: 'Registro completo',
    value: 'full',
    component: (onClose) => <EmailsRegister onClose={onClose} />,
  },
]

export default function UserModal({ onCloseModal }) {
  return (
    <div className="w-[600px]">
      <Tab options={options} defaultTab="pre">
        <Tab.Header>
          <Tab.Title>Enviar Links de registro</Tab.Title>
          <Tab.Options />
        </Tab.Header>
        <Tab.Content onClose={onCloseModal} />
      </Tab>
    </div>
  )
}
