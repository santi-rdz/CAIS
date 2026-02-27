import { isValidEmail } from '@lib/utils'
import Button from '@ui/Button'
import DomainToggle from '@ui/DomainToggle'
import FormRow from '@ui/FormRow'
import Input from '@ui/Input'
import RoleSelect from '@ui/RoleSelect'

import { createContext, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  HiOutlineEnvelope,
  HiOutlineUserPlus,
  HiCheck,
  HiOutlineTrash,
  HiOutlinePencil,
  HiBars3,
  HiOutlineSquares2X2,
} from 'react-icons/hi2'
import useCreatePreUser from './useCreatePreUser'
import ModalActions from '@ui/ModalActions'

const EmailsContext = createContext()

export default function EmailsRegister({ onClose }) {
  const { createPreUser, isCreating } = useCreatePreUser()
  const [users, setUsers] = useState([])
  const [isUabcDomain, setIsUabcDomain] = useState(true)
  const [role, setRole] = useState('pasante')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  function onSubmit(data) {
    const { email } = data
    const fullEmail = isUabcDomain ? `${email.replace('@uabc.edu.mx', '')}@uabc.edu.mx` : email
    setUsers([{ email: fullEmail, role, status: 'pendiente' }, ...users])
    reset()
  }

  return (
    <EmailsContext.Provider value={{ users, role, setRole, isUabcDomain, setIsUabcDomain }}>
      {/* CUERPO SCROLLEABLE */}
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
              error={errors?.email?.message}
              placeholder={isUabcDomain ? 'e.g. jhon.martinez29' : 'e.g. jhon.martinez@example.com'}
              aria-label="Ingresar email"
              suffix={<Suffix />}
            />
          </FormRow>
          <Button size="md" variant="outline" className="w-full border-gray-100">
            <HiOutlineUserPlus size="18" /> Agregar usuario
          </Button>
        </form>

        <EmailsDisplay />
      </div>

      {/* ACTIONS */}
      <ModalActions className="shrink-0 border-t border-gray-100 bg-white shadow-lg">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          icon={<HiCheck size={20} />}
          isLoading={isCreating}
          disabled={!users.length || isCreating}
          onClick={() =>
            createPreUser(users, {
              onSuccess: () => {
                onClose()
                setUsers([])
                reset()
              },
            })
          }
        >
          Enviar Correos
        </Button>
      </ModalActions>
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
          <div className="flex gap-1 rounded-md bg-gray-100 p-1">
            <Button
              variant="ghost"
              size="sm"
              className={layout === 'list' ? 'bg-gray-200' : ''}
              onClick={() => setLayout('list')}
            >
              <HiBars3 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={layout === 'grid' ? 'bg-gray-200' : ''}
              onClick={() => setLayout('grid')}
            >
              <HiOutlineSquares2X2 size={16} />
            </Button>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <EmailsEmptyState />
      ) : (
        <ul className={`${isGrid ? 'grid grid-cols-2 ' : 'flex flex-col '} h-[300px] gap-2 overflow-y-auto`}>
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
  return (
    <li className="group flex items-center gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-xs transition-shadow duration-300 hover:shadow-sm">
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
          className="rounded p-1.5 text-green-900 transition-colors hover:bg-gray-100 hover:text-green-950"
          title="Editar"
        >
          <HiOutlinePencil size={18} />
        </button>
        <button
          type="button"
          className="rounded p-1.5 text-green-900 transition-colors hover:bg-gray-100 hover:text-green-950"
          title="Eliminar"
        >
          <HiOutlineTrash size={18} />
        </button>
      </div>
    </li>
  )
}

function EmailsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-100 p-8 text-neutral-500">
      <div className="rounded-full bg-white p-3 shadow-sm">
        <HiOutlineEnvelope size={24} />
      </div>
      <p className="text-4 text-neutral-500">No hay correos ingresados aún</p>
      <span className="text-5 text-neutral-400">Agregue usuarios para enviar invitaciones</span>
    </div>
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
