import { useParams } from 'react-router-dom'
import { useTabStep } from '@hooks/useTabStep'
import { useUrlState } from '@hooks/useUrlState'
import { formatFecha } from '@lib/dateHelpers'

/**
 * Lógica compartida de la visualización de historias por período (medicina y
 * nutrición): carga lista + detalle, resuelve la historia activa y la base para
 * clonar, y conecta la tab clínica activa con el step de la modal de edición.
 *
 * @param {object} cfg
 * @param {(pacienteId: string) => { histories, isPending, isError }} cfg.useHistories
 * @param {(id: string) => { historia, isPending, isError }} cfg.useHistory
 * @param {string} cfg.periodField - campo de fecha con que se etiqueta cada período
 * @param {Record<string, number>} cfg.tabToStep - tab de la vista → step de la modal
 */
export function usePatientHistoria({ useHistories, useHistory, periodField, tabToStep }) {
  const { id: pacienteId } = useParams()
  const [selectedId, setSelectedId] = useUrlState('historia', null)

  const { histories, isPending: isLoadingList, isError: isListError } = useHistories(pacienteId)

  const mostRecentId = histories[0]?.id ?? null
  const activeId = selectedId ?? mostRecentId

  const { historia, isPending: isLoadingDetail, isError: isDetailError } = useHistory(activeId)

  // Base para clonar: siempre la historia más reciente. Solo se carga aparte
  // cuando se está viendo un período que no es el más reciente; si no, reusamos
  // la historia activa ya cargada.
  const needsSeparateCloneBase = mostRecentId !== activeId
  const { historia: mostRecentHistoria, isPending: isCloneBasePending } = useHistory(
    needsSeparateCloneBase ? mostRecentId : null
  )
  const cloneBase = needsSeparateCloneBase ? mostRecentHistoria : historia

  // Solo está "cargando" cuando de verdad se busca la base aparte (o aún carga la
  // historia activa que la reusa). Una query deshabilitada reporta isPending=true
  // en react-query, así que no se puede usar isPending crudo aquí.
  const isLoadingCloneBase = needsSeparateCloneBase
    ? isCloneBasePending
    : activeId != null && isLoadingDetail

  const { activeTab, setActiveTab, initialStep } = useTabStep(tabToStep, undefined, 'historiaTab')

  function handleSelectHistory(id) {
    setSelectedId(id)
  }

  const periodos = histories.map((h) => ({
    value: h.id,
    label: h[periodField] ? formatFecha(h[periodField]) : 'N/A',
  }))

  return {
    historia,
    cloneBase,
    activeId,
    periodos,
    isLoadingCloneBase,
    isLoadingList,
    isLoading: isLoadingList || (activeId != null && isLoadingDetail),
    isError: isListError || isDetailError,
    handleSelectHistory,
    activeTab,
    setActiveTab,
    initialStep,
  }
}
