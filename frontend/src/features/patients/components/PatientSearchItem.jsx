import { HiArrowRight } from 'react-icons/hi2'
import { formatRelativo } from '@lib/dateHelpers'
import { formatPhone } from '@lib/utils'

export default function PatientSearchItem({ patient, onSelect }) {
  const { nombre, apellidos, telefono, correo, actualizado_at } = patient
  const fullName = [nombre, apellidos].filter(Boolean).join(' ')
  const contact = telefono ? formatPhone(telefono) : correo
  const relativo = formatRelativo(actualizado_at)

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(patient)}
        className="group flex w-full items-center gap-4 px-3 py-2.5 text-left transition-colors hover:bg-zinc-50 focus-visible:bg-zinc-50 focus-visible:outline-none"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 transition-colors group-hover:text-green-800">
            {fullName}
          </p>
          {contact && <p className="truncate text-xs text-zinc-500 tabular-nums">{contact}</p>}
        </div>
        {relativo && (
          <span className="shrink-0 text-xs whitespace-nowrap text-zinc-400">
            Actualizado {relativo}
          </span>
        )}
        <HiArrowRight
          size={12}
          className="shrink-0 -translate-x-1 text-zinc-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        />
      </button>
    </li>
  )
}
