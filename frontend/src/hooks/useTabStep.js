import { useState } from 'react'
import { useUrlState } from '@hooks/useUrlState'

/**
 * Conecta una visualización por tabs con la modal multi-paso que la edita:
 * mantiene el tab activo y lo traduce al step correspondiente, para que "Editar"
 * abra la modal directo en la sección que el usuario está viendo.
 *
 * @param {Record<string, number>} tabToStep - mapa value-del-tab → índice de step
 * @param {string} [defaultTab] - tab inicial (por defecto, el primero del mapa)
 * @param {string} [urlKey] - si se pasa, el tab activo se sincroniza con ese
 *   query param (persiste entre refresh); si se omite, vive solo en memoria.
 * @returns {{ activeTab: string, setActiveTab: (tab: string) => void, initialStep: number }}
 */
export function useTabStep(tabToStep, defaultTab, urlKey) {
  if (!tabToStep || typeof tabToStep !== 'object') {
    throw new Error('useTabStep: tabToStep must be a non-null object')
  }

  const computedDefault = defaultTab ?? Object.keys(tabToStep)[0]
  const [urlTab, setUrlTab] = useUrlState(urlKey, computedDefault)
  const [localTab, setLocalTab] = useState(computedDefault)

  const activeTab = urlKey ? urlTab : localTab
  const setActiveTab = urlKey ? setUrlTab : setLocalTab
  const initialStep = tabToStep[activeTab] ?? 0

  return { activeTab, setActiveTab, initialStep }
}
