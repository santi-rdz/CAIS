import usePermissions from '@hooks/usePermissions'
import { PERMISSIONS } from '@lib/permissions'
import StatCard from '@features/dashboard/components/StatCard'
import {
  HiOutlineDocumentText,
  HiOutlineClipboardDocument,
  HiOutlineExclamationTriangle,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineScale,
  HiOutlineBeaker,
} from 'react-icons/hi2'

const MEDICINA_CARDS = (counts) => [
  {
    key: 'notas_evolucion',
    label: 'Notas de evolución',
    value: counts?.notas_evolucion,
    icon: <HiOutlineDocumentText size={18} />,
  },
  {
    key: 'historias_medicas',
    label: 'Historias médicas',
    value: counts?.historias_medicas,
    icon: <HiOutlineClipboardDocument size={18} />,
  },
  {
    key: 'emergencias',
    label: 'Emergencias',
    value: counts?.emergencias,
    icon: <HiOutlineExclamationTriangle size={18} />,
  },
]

const NUTRICION_CARDS = (counts) => [
  {
    key: 'historias_nutricion',
    label: 'Historias de nutrición',
    value: counts?.historias_nutricion,
    icon: <HiOutlineClipboardDocument size={18} />,
  },
  {
    key: 'eval_antropometricas',
    label: 'Evaluaciones antropométricas',
    value: counts?.eval_antropometricas,
    icon: <HiOutlineScale size={18} />,
  },
  {
    key: 'eval_nutricionales',
    label: 'Evaluaciones nutricionales',
    value: counts?.eval_nutricionales,
    icon: <HiOutlineBeaker size={18} />,
  },
]

const COMMON_CARDS = (counts, personal) => [
  {
    key: 'pacientes',
    label: personal ? 'Mis pacientes registrados' : 'Pacientes registrados',
    value: counts?.pacientes,
    icon: <HiOutlineUsers size={18} />,
  },
  {
    // Conteo en vivo — no depende del rango de tiempo.
    key: 'usuarios_conectados',
    label: 'Usuarios conectados',
    value: counts?.usuarios_conectados,
    icon: <HiOutlineUserGroup size={18} />,
    live: true,
  },
]

// Grilla de tarjetas de conteo. Elige las cards del área según permiso; el
// pasante ve stats personales y no el conteo global de usuarios conectados.
// `hideConnected` oculta "usuarios conectados" (dato en vivo, fuera de lugar en
// estadísticas); `extraCards` agrega tarjetas propias de la vista al final.
export default function StatCardsGrid({
  counts,
  loading,
  rangeCaption,
  hideConnected = false,
  extraCards = [],
}) {
  const { can, isPasante } = usePermissions()

  let areaCards = []
  if (can(PERMISSIONS.SEE_MEDICINA_STATS)) areaCards = MEDICINA_CARDS(counts)
  else if (can(PERMISSIONS.SEE_NUTRICION_STATS)) areaCards = NUTRICION_CARDS(counts)

  const commonCards = COMMON_CARDS(counts, isPasante).filter(
    (card) => card.key !== 'usuarios_conectados' || (!isPasante && !hideConnected)
  )

  const allCards = [...areaCards, ...commonCards, ...extraCards]

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${allCards.length}, minmax(0, 1fr))` }}
    >
      {allCards.map((card, i) => (
        <StatCard
          key={card.key}
          icon={card.icon}
          label={card.label}
          value={card.value}
          loading={loading}
          colorIndex={i}
          live={card.live}
          caption={card.caption ?? (card.live ? 'En vivo' : rangeCaption)}
        />
      ))}
    </div>
  )
}
