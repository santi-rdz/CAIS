import { createContext, useCallback, use, useLayoutEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUrlState } from '@hooks/useUrlState'
import Heading from './Heading'

const TabContext = createContext()

/**
 * Contenedor principal. Maneja el tab activo y metadatos de cada trigger.
 * @param {string} defaultTab - value del tab activo por defecto
 * @param {boolean|string} [syncUrl] - sincroniza el tab activo con la URL.
 *   `true` usa `?tab=`; un string usa ese nombre de query param (necesario
 *   cuando hay tabs anidados en la misma vista y `?tab=` colisionaría).
 * @param {Record<string, string[]>} [paramGroups] - query params "propios" de
 *   cada tab (ej. `{ historia: ['historia','historiaTab'], notas: ['nota'] }`).
 *   Al cambiar de tab, se borran los params de los grupos que no son el activo
 *   — evita que la URL arrastre estado de una vista que ya no se muestra.
 * @param {'primary'|'secondary'} variant - estilo de los botones
 * @param {string} [value] - tab activo controlado (junto con onValueChange)
 * @param {(tab: string) => void} [onValueChange] - callback en modo controlado
 */
export default function Tab({
  children,
  defaultTab = '',
  syncUrl = false,
  paramGroups,
  variant = 'primary',
  value,
  onValueChange,
}) {
  const urlKey = syncUrl ? (typeof syncUrl === 'string' ? syncUrl : 'tab') : undefined
  const [urlTab, setUrlTab] = useUrlState(urlKey, defaultTab)
  const [, setSearchParams] = useSearchParams()
  const [localTab, setLocalTab] = useState(defaultTab)
  const [tabMeta, setTabMeta] = useState({})

  const isControlled = value != null
  // Controlado > syncUrl (?tab= o key custom) > estado local.
  const activeTab = isControlled ? value : syncUrl ? urlTab : localTab

  const handleSetActiveTab = useCallback(
    (tab) => {
      if (isControlled) {
        onValueChange?.(tab)
      } else if (syncUrl && paramGroups) {
        // Set + limpieza en un solo setSearchParams para no perder ninguno de
        // los dos updates por una carrera entre llamadas síncronas separadas.
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev)
            next.set(urlKey, tab)
            Object.entries(paramGroups).forEach(([groupTab, keys]) => {
              if (groupTab !== tab) keys.forEach((k) => next.delete(k))
            })
            return next
          },
          { replace: true }
        )
      } else if (syncUrl) {
        setUrlTab(tab)
      } else {
        setLocalTab(tab)
      }
    },
    [isControlled, onValueChange, syncUrl, setUrlTab, paramGroups, urlKey, setSearchParams]
  )

  const registerTrigger = useCallback((value, meta) => {
    setTabMeta((prev) => {
      if (prev[value]?.title === meta.title && prev[value]?.desc === meta.desc) return prev
      return { ...prev, [value]: meta }
    })
  }, [])

  const contextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab: handleSetActiveTab,
      variant,
      tabMeta,
      registerTrigger,
    }),
    [activeTab, handleSetActiveTab, variant, tabMeta, registerTrigger]
  )

  return <TabContext.Provider value={contextValue}>{children}</TabContext.Provider>
}

/** Wrapper del encabezado del modal. Padding inferior reducido para que Tab.List quede ajustado. */
Tab.Header = function TabHeader({ children }) {
  return (
    <header className="shrink-0 space-y-1 border-b border-b-neutral-200 px-(--mpx) py-(--mpy)">
      {children}
    </header>
  )
}

/** Muestra el título del tab activo (definido en Tab.Trigger via title prop) */
Tab.Title = function TabTitle() {
  const { activeTab, tabMeta } = use(TabContext)
  return <Heading as="h2">{tabMeta[activeTab]?.title ?? ''}</Heading>
}

/** Muestra la descripción del tab activo (definida en Tab.Trigger via desc prop) */
Tab.Description = function TabDescription() {
  const { activeTab, tabMeta } = use(TabContext)
  const desc = tabMeta[activeTab]?.desc
  if (!desc) return null
  return <p className="mt-2 text-sm text-gray-500">{desc}</p>
}

/**
 * Contenedor de los botones de tab.
 * Sin márgenes horizontales por defecto — pásalos via className si no va dentro de Tab.Header.
 * variant='underline' renderiza un nav scrollable con indicador de borde inferior.
 */
Tab.List = function TabList({ children, className = '' }) {
  const { variant } = use(TabContext)

  if (variant === 'underline') {
    return (
      <div className={`overflow-x-auto border-b border-gray-100 ${className}`}>
        <nav className="flex min-w-max px-(--mpx)">{children}</nav>
      </div>
    )
  }

  const outerStyle = variant === 'primary' ? 'mt-4' : 'mt-3 w-54'
  const navStyle = variant === 'primary' ? 'rounded-lg' : 'rounded-md'
  return (
    <div className={`overflow-x-auto ${outerStyle} ${className}`}>
      <nav className={`flex min-w-max shrink-0 gap-0.5 bg-gray-100 p-1 ${navStyle}`}>
        {children}
      </nav>
    </div>
  )
}

const TRIGGER_STYLES = {
  primary: {
    base: 'flex-1 whitespace-nowrap px-3 py-1.5 rounded-md duration-300',
    active: 'bg-green-800 text-white shadow-sm',
    inactive: 'text-gray-500 hover:bg-gray-200',
  },
  secondary: {
    base: 'flex-1 py-1.5 rounded-sm duration-300',
    active: 'bg-white text-green-800 shadow-sm',
    inactive: 'text-gray-500 hover:bg-gray-200',
  },
  underline: {
    base: 'whitespace-nowrap border-b-2 px-4 py-4 font-medium transition-colors duration-150',
    active: 'border-green-700 text-green-800',
    inactive: 'border-transparent text-zinc-400 hover:text-zinc-600',
  },
}

/**
 * Botón de tab individual.
 * @param {string} value - identificador único del tab
 * @param {string} [title] - título que Tab.Title mostrará cuando este tab esté activo
 * @param {string} [desc] - descripción que Tab.Description mostrará cuando esté activo
 */
Tab.Trigger = function TabTrigger({ value, title, desc, children, ...rest }) {
  const { activeTab, setActiveTab, variant, registerTrigger } = use(TabContext)

  useLayoutEffect(() => {
    if (title !== undefined || desc !== undefined) {
      registerTrigger(value, { title, desc })
    }
  }, [value, title, desc, registerTrigger])

  const isActive = activeTab === value
  const styles = TRIGGER_STYLES[variant] ?? TRIGGER_STYLES.primary
  const stateClass = isActive ? styles.active : styles.inactive

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={`text-5 cursor-pointer ${styles.base} ${stateClass}`}
      data-testid={`tab-${value}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/**
 * Contenido de un tab. Solo se renderiza cuando value === activeTab.
 * @param {string} value - debe coincidir con el value del Tab.Trigger correspondiente
 * @param {boolean} [scrollable=true] - si el panel maneja su propio scroll internamente, usar false
 */
Tab.Panel = function TabPanel({ value, children, scrollable = true }) {
  const { activeTab } = use(TabContext)
  if (activeTab !== value) return null
  return (
    <div className={`flex min-h-0 flex-1 flex-col ${scrollable ? 'overflow-y-auto' : ''}`}>
      {children}
    </div>
  )
}
