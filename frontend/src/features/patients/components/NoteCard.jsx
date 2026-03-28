import { HiOutlineUserCircle } from 'react-icons/hi2'
import { formatFecha } from '@lib/dateHelpers'

export default function NoteCard({ note, onClick, isSelected = false }) {
  const { motivo_consulta, planes_estudio } = note

  const date = formatFecha(planes_estudio?.generado_en)
  const doctorName = planes_estudio?.usuarios?.nombre
  const cie10Codes = planes_estudio?.planes_estudio_cie10 ?? []

  return (
    <article
      onClick={onClick}
      className={`flex h-[200px] cursor-pointer flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-150 hover:border-teal-300 hover:shadow-md ${
        isSelected
          ? 'border-teal-400 ring-2 ring-teal-100'
          : 'border-gray-200'
      }`}
    >
      {/* Identity: date + dot */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-1.5">
        <time className="text-5 font-mono font-semibold text-zinc-700">
          {date ?? '—'}
        </time>
        <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
      </div>

      {/* Doctor */}
      <div className="flex shrink-0 items-center gap-1.5 px-4 pb-3">
        <HiOutlineUserCircle size={13} className="shrink-0 text-zinc-300" />
        <span className="text-6 truncate text-zinc-400">
          {doctorName ?? 'Dr. no registrado'}
        </span>
      </div>

      {/* Motivo */}
      <div className="flex-1 overflow-hidden border-t border-gray-100 px-4 py-3">
        {motivo_consulta ? (
          <p className="text-5 line-clamp-2 leading-relaxed text-zinc-600">
            {motivo_consulta}
          </p>
        ) : (
          <p className="text-5 italic text-zinc-300">Sin motivo de consulta</p>
        )}
      </div>

      {/* CIE-10 footer */}
      <div className="shrink-0 border-t border-gray-100 px-4 py-2.5">
        {cie10Codes.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {cie10Codes.slice(0, 4).map((d) => (
              <span
                key={d.id}
                className="text-6 rounded-md bg-blue-50 px-2 py-0.5 font-mono font-semibold text-blue-700"
              >
                {d.codigo}
              </span>
            ))}
            {cie10Codes.length > 4 && (
              <span className="text-6 rounded-md bg-gray-100 px-2 py-0.5 text-zinc-400">
                +{cie10Codes.length - 4}
              </span>
            )}
          </div>
        ) : (
          <span className="text-6 italic text-zinc-300">Sin diagnósticos</span>
        )}
      </div>
    </article>
  )
}
