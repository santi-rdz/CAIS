import { useRef, useState } from 'react'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2'
import { useUrlState } from '@hooks/useUrlState'
import { useEvalMonitoreo } from '@features/patients/nutricion/hooks/useEvalMonitoreo'
import MonitoreoCard from '@features/patients/nutricion/components/MonitoreoCard'
import MonitoreoDetail from '@features/patients/nutricion/components/MonitoreoDetail'
import Modal from '@components/Modal'
import Button from '@components/Button'
import Heading from '@components/Heading'
import EmptyState from '@components/EmptyState'
import DangerConfirm from '@components/DangerConfirm'

// Tab de monitoreo (sueño / actividad física): grid de cards → detalle →
// editar/eliminar, leyendo la data ya embebida en la historia (no por endpoint
// propio). `config` lo parametriza por recurso; la data (id UUID) permite
// seleccionar el registro por URL (?suenoEval / ?afEval).
export default function MonitoreoTab({ historia, config }) {
  const Icon = config.icon
  const FormComponent = config.FormComponent
  const rows = historia[config.rowsKey] ?? []
  const [selectedId, setSelectedId] = useUrlState(config.urlParam, null)
  const [editingRow, setEditingRow] = useState(null)
  const [deletingRow, setDeletingRow] = useState(null)
  const openRef = useRef(null)
  const deleteOpenRef = useRef(null)
  const monitoreo = useEvalMonitoreo(historia.id)
  const deleteEval = monitoreo[config.deleteFn]
  const isDeleting = monitoreo[config.isDeletingFlag]

  const selectedRow = selectedId ? (rows.find((r) => r.id === selectedId) ?? null) : null

  function handleAdd() {
    setEditingRow(null)
    openRef.current?.click()
  }

  function handleEdit(row) {
    setEditingRow(row)
    openRef.current?.click()
  }

  function handleDeleteRequest(row) {
    setDeletingRow(row)
    deleteOpenRef.current?.click()
  }

  async function handleConfirmDelete() {
    const wasSelected = selectedId === deletingRow.id
    if (wasSelected) setSelectedId(null)
    try {
      await deleteEval(deletingRow.id)
    } catch {
      if (wasSelected) setSelectedId(deletingRow.id)
    }
  }

  return (
    <Modal>
      <Modal.Open opens={config.formName}>
        <button ref={openRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>
      <Modal.Open opens={config.deleteName}>
        <button ref={deleteOpenRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>

      {selectedId && selectedRow ? (
        <MonitoreoDetail
          row={selectedRow}
          title={config.title}
          backLabel={config.backLabel}
          columns={config.columns}
          onBack={() => setSelectedId(null)}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      ) : selectedId ? (
        <EmptyState
          icon={<Icon size={24} />}
          message="No se encontró la evaluación"
          hint="Puede que haya sido eliminada."
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Heading as="h4">{config.title}</Heading>
            <Button type="button" size="sm" variant="primary" onClick={handleAdd}>
              <HiOutlinePlus size={13} strokeWidth={2.5} />
              Agregar
            </Button>
          </div>

          {rows.length === 0 ? (
            <EmptyState
              icon={<Icon size={24} />}
              message={config.emptyMessage}
              hint="Registra la primera evaluación de esta historia."
            />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {rows.map((row) => (
                <MonitoreoCard
                  key={row.id}
                  row={row}
                  icon={Icon}
                  summary={config.summary}
                  onView={(r) => setSelectedId(r.id)}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal.Content name={config.formName} size={config.modalSize} noPadding>
        <FormComponent
          key={editingRow?.id ?? `new-${config.urlParam}`}
          historiaId={historia.id}
          eval={editingRow ?? undefined}
          title={editingRow?.id ? config.formTitleEdit : config.formTitleNew}
        />
      </Modal.Content>

      <Modal.Content
        name={config.deleteName}
        noPadding
        variant="alert"
        icon={<HiOutlineTrash size={26} />}
      >
        <DangerConfirm
          title={config.deleteTitle}
          description="¿Estás seguro? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={handleConfirmDelete}
          isPending={isDeleting}
        />
      </Modal.Content>
    </Modal>
  )
}
