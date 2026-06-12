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
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
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

      <div className="shadow-card rounded-2xl border border-gray-100 bg-white">
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
          <Tab.List>
            {tabs.map((t) => (
              <Tab.Trigger key={t.value} value={t.value}>
                {t.label}
              </Tab.Trigger>
            ))}
          </Tab.List>

          <div className="p-5">
            {isLoading ? (
              <div className="space-y-3 py-2">
                {['85%', '70%', '92%', '55%'].map((w, i) => (
                  <div
                    key={i}
                    className="h-5 animate-pulse rounded bg-zinc-100"
                    style={{ width: w }}
                  />
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
                  {t.render(historia)}
                </Tab.Panel>
              ))
            )}
          </div>
        </Tab>
      </div>
    </div>
  )
}
