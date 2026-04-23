import { HiOutlinePencilSquare, HiOutlineUserCircle } from 'react-icons/hi2'
import { formatFecha, formatHora } from '@lib/dateHelpers'
import Button from '@components/Button'

export default function NoteCard({
  note,
  onClick,
  onEdit,
  isSelected = false,
  layout = 'grid',
}) {
  const { motivo_consulta, planes_estudio, usuarios, creado_at } = note

  const date = formatFecha(creado_at)
  const hour = formatHora(creado_at)
  const doctor = usuarios
  const cie10Codes = planes_estudio?.cie10_codes ?? []
  const isList = layout === 'list'

  return (
    <article
      onClick={onClick}
      className={`group relative flex cursor-pointer overflow-hidden rounded-xl border bg-white transition-all duration-150 hover:border-teal-300 hover:shadow-md ${
        isList ? 'flex-col' : 'h-[220px] flex-col'
      } ${
        isSelected
          ? 'border-teal-400 ring-2 ring-teal-100'
          : 'border-gray-200 shadow-sm'
      }`}
    >
      {/* Edit button */}
      <div
        className={`absolute top-2.5 right-2.5 z-10 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg bg-white/90 p-1.5 text-zinc-400 shadow-sm backdrop-blur-sm hover:text-zinc-700"
          aria-label="Editar nota"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(note)
          }}
        >
          <HiOutlinePencilSquare size={14} />
        </Button>
      </div>

      {/* Header: date, hour, doctor */}
      <div
        className={`flex shrink-0 items-center gap-3 border-b border-zinc-100 bg-zinc-50/50 px-4 ${
          isList ? 'py-2.5' : 'pt-3 pb-2.5'
        }`}
      >
        <time className="text-6 shrink-0 font-semibold tracking-wide text-zinc-600 uppercase">
          {date} · {hour}h
        </time>

        <span className="text-zinc-200">|</span>

        <div className="flex min-w-0 items-center gap-1.5">
          {doctor?.foto ? (
            <img
              src={doctor.foto}
              alt={doctor.nombre}
              className="h-5 w-5 shrink-0 rounded-full object-cover"
            />
          ) : (
            <HiOutlineUserCircle size={16} className="shrink-0 text-zinc-300" />
          )}
          <span className="text-6 truncate text-zinc-400">
            {doctor?.nombre ?? 'Dr. no registrado'}
          </span>
        </div>
      </div>

      {/* Body: motivo */}
      <div
        className={`flex-1 overflow-hidden px-4 ${isList ? 'py-2.5' : 'py-3'}`}
      >
        <p className="text-7 mb-1 font-medium tracking-wide text-zinc-400 uppercase">
          Motivo de consulta
        </p>
        <p
          className={`text-5 text-zinc-600 ${isList ? 'line-clamp-1' : 'line-clamp-3'}`}
        >
          {motivo_consulta || (
            <span className="text-zinc-300 italic">Sin motivo de consulta</span>
          )}
        </p>
      </div>

      {/* Footer: CIE-10 codes */}
      <div className="shrink-0 border-t border-zinc-100 px-4 py-2.5">
        {cie10Codes.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {cie10Codes.slice(0, isList ? 6 : 3).map((d) => (
              <span
                key={d.codigo}
                className="text-7 rounded-md border border-blue-100 bg-blue-50/80 px-1.5 py-0.5 font-mono font-semibold text-blue-600"
              >
                {d.codigo}
              </span>
            ))}
            {cie10Codes.length > (isList ? 6 : 3) && (
              <span className="text-7 rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-400">
                +{cie10Codes.length - (isList ? 6 : 3)}
              </span>
            )}
          </div>
        ) : (
          <span className="text-7 text-zinc-300 italic">Sin diagnósticos</span>
        )}
      </div>
    </article>
  )
}
