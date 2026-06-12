import { useParams, useSearchParams } from 'react-router-dom'
import { useTabStep } from '@hooks/useTabStep'
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
  const [searchParams, setSearchParams] = useSearchParams()

  const { histories, isPending: isLoadingList, isError: isListError } = useHistories(pacienteId)

  const selectedId = searchParams.get('historia')
  const mostRecentId = histories[0]?.id ?? null
  const activeId = selectedId ?? mostRecentId

  const { historia, isPending: isLoadingDetail, isError: isDetailError } = useHistory(activeId)

  // Base para clonar: siempre la historia más reciente. Solo se carga aparte
  // cuando se está viendo un período que no es el más reciente.
  const { historia: mostRecentHistoria } = useHistory(
    mostRecentId !== activeId ? mostRecentId : null
  )
  const cloneBase = mostRecentId !== activeId ? mostRecentHistoria : historia

  const { activeTab, setActiveTab, initialStep } = useTabStep(tabToStep)

  // Conserva los demás query params (ej. el ?tab= de los tabs externos url-sync'd).
  function handleSelectHistory(id) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('historia', id)
        return next
      },
      { replace: true }
    )
  }

  const periodos = histories.map((h) => ({ value: h.id, label: formatFecha(h[periodField]) }))

  return {
    historia,
    cloneBase,
    activeId,
    periodos,
    isLoadingList,
    isLoading: isLoadingList || (activeId != null && isLoadingDetail),
    isError: isListError || isDetailError,
    handleSelectHistory,
    activeTab,
    setActiveTab,
    initialStep,
  }
}
