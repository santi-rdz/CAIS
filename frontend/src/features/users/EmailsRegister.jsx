import { isValidEmail } from '@lib/utils'
import Button from '@ui/Button'
import DomainToggle from '@ui/DomainToggle'
import FormRow from '@ui/FormRow'
import Input from '@ui/Input'
import RoleSelect from '@ui/RoleSelect'
import Row from '@ui/Row'
import Tag from '@ui/Tag'

import { createContext, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlineUserPlus } from 'react-icons/hi2'
import useCreatePreUser from './useCreatePreUser'

const EmailsContext = createContext()

export default function EmailsRegister({ onClose }) {
  const { createPreUser, isCreating } = useCreatePreUser()
  const [emails, setEmails] = useState([])
  const [isUabcDomain, setIsUabcDomain] = useState(true)
  const [role, setRole] = useState('pasante')
  const { register, handleSubmit, formState, reset } = useForm()
  const { errors } = formState

  function onSubmit(data) {
    const { email } = data
    const fullEmail = isUabcDomain ? `${email.replace('@uabc.edu.mx', '')}@uabc.edu.mx` : email
    setEmails([{ email: fullEmail, role, status: 'registro enviado' }, ...emails])
    reset()
  }

  return (
    <EmailsContext.Provider value={{ emails, role, setRole, isUabcDomain, setIsUabcDomain }}>
      <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))} className="space-y-6">
        <FormRow htmlFor="email">
          <Input
            offset="0"
            {...register('email', {
              required: isUabcDomain ? 'Ingresa un usuario' : 'Ingresa un correo electronico',
              validate: (email) => isUabcDomain || isValidEmail(email) || 'Ingresa un correo valido',
            })}
            id="email"
            type="text"
            name="email"
            variant="outline-b"
            size="xl"
            error={errors?.email?.message}
            placeholder={isUabcDomain ? 'e.g. jhon.martinez29' : 'e.g. jhon.martinez@example.com'}
            aria-label="Ingresar email"
            suffix={<Suffix />}
          />
        </FormRow>
        <Button size="md" type="outline" className="border-gray-100">
          <HiOutlineUserPlus size="18" /> Agregar usurio
        </Button>
      </form>
      <EmailsBox />
      <Row direction="row-end">
        <Button type="secondary" onClick={onClose}>
          Canelar
        </Button>
        <Button
          disabled={!emails.length || isCreating}
          onClick={() =>
            createPreUser(emails, {
              onSuccess: () => {
                onClose()
                setEmails([])
                reset()
              },
            })
          }
        >
          Confirmar y enviar
        </Button>
      </Row>
    </EmailsContext.Provider>
  )
}

function EmailsBox() {
  const { emails } = useContext(EmailsContext)
  return (
    <div className="mt-6 space-y-2 overflow-hidden border-t border-t-gray-200 py-2">
      {!emails.length ? (
        <p className="text-4 flex h-26 items-center justify-center text-neutral-500">No hay correos ingresados aun</p>
      ) : (
        <EmailsList />
      )}
    </div>
  )
}
function EmailsList() {
  const { emails } = useContext(EmailsContext)

  return (
    <>
      <p className="text-4 font-bold">
        Registros (<span>{emails.length}</span>)
      </p>
      <div className="flex h-26 flex-wrap items-start gap-2 overflow-y-scroll py-2">
        {emails.map((e) => (
          <Tag key={e.email} size="md" type="white">
            {e.email}
          </Tag>
        ))}
      </div>
    </>
  )
}

function Suffix({ className, style }) {
  const { role, isUabcDomain, setIsUabcDomain, setRole } = useContext(EmailsContext)
  return (
    <div style={style} className={`flex items-center gap-2 pb-4 ${className}`}>
      <DomainToggle
        isDomain={isUabcDomain}
        setIsDomain={setIsUabcDomain}
        className="relative rounded-lg border border-gray-200 py-2.5 font-medium shadow-xs"
      />
      <RoleSelect role={role} setRole={setRole} />
    </div>
  )
}
