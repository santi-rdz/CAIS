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

  if (layout === 'list') {
    return (
      <article
        onClick={onClick}
        className={`group relative flex cursor-pointer flex-col gap-2 overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-150 hover:border-teal-300 hover:shadow-md ${
          isSelected
            ? 'border-teal-400 ring-2 ring-teal-100'
            : 'border-gray-200'
        }`}
      >
        {/* Top row: DateTime + Doctor + Edit */}
        <div className="flex shrink-0 items-center justify-between gap-3 bg-zinc-50/60 px-4 pt-3 pb-2.5">
          <time className="text-6 shrink-0 font-mono font-semibold tracking-wide text-zinc-600 uppercase">
            {date} {hour}h
          </time>
          <div className="flex min-w-0 items-center gap-2">
            {doctor?.foto ? (
              <img
                src={doctor.foto}
                alt={doctor.nombre}
                className="h-6 w-6 shrink-0 rounded-full object-cover"
              />
            ) : (
              <HiOutlineUserCircle
                size={18}
                className="shrink-0 text-zinc-300"
              />
            )}
            <span className="text-6 truncate text-zinc-400">
              {doctor?.nombre ?? 'Dr. no registrado'}
            </span>
          </div>
        </div>

        {/* Edit button (top right) */}
        <div
          className={`absolute top-2 right-2 z-10 transition-opacity ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            className="rounded-md bg-white/90 p-1.5 text-zinc-500 shadow-sm hover:text-zinc-800"
            aria-label="Editar nota"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(note)
            }}
          >
            <HiOutlinePencilSquare size={14} />
          </Button>
        </div>

        {/* Motivo section */}
        <div className="px-4 py-1.5">
          <p className="text-7 mb-1 font-medium text-zinc-400 uppercase">
            Motivo
          </p>
          <p className="text-5 text-zinc-600">
            {motivo_consulta || (
              <span className="text-zinc-300 italic">
                Sin motivo de consulta
              </span>
            )}
          </p>
        </div>

        {/* CIE-10 footer */}
        <div className="shrink-0 px-4 pt-1.5 pb-2.5">
          {cie10Codes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {cie10Codes.slice(0, 4).map((d) => (
                <span
                  key={d.codigo}
                  className="text-6 rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 font-mono font-semibold text-blue-700"
                >
                  {d.codigo}
                </span>
              ))}
              {cie10Codes.length > 4 && (
                <span className="text-6 rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-500">
                  +{cie10Codes.length - 4}
                </span>
              )}
            </div>
          ) : (
            <span className="text-6 text-zinc-300 italic">
              Sin diagnósticos
            </span>
          )}
        </div>
      </article>
    )
  }

  // Grid mode (original)
  return (
    <article
      onClick={onClick}
      className={`group relative flex h-[200px] cursor-pointer flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-150 hover:border-teal-300 hover:shadow-md ${
        isSelected ? 'border-teal-400 ring-2 ring-teal-100' : 'border-gray-200'
      }`}
    >
      <div
        className={`absolute top-2 right-2 z-10 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="rounded-md bg-white/90 p-1.5 text-zinc-500 shadow-sm hover:text-zinc-800"
          aria-label="Editar nota"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(note)
          }}
        >
          <HiOutlinePencilSquare size={14} />
        </Button>
      </div>

      {/* Identity */}
      <div className="flex shrink-0 items-center justify-between bg-zinc-50/60 px-4 pt-3 pb-2.5">
        <time className="text-6 font-mono font-semibold tracking-wide text-zinc-600 uppercase">
          {date ?? '—'}
        </time>
        <span
          className={`h-2 w-2 rounded-full ${
            isSelected ? 'bg-teal-500' : 'bg-teal-300'
          }`}
        />
      </div>

      {/* Doctor + Hour */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-2 pb-2.5">
        <div className="flex min-w-0 items-center gap-2">
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
        <span className="text-6 ml-3 shrink-0 font-mono text-zinc-400">
          {hour ?? '--:--'} h
        </span>
      </div>

      {/* Motivo */}
      <div className="flex-1 overflow-hidden px-4 py-3 text-ellipsis">
        <p className="text-7 mb-1.5 font-medium tracking-wide text-zinc-400 uppercase">
          Motivo de consulta
        </p>
        {motivo_consulta ? (
          <p className="text-5 line-clamp-2 text-zinc-600">{motivo_consulta}</p>
        ) : (
          <p className="text-5 text-zinc-300 italic">Sin motivo de consulta</p>
        )}
      </div>

      {/* CIE-10 footer */}
      <div className="shrink-0 px-4 py-2.5">
        {cie10Codes.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {cie10Codes.slice(0, 4).map((d) => (
              <span
                key={d.codigo}
                className="text-6 rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 font-mono font-semibold text-blue-700"
              >
                {d.codigo}
              </span>
            ))}
            {cie10Codes.length > 4 && (
              <span className="text-6 rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-500">
                +{cie10Codes.length - 4}
              </span>
            )}
          </div>
        ) : (
          <span className="text-6 text-zinc-300 italic">Sin diagnósticos</span>
        )}
      </div>
    </article>
  )
}
