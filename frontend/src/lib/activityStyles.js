import {
  HiOutlineDocumentText,
  HiOutlineClipboardDocument,
  HiOutlineExclamationTriangle,
  HiOutlineUserPlus,
  HiOutlineUser,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBeaker,
  HiOutlineMoon,
  HiOutlineHeart,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCalculator,
} from 'react-icons/hi2'

const ENTITY_STYLE = {
  NOTA_EVOLUCION: { icon: HiOutlineDocumentText, bg: 'bg-rose-50', text: 'text-rose-500' },
  HISTORIA_MEDICA: { icon: HiOutlineClipboardDocument, bg: 'bg-sky-100', text: 'text-sky-600' },
  HISTORIA_NUTRICION: {
    icon: HiOutlineClipboardDocument,
    bg: 'bg-teal-50',
    text: 'text-teal-600',
  },
  EVAL_BIOQ_NUTRICION: { icon: HiOutlineBeaker, bg: 'bg-teal-50', text: 'text-teal-600' },
  EVAL_NUTRICIONAL: {
    icon: HiOutlineClipboardDocumentCheck,
    bg: 'bg-teal-50',
    text: 'text-teal-600',
  },
  EVAL_ACT_FISICA_NUTRICION: { icon: HiOutlineHeart, bg: 'bg-teal-50', text: 'text-teal-600' },
  EVAL_CAL_SUENO: { icon: HiOutlineMoon, bg: 'bg-teal-50', text: 'text-teal-600' },
  EXAMINACION_FISICA: { icon: HiOutlineClipboardDocument, bg: 'bg-teal-50', text: 'text-teal-600' },
  EVAL_ANTROPOMETRICA: {
    icon: HiOutlineClipboardDocumentCheck,
    bg: 'bg-teal-50',
    text: 'text-teal-600',
  },
  REC_24H: { icon: HiOutlineDocumentText, bg: 'bg-teal-50', text: 'text-teal-600' },
  CAL_GET_NUTR: { icon: HiOutlineCalculator, bg: 'bg-teal-50', text: 'text-teal-600' },
  REPORTE_EEN: { icon: HiOutlineClipboardDocumentCheck, bg: 'bg-teal-50', text: 'text-teal-600' },
  TPAN: { icon: HiOutlineClipboardDocumentCheck, bg: 'bg-teal-50', text: 'text-teal-600' },
  EMERGENCIA: { icon: HiOutlineExclamationTriangle, bg: 'bg-amber-50', text: 'text-amber-500' },
  PACIENTE: { icon: HiOutlineUserPlus, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  USUARIO: { icon: HiOutlineUser, bg: 'bg-gray-100', text: 'text-gray-500' },
}

const ACCION_STYLE_OVERRIDE = {
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

const ENTITY_LABEL = {
  NOTA_EVOLUCION: 'una nota de evolución',
  HISTORIA_MEDICA: 'una historia médica',
  HISTORIA_NUTRICION: 'una historia de nutrición',
  EVAL_BIOQ_NUTRICION: 'una evaluación bioquímica',
  EVAL_NUTRICIONAL: 'una evaluación nutricional',
  EVAL_ACT_FISICA_NUTRICION: 'una evaluación de actividad física',
  EVAL_CAL_SUENO: 'una evaluación de calidad del sueño',
  EXAMINACION_FISICA: 'un examen físico de orientación',
  EVAL_ANTROPOMETRICA: 'una evaluación antropométrica',
  REC_24H: 'un recordatorio de 24 horas',
  CAL_GET_NUTR: 'un cálculo de gasto energético',
  REPORTE_EEN: 'un reporte EEN',
  TPAN: 'un TPAN',
  PACIENTE: 'un paciente',
  EMERGENCIA: 'una emergencia',
  USUARIO: 'un usuario',
}

const ACCION_LABEL = {
  CREAR: 'creó',
  ACTUALIZAR: 'actualizó',
  ELIMINAR: 'eliminó',
  INICIAR_SESION: 'inició sesión',
}

// Opciones del filtro de actividad según el área del usuario visto: cada área
// solo genera actividad de sus propias entidades.
const MEDICINA_FILTER = [
  { label: 'Nota de evolución', value: 'NOTA_EVOLUCION' },
  { label: 'Historia médica', value: 'HISTORIA_MEDICA' },
  { label: 'Emergencia', value: 'EMERGENCIA' },
]

const NUTRICION_FILTER = [
  { label: 'Historia de nutrición', value: 'HISTORIA_NUTRICION' },
  { label: 'Bioquímica', value: 'EVAL_BIOQ_NUTRICION' },
  { label: 'Evaluación nutricional', value: 'EVAL_NUTRICIONAL' },
  { label: 'Actividad física', value: 'EVAL_ACT_FISICA_NUTRICION' },
  { label: 'Calidad del sueño', value: 'EVAL_CAL_SUENO' },
  { label: 'Examen físico', value: 'EXAMINACION_FISICA' },
  { label: 'Antropometría', value: 'EVAL_ANTROPOMETRICA' },
  { label: 'Recordatorio 24h', value: 'REC_24H' },
  { label: 'Requerimientos (GET)', value: 'CAL_GET_NUTR' },
  { label: 'Reporte EEN', value: 'REPORTE_EEN' },
  { label: 'TPAN', value: 'TPAN' },
]

export function buildActivityFilterGroups(area) {
  const entities = area?.toUpperCase() === 'NUTRICION' ? NUTRICION_FILTER : MEDICINA_FILTER
  return [
    {
      label: 'Tipo de actividad',
      field: 'entidad',
      options: [...entities, { label: 'Paciente', value: 'PACIENTE' }],
    },
  ]
}

export function buildActivityTitle(accion, entidad) {
  if (accion === 'INICIAR_SESION') return 'inició sesión'
  const verb = ACCION_LABEL[accion] ?? accion
  const entity = ENTITY_LABEL[entidad] ?? entidad
  return `${verb} ${entity}`
}

// Evaluaciones de nutrición: cada una abre su sub-tab dentro de la historia
// (historiaTab) con el registro seleccionado (urlParam). Ver PatientHistoriaNutricion.
const NUTRICION_EVAL_TAB = {
  EVAL_CAL_SUENO: { tab: 'sueno', param: 'suenoEval' },
  EVAL_ACT_FISICA_NUTRICION: { tab: 'af', param: 'afEval' },
  EVAL_BIOQ_NUTRICION: { tab: 'bioquimica', param: 'bioqEval' },
  EXAMINACION_FISICA: { tab: 'examen', param: 'examEval' },
  EVAL_NUTRICIONAL: { tab: 'frecuencia', param: 'nutrEval' },
  CAL_GET_NUTR: { tab: 'calGet', param: 'calGetEval' },
  REPORTE_EEN: { tab: 'een', param: 'eenEval' },
  REC_24H: { tab: 'rec24h', param: 'recEval' },
  TPAN: { tab: 'tpan', param: 'tpanEval' },
  EVAL_ANTROPOMETRICA: { tab: 'antropometria', param: 'antroEval' },
}

export function buildActivityNavPath(item) {
  if (item.accion === 'ELIMINAR') return null
  if (!item.objetivo_id) return null

  const eval_ = NUTRICION_EVAL_TAB[item.entidad]
  if (eval_) {
    return item.paciente_id
      ? `/pacientes/${item.paciente_id}?tab=historia&historiaTab=${eval_.tab}&${eval_.param}=${item.objetivo_id}`
      : null
  }

  switch (item.entidad) {
    case 'NOTA_EVOLUCION':
      return item.paciente_id
        ? `/pacientes/${item.paciente_id}?tab=notas&nota=${item.objetivo_id}`
        : null
    case 'HISTORIA_MEDICA':
    case 'HISTORIA_NUTRICION':
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
