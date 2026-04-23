import {
  HiOutlineUserPlus,
  HiOutlinePencilSquare,
  HiOutlineClipboardDocument,
  HiOutlineExclamationTriangle,
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiOutlineUser,
} from 'react-icons/hi2'
import dayjs from 'dayjs'
import es from 'dayjs/locale/es'

const ACTIVITY_CONFIG = {
  'CREAR:NOTA_MEDICA': {
    title: 'Nota médica creada',
    bg: 'bg-green-500',
    Icon: HiOutlineDocumentText,
  },
  'CREAR:EXPEDIENTE_MEDICO': {
    title: 'Historia médica creada',
    bg: 'bg-violet-500',
    Icon: HiOutlineClipboardDocument,
  },
  'CREAR:PACIENTE': {
    title: 'Paciente registrado',
    bg: 'bg-blue-500',
    Icon: HiOutlineUserPlus,
  },
  'CREAR:EMERGENCIA': {
    title: 'Emergencia registrada',
    bg: 'bg-red-500',
    Icon: HiOutlineExclamationTriangle,
  },
  'CREAR:USUARIO': {
    title: 'Usuario creado',
    bg: 'bg-teal-500',
    Icon: HiOutlineUser,
  },
  'EDITAR:NOTA_MEDICA': {
    title: 'Nota médica editada',
    bg: 'bg-amber-500',
    Icon: HiOutlinePencilSquare,
  },
  'EDITAR:EXPEDIENTE_MEDICO': {
    title: 'Historia médica editada',
    bg: 'bg-amber-500',
    Icon: HiOutlinePencilSquare,
  },
  'EDITAR:PACIENTE': {
    title: 'Información de paciente editada',
    bg: 'bg-amber-500',
    Icon: HiOutlinePencilSquare,
  },
  'EDITAR:USUARIO': {
    title: 'Información de usuario editada',
    bg: 'bg-amber-500',
    Icon: HiOutlinePencilSquare,
  },
  'ELIMINAR:PACIENTE': {
    title: 'Paciente eliminado',
    bg: 'bg-red-500',
    Icon: HiOutlineTrash,
  },
  'ELIMINAR:NOTA_MEDICA': {
    title: 'Nota médica eliminada',
    bg: 'bg-red-500',
    Icon: HiOutlineTrash,
  },
  'ELIMINAR:EXPEDIENTE_MEDICO': {
    title: 'Historia médica eliminada',
    bg: 'bg-red-500',
    Icon: HiOutlineTrash,
  },
}

const ENTITY_LABEL = {
  PACIENTE: 'Paciente',
  NOTA_MEDICA: 'Nota',
  EXPEDIENTE_MEDICO: 'Historia',
  EMERGENCIA: 'Emergencia',
  USUARIO: 'Usuario',
}

function formatActivityDate(fechaHora) {
  if (!fechaHora) return '—'
  return dayjs(fechaHora).locale(es).format('DD MMM YYYY [•] HH:mm')
}

export default function ActivityCard({
  activity,
  layout = 'list',
  isLast = false,
}) {
  const { accion, entidad, objetivo_nombre, fecha_hora } = activity

  const cfg = ACTIVITY_CONFIG[`${accion}:${entidad}`] ?? {
    title: `${accion} ${entidad}`,
    bg: 'bg-zinc-400',
    Icon: HiOutlineDocumentText,
  }

  const { title, bg, Icon } = cfg
  const entityLabel = ENTITY_LABEL[entidad] ?? entidad
  const dateStr = formatActivityDate(fecha_hora)

  // ── Timeline / list mode ─────────────────────────────────────────
  if (layout === 'list') {
    return (
      <div className="flex gap-4">
        {/* Left: icon + connector line */}
        <div className="flex flex-col items-center">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${bg}`}
          >
            <Icon size={18} className="text-white" />
          </div>
          {!isLast && <div className="mt-2 w-px flex-1 bg-gray-200" />}
        </div>

        {/* Right: card */}
        <div className={`flex-1 ${!isLast ? 'mb-5' : ''}`}>
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-5 font-semibold text-zinc-800">{title}</p>
            {objetivo_nombre && (
              <p className="text-5 mt-1 text-zinc-500">
                {entityLabel}: {objetivo_nombre}
              </p>
            )}
            <time className="text-6 mt-2 block text-zinc-400">{dateStr}</time>
          </div>
        </div>
      </div>
    )
  }

  // ── Grid mode ────────────────────────────────────────────────────
  return (
    <article className="flex h-[160px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-start gap-3 px-4 pt-4 pb-2">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bg}`}
        >
          <Icon size={14} className="text-white" />
        </div>
        <p className="text-5 line-clamp-2 leading-tight font-semibold text-zinc-800">
          {title}
        </p>
      </div>
      <div className="flex-1 px-4 pb-1">
        {objetivo_nombre && (
          <p className="text-6 truncate text-zinc-500">
            {entityLabel}: {objetivo_nombre}
          </p>
        )}
      </div>
      <div className="shrink-0 border-t border-gray-100 px-4 py-2.5">
        <time className="text-6 font-mono text-zinc-400">{dateStr}</time>
      </div>
    </article>
  )
}
