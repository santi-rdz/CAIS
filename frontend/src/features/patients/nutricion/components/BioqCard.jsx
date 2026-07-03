import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineBeaker } from 'react-icons/hi2'
import { formatFecha } from '@lib/dateHelpers'
import Button from '@components/Button'
import { BIOQ_PROFILE_LABELS } from '@features/patients/nutricion/constants'

// Card plana (borde fino, sin sombra por defecto): vive anidada dentro del
// panel ya encajonado de PatientHistoriaShell, así que evita duplicar su
// chrome (shadow-card + border + rounded-2xl se ve "caja dentro de caja").
export default function BioqCard({ evaluation, onView, onEdit, onDelete }) {
  const capturedProfiles = BIOQ_PROFILE_LABELS.filter(({ key }) => evaluation[key])

  return (
    <div
      onClick={() => onView?.(evaluation)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView?.(evaluation)
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`bioq-card-${evaluation.id}`}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-zinc-100 bg-white p-4 transition-all duration-150 hover:border-teal-300 hover:shadow-sm"
    >
      <div className="absolute top-2.5 right-2.5 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700"
          aria-label="Editar evaluación bioquímica"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(evaluation)
          }}
        >
          <HiOutlinePencilSquare size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-red-600"
          aria-label="Eliminar evaluación bioquímica"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(evaluation)
          }}
        >
          <HiOutlineTrash size={14} />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2 pr-14">
        <div className="flex min-w-0 items-center gap-1.5">
          <HiOutlineBeaker size={15} className="shrink-0 text-teal-500" />
          <time className="text-6 truncate font-semibold tracking-wide text-zinc-600 uppercase">
            {formatFecha(evaluation.fecha ?? evaluation.creado_at)}
          </time>
        </div>
        <span className="text-7 shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-500">
          {capturedProfiles.length}/{BIOQ_PROFILE_LABELS.length}
        </span>
      </div>

      {capturedProfiles.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {capturedProfiles.slice(0, 3).map(({ key, label }) => (
            <span
              key={key}
              className="text-7 rounded-md border border-teal-100 bg-teal-50/80 px-1.5 py-0.5 font-semibold text-teal-600"
            >
              {label}
            </span>
          ))}
          {capturedProfiles.length > 3 && (
            <span className="text-7 rounded-md bg-zinc-100 px-1.5 py-0.5 text-zinc-400">
              +{capturedProfiles.length - 3}
            </span>
          )}
        </div>
      ) : (
        <span className="text-7 text-zinc-300 italic">Sin perfiles registrados</span>
      )}
    </div>
  )
}
