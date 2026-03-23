import Button from '@components/Button'
import ModalBody from '@components/ModalBody'
import RoleSelect from '@ui/RoleSelect'
import ModalActions from '@components/ModalActions'
import TabLayout from '@ui/TabLayout'

import { createContext, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import useEmailDomain from '@hooks/useEmailDomain'
import {
  HiOutlineEnvelope,
  HiOutlineUserPlus,
  HiOutlineTrash,
  HiOutlinePencil,
} from 'react-icons/hi2'
import useCreateInvitations from './hooks/useCreateInvitations'
import DomainEmailInput from '@ui/DomainEmailInput'

const EmailsContext = createContext()

export default function InvitationalLinksForm({ onClose }) {
  const { createInvitations, isCreating } = useCreateInvitations()

  const [users, setUsers] = useState([])
  const [idEdit, setIdEdit] = useState('')
  const [role, setRole] = useState('pasante')
  const { isUabcDomain, setIsUabcDomain, resolveEmail } = useEmailDomain()

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
    setValue(
      'email',
      isUabc ? user.email.replace('@uabc.edu.mx', '') : user.email
    )
  }

  const handleDelete = (email) => {
    setUsers(users.filter((user) => user.email !== email))
    resetForm()
  }

  const onSubmit = (data) => {
    const fullEmail = resolveEmail(data.email)

    if (isEditMode) {
      setUsers(
        users.map((u) =>
          u.email === idEdit
            ? { email: fullEmail, role, status: 'pendiente' }
            : u
        )
      )
      setIdEdit('')
    } else {
      if (users.some((u) => u.email === fullEmail))
        return toast.error('Este correo ya ha sido agregado a la lista')
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
      <ModalBody py={8}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DomainEmailInput
            error={errors?.email?.message}
            register={register}
            isDomain={isUabcDomain}
            setIsDomain={setIsUabcDomain}
            extraSuffix={<RoleSelect role={role} setRole={setRole} />}
          />
          <Button
            type="submit"
            size="md"
            variant="outline"
            className="w-full border border-gray-300"
          >
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

        <div className="mt-10">
          <EmailsDisplay />
        </div>
      </ModalBody>

      <ModalActions
        variant="primary"
        onClose={onClose}
        primaryAction={{
          label: 'Enviar Correos',
          icon: <HiOutlineEnvelope size={20} />,
          onClick: () =>
            createInvitations(users, {
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

const ROLE_BADGE = {
  pasante: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  coordinador: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
}

function EmailsDisplay() {
  const { users } = useContext(EmailsContext)
  const [layout, setLayout] = useState('list')
  const isGrid = layout === 'grid'

  return (
    <div className="border-t border-t-gray-100 pt-8">
      {users.length > 0 && (
        <div className="mb-5 flex items-center justify-between">
          <p className="text-4 font-semibold text-gray-800">
            Invitaciones{' '}
            <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {users.length}
            </span>
          </p>
          <TabLayout layout={layout} setLayout={setLayout} />
        </div>
      )}

      {users.length === 0 ? (
        <EmailsEmptyState />
      ) : (
        <ul
          className={`${isGrid ? 'grid grid-cols-2 content-start ' : 'flex flex-col '} max-h-64 gap-4 overflow-y-auto`}
        >
          {users.map((user) => (
            <InvitationCard
              key={user.email}
              user={user}
              size="md"
              type="white"
              className="shadow-sm"
            >
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
  const isEditing = idEdit === email

  return (
    <li
      className={`group flex h-fit items-center gap-3 rounded-lg border px-4 py-3 shadow-xs transition-all duration-200 ${
        isEditing
          ? 'border-blue-200 bg-blue-50'
          : 'border-gray-200 bg-white hover:shadow-sm'
      }`}
    >
      <div
        className={`grid size-9 shrink-0 place-items-center rounded-full ${
          isEditing ? 'bg-blue-100' : 'bg-green-50 ring-1 ring-green-800/15'
        }`}
      >
        <HiOutlineEnvelope
          size={16}
          className={isEditing ? 'text-blue-600' : 'text-green-800'}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <p className="text-4 truncate font-medium text-gray-900">{email}</p>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_BADGE[role] ?? 'bg-gray-100 text-gray-600'}`}
        >
          {role}
        </span>
      </div>

      <div className="hidden gap-1 group-hover:flex">
        <button
          type="button"
          className={`rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 ${isEditing ? 'pointer-events-none opacity-40' : ''}`}
          title="Editar"
          onClick={() => onEdit(user)}
        >
          <HiOutlinePencil size={15} />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          title="Eliminar"
          onClick={() => onDelete(email)}
        >
          <HiOutlineTrash size={15} />
        </button>
      </div>
    </li>
  )
}

function EmailsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
      <div className="rounded-full border border-gray-200 bg-white p-3 shadow-xs">
        <HiOutlineEnvelope size={20} className="text-gray-400" />
      </div>
      <div className="space-y-0.5">
        <p className="text-4 font-medium text-gray-700">Sin invitaciones aún</p>
        <span className="text-5 text-gray-400">
          Agrega correos para enviar invitaciones de registro.
        </span>
      </div>
    </div>
  )
}
