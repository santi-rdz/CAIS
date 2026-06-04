import { HiOutlineEnvelope, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2'

const ROLE_BADGE = {
  pasante: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  coordinador: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
}

export default function InvitationCard({ user, isEditing, onEdit, onDelete }) {
  const { email, role } = user

  return (
    <li
      className={`group flex h-fit items-center gap-3 rounded-lg border px-4 py-3 shadow-xs transition-all duration-200 ${
        isEditing ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:shadow-sm'
      }`}
    >
      <div
        className={`grid size-9 shrink-0 place-items-center rounded-full ${
          isEditing ? 'bg-blue-100' : 'bg-green-50 ring-1 ring-green-800/15'
        }`}
      >
        <HiOutlineEnvelope size={16} className={isEditing ? 'text-blue-600' : 'text-green-800'} />
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
          className={`rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 ${
            isEditing ? 'pointer-events-none opacity-40' : ''
          }`}
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
