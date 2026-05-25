import {
  HiOutlineDocumentText,
  HiOutlineClipboardDocument,
  HiOutlineExclamationTriangle,
  HiOutlineUserPlus,
  HiOutlineUser,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2'

export const ENTITY_STYLE = {
  NOTA_EVOLUCION: { icon: HiOutlineDocumentText, bg: 'bg-rose-50', text: 'text-rose-500' },
  HISTORIA_MEDICA: { icon: HiOutlineClipboardDocument, bg: 'bg-sky-100', text: 'text-sky-600' },
  EMERGENCIA: { icon: HiOutlineExclamationTriangle, bg: 'bg-amber-50', text: 'text-amber-500' },
  PACIENTE: { icon: HiOutlineUserPlus, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  USUARIO: { icon: HiOutlineUser, bg: 'bg-gray-100', text: 'text-gray-500' },
}

export const ACCION_STYLE_OVERRIDE = {
  ACTUALIZAR: { icon: HiOutlinePencilSquare, bg: 'bg-blue-50', text: 'text-blue-500' },
  ELIMINAR: { icon: HiOutlineTrash, bg: 'bg-rose-50', text: 'text-rose-500' },
  INICIAR_SESION: {
    icon: HiOutlineArrowRightOnRectangle,
    bg: 'bg-gray-100',
    text: 'text-gray-400',
  },
}

const FALLBACK = { icon: HiOutlineUser, bg: 'bg-gray-100', text: 'text-gray-400' }

export function getActivityStyle(accion, entidad) {
  return ACCION_STYLE_OVERRIDE[accion] ?? ENTITY_STYLE[entidad] ?? FALLBACK
}

export const ENTITY_LABEL = {
  NOTA_EVOLUCION: 'una nota de evolución',
  HISTORIA_MEDICA: 'una historia médica',
  PACIENTE: 'un paciente',
  EMERGENCIA: 'una emergencia',
  USUARIO: 'un usuario',
}

export const ACCION_LABEL = {
  CREAR: 'creó',
  ACTUALIZAR: 'actualizó',
  ELIMINAR: 'eliminó',
  INICIAR_SESION: 'inició sesión',
}

export function buildActivityTitle(accion, entidad) {
  if (accion === 'INICIAR_SESION') return 'inició sesión'
  const verb = ACCION_LABEL[accion] ?? accion
  const entity = ENTITY_LABEL[entidad] ?? entidad
  return `${verb} ${entity}`
}

export function buildActivityNavPath(item) {
  if (item.accion === 'ELIMINAR') return null
  if (!item.objetivo_id) return null
  switch (item.entidad) {
    case 'NOTA_EVOLUCION':
      return item.paciente_id
        ? `/pacientes/${item.paciente_id}?tab=notas&nota=${item.objetivo_id}`
        : null
    case 'HISTORIA_MEDICA':
      return item.paciente_id
        ? `/pacientes/${item.paciente_id}?tab=historia&historia=${item.objetivo_id}`
        : null
    case 'PACIENTE':
      return `/pacientes/${item.objetivo_id}`
    case 'EMERGENCIA':
      return `/emergencias/${item.objetivo_id}`
    case 'USUARIO':
      return `/usuarios/${item.objetivo_id}`
    default:
      return null
  }
}
