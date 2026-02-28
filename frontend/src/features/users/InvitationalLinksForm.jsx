import { isValidEmail } from '@lib/utils'
import Button from '@ui/Button'
import DomainToggle from '@ui/DomainToggle'
import FormRow from '@ui/FormRow'
import Input from '@ui/Input'
import RoleSelect from '@ui/RoleSelect'
import ModalActions from '@ui/ModalActions'
import TabLayout from '@ui/TabLayout'

import { createContext, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { HiOutlineEnvelope, HiOutlineUserPlus, HiCheck, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi2'
import useCreatePreUser from './useCreatePreUser'

const EmailsContext = createContext()

export default function InvitationalLinksForm({ onClose }) {
  const { createPreUser, isCreating } = useCreatePreUser()

  const [users, setUsers] = useState([])
  const [idEdit, setIdEdit] = useState('')
  const [role, setRole] = useState('pasante')
  const [isUabcDomain, setIsUabcDomain] = useState(true)

  const isEditMode = Boolean(idEdit)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  const handleEdit = (user) => {
    const isUabc = user.email.endsWith('@uabc.edu.mx')
    setIdEdit(user.email)
    setRole(user.role)
    setIsUabcDomain(isUabc)

    const displayEmail = isUabc ? user.email.replace('@uabc.edu.mx', '') : user.email
    setValue('email', displayEmail)
  }

  const handleDelete = (email) => {
    setUsers(users.filter((user) => user.email !== email))
    resetForm()
  }

  const onSubmit = (data) => {
    const { email } = data
    const fullEmail = isUabcDomain ? `${email.replace('@uabc.edu.mx', '')}@uabc.edu.mx` : email

    if (isEditMode) {
      setUsers(users.map((u) => (u.email === idEdit ? { email: fullEmail, role, status: 'pendiente' } : u)))
      setIdEdit('')
    } else {
      if (users.some((u) => u.email === fullEmail)) return toast.error('Este correo ya ha sido agregado a la lista')
      setUsers([{ email: fullEmail, role, status: 'pendiente' }, ...users])
    }

    resetForm()
  }

  function resetForm() {
    reset()
    setRole('pasante')
    setIsUabcDomain(true)
    setIdEdit('')
  }

  return (
    <EmailsContext.Provider
      value={{
        users,
        role,
        setRole,
        isUabcDomain,
        idEdit,
        setIsUabcDomain,
        onDelete: handleDelete,
        onEdit: handleEdit,
      }}
    >
      <div className="space-y-6 px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormRow htmlFor="email">
            <Input
              offset="0"
              {...register('email', {
                required: isUabcDomain ? 'Ingresa un usuario' : 'Ingresa un correo electrónico',
                validate: (email) => isUabcDomain || isValidEmail(email) || 'Ingresa un correo válido',
              })}
              id="email"
              type="text"
              name="email"
              variant="outline-b"
              size="xl"
              hasError={errors?.email?.message}
              placeholder={isUabcDomain ? 'e.g. jhon.martinez29' : 'e.g. jhon.martinez@example.com'}
              aria-label="Ingresar email"
              suffix={<Suffix />}
            />
          </FormRow>
          <Button size="md" variant="outline" className="w-full border border-gray-300">
            {isEditMode ? (
              <>
                <HiOutlinePencil /> Guardar cambios
              </>
            ) : (
              <>
                <HiOutlineUserPlus size="18" /> Agregar usuario a la lista
              </>
            )}
          </Button>
        </form>

        <EmailsDisplay />
      </div>

      <ModalActions
        variant="primary"
        onClose={onClose}
        primaryAction={{
          label: 'Enviar Correos',
          icon: <HiOutlineEnvelope size={20} />,
          onClick: () =>
            createPreUser(users, {
              onSuccess: () => {
                onClose()
                setUsers([])
                reset()
              },
            }),
          disabled: users.length === 0 || isCreating,
          isLoading: isCreating,
        }}
      />
    </EmailsContext.Provider>
  )
}

function EmailsDisplay() {
  const { users } = useContext(EmailsContext)
  const [layout, setLayout] = useState('list')
  const isGrid = layout === 'grid'

  return (
    <div className="mt-8 border-t border-t-gray-100 pt-6">
      {users.length > 0 && (
        <div className="text-4 mb-4 flex items-center justify-between font-bold">
          <p className="text-4 font-semibold"> Registros ({users.length})</p>
          <TabLayout layout={layout} setLayout={setLayout} />
        </div>
      )}

      {users.length === 0 ? (
        <EmailsEmptyState />
      ) : (
        <ul
          className={`${isGrid ? 'grid grid-cols-2 content-start ' : 'flex flex-col '} max-h-60 gap-2 overflow-y-auto`}
        >
          {users.map((user) => (
            <InvitationCard key={user.email} user={user} size="md" type="white" className="shadow-sm">
              {user.email}
            </InvitationCard>
          ))}
        </ul>
      )}
    </div>
  )
}

function InvitationCard({ user }) {
  const { email, role } = user
  const { onDelete, onEdit, idEdit } = useContext(EmailsContext)
  return (
    <li
      className={`group ${idEdit === email ? 'border-blue-200 bg-blue-50' : 'border-emerald-200 bg-emerald-50'} flex h-fit items-center gap-4 rounded-lg border px-4 py-3 shadow-xs transition-shadow duration-300 hover:shadow-sm`}
    >
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-green-800 shadow-xs">
        <HiOutlineEnvelope size={20} className="text-white" />
      </div>

      <div className="flex-1 overflow-hidden">
        <p className="text-4 truncate font-medium text-gray-900">{email}</p>
        <span className="text-5 text-gray-500 capitalize">{role}</span>
      </div>

      <div className="hidden gap-2 transition-opacity duration-200 group-hover:flex">
        <button
          type="button"
          className={`rounded p-1.5 text-green-900 transition-colors hover:bg-gray-100 hover:text-green-950 ${idEdit === email ? 'pointer-events-none opacity-50' : ''}`}
          title="Editar"
          onClick={() => onEdit(user)}
        >
          <HiOutlinePencil size={18} />
        </button>
        <button
          type="button"
          className={`rounded p-1.5 text-green-900 transition-colors hover:text-green-950 ${idEdit === email ? 'hover:bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Eliminar"
          onClick={() => onDelete(email)}
        >
          <HiOutlineTrash size={18} />
        </button>
      </div>
    </li>
  )
}

function EmailsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-gray-100 p-6 text-neutral-500">
      <div className="rounded-full bg-white p-3 shadow-sm">
        <HiOutlineEnvelope size={24} />
      </div>
      <p className="text-4 text-neutral-500">No hay correos ingresados aún</p>
      <span className="text-5 text-neutral-400">Agregue usuarios para enviar invitaciones de registro.</span>
    </div>
  )
}

function Suffix({ className, style }) {
  const { role, isUabcDomain, setIsUabcDomain, setRole } = useContext(EmailsContext)
  return (
    <div style={style} className={`flex items-center gap-2 pb-4 ${className}`}>
      <DomainToggle isDomain={isUabcDomain} setIsDomain={setIsUabcDomain} className="relative" />
      <RoleSelect role={role} setRole={setRole} />
    </div>
  )
}
