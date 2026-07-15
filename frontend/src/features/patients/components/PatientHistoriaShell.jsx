import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineClipboardDocument,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2'
import Tab from '@components/Tab'
import Button from '@components/Button'
import Modal from '@components/Modal'
import HistoriaPeriodSelect from '@features/patients/components/HistoriaPeriodSelect'
import { cn } from '@lib/utils'

// Agrupa las tabs por su `group` preservando el orden de primera aparición.
function buildGroups(tabs) {
  const order = []
  const byGroup = new Map()
  for (const t of tabs) {
    const g = t.group ?? ''
    if (!byGroup.has(g)) {
      byGroup.set(g, [])
      order.push(g)
    }
    byGroup.get(g).push(t)
  }
  return order.map((label) => ({ label, tabs: byGroup.get(label) }))
}

// Estructura compartida de la pestaña de historia (selector de período + modales
// editar/nueva + tabs clínicas + estados de carga/error/vacío). Lo área-específico
// llega por props: el form (FormComponent), las tabs ({ value, label, render }) y
// los textos. El estado se inyecta desde usePatientHistoria.
export default function PatientHistoriaShell({
  patient,
  periodLabel,
  FormComponent,
  tabs,
  emptyMessage,
  errorMessage,
  // estado de usePatientHistoria:
  historia,
  cloneBase,
  activeId,
  periodos,
  isLoadingCloneBase,
  isLoadingList,
  isLoading,
  isError,
  handleSelectHistory,
  activeTab,
  setActiveTab,
  initialStep,
}) {
  const grouped = tabs.some((t) => t.group)
  // Un tab `bare` muestra su contenido sin la card (ej. Notas, que ya son cards).
  const activeBare = tabs.find((t) => t.value === activeTab)?.bare

  const tabContent = isLoading ? (
    <div className="space-y-3 py-2">
      {['85%', '70%', '92%', '55%'].map((w, i) => (
        <div key={i} className="h-5 animate-pulse rounded bg-zinc-100" style={{ width: w }} />
      ))}
    </div>
  ) : isError ? (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <HiOutlineExclamationCircle size={26} className="text-red-300" />
      <p className="text-5 text-zinc-500">{errorMessage}</p>
    </div>
  ) : !historia ? (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <HiOutlineClipboardDocument size={26} className="text-zinc-300" />
      <p className="text-5 text-zinc-500">{emptyMessage}</p>
    </div>
  ) : (
    tabs.map((t) => (
      <Tab.Panel key={t.value} value={t.value} scrollable={false}>
        {t.render(historia, patient)}
      </Tab.Panel>
    ))
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex items-center gap-2">
          {!isLoadingList && periodos.length > 0 && (
            <>
              <span className="text-6 text-zinc-400">{periodLabel}</span>
              <HistoriaPeriodSelect
                value={activeId}
                onChange={handleSelectHistory}
                periodos={periodos}
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isLoadingList && patient && (
            <>
              {historia && (
                <Modal.Open opens="edit-history">
                  <Button
                    variant="secondary"
                    size="md"
                    className="gap-1.5"
                    data-testid="edit-historia-btn"
                  >
                    <HiOutlinePencilSquare size={14} />
                    Editar historia
                  </Button>
                </Modal.Open>
              )}
              <Modal.Open opens="new-history">
                <Button
                  variant="primary"
                  size="md"
                  className="gap-1.5"
                  data-testid="new-historia-btn"
                  disabled={isLoadingCloneBase}
                >
                  <HiOutlinePlus size={14} />
                  Nueva historia
                </Button>
              </Modal.Open>
            </>
          )}
        </div>
      </div>

      <Modal.Content name="edit-history" size="xl" noPadding>
        {historia && patient && (
          <FormComponent
            patient={patient}
            historia={historia}
            historiaOnly
            initialStep={initialStep}
          />
        )}
      </Modal.Content>

      <Modal.Content name="new-history" size="xl" noPadding>
        {patient && !isLoadingCloneBase && (
          <FormComponent
            patient={patient}
            cloneHistoria={cloneBase ?? {}}
            onCreated={handleSelectHistory}
          />
        )}
      </Modal.Content>

      <Tab variant="underline" value={activeTab} onValueChange={setActiveTab}>
        {grouped ? (
          <div className="flex items-start gap-4 max-sm:flex-col max-sm:items-stretch">
            <aside className="shadow-card sticky top-4 w-56 shrink-0 self-start rounded-2xl border border-gray-100 bg-white p-3 max-sm:static max-sm:w-full">
              <nav className="space-y-6">
                {buildGroups(tabs).map((g) => (
                  <div key={g.label}>
                    <p className="text-7 mb-1.5 px-3 font-semibold tracking-wider text-zinc-400 uppercase">
                      {g.label}
                    </p>
                    <div className="space-y-0.5">
                      {g.tabs.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          aria-current={activeTab === t.value ? 'page' : undefined}
                          onClick={() => setActiveTab(t.value)}
                          data-testid={`tab-${t.value}`}
                          className={cn(
                            'text-5 flex w-full items-center rounded-lg px-3 py-2 text-left whitespace-nowrap transition-colors',
                            activeTab === t.value
                              ? 'bg-green-50 text-green-700'
                              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </aside>
            <div
              className={cn(
                'min-w-0 flex-1',
                !activeBare && 'shadow-card rounded-2xl border border-gray-100 bg-white p-5'
              )}
            >
              {tabContent}
            </div>
          </div>
        ) : (
          <div
            className={cn(!activeBare && 'shadow-card rounded-2xl border border-gray-100 bg-white')}
          >
            <Tab.List>
              {tabs.map((t) => (
                <Tab.Trigger key={t.value} value={t.value}>
                  {t.label}
                </Tab.Trigger>
              ))}
            </Tab.List>
            <div className={activeBare ? undefined : 'p-5'}>{tabContent}</div>
          </div>
        )}
      </Tab>
    </div>
  )
}
