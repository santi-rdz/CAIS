import { useRef, useState } from 'react'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2'
import { useUrlState } from '@hooks/useUrlState'
import Modal from '@components/Modal'
import Button from '@components/Button'
import Heading from '@components/Heading'
import EmptyState from '@components/EmptyState'
import DangerConfirm from '@components/DangerConfirm'

// Tab de un recurso con endpoint propio: lista + detalle + form cargados por id
// (no embebidos en la historia), así el fetch ocurre solo al montar el tab
// (Tab.Panel desmonta los inactivos). `config` lo parametriza por recurso —
// generaliza lo que antes eran 3 componentes casi idénticos (bioquímica,
// nutricional, examen físico).
//
// config:
//   urlParam                 param de URL para el registro seleccionado
//   itemProp                 nombre de la prop que Card/Detail/Form esperan ('evaluation' | 'exam')
//   useList/useItem/useDelete hooks del recurso
//   listKey/itemKey/deleteKey clave del valor dentro del retorno de cada hook
//   Card/Detail/Form         componentes del recurso
//   icon, title              ícono + encabezado del tab
//   formName/deleteName      nombres de los Modal.Content
//   deleteTitle              título del confirm de borrado
//   listSkeletonHeight       alto del skeleton de las cards
//   messages                 { loadError, listError, emptyMessage, emptyHint, editError }
export default function EndpointEvalTab({ historia, patient, config }) {
  const {
    urlParam,
    itemProp,
    listKey,
    itemKey,
    deleteKey,
    Card,
    Detail,
    Form,
    icon: Icon,
    title,
    formName,
    deleteName,
    deleteTitle,
    listSkeletonHeight = 'h-[84px]',
    messages,
  } = config

  // Alias `use*` para que las reglas de hooks reconozcan las llamadas.
  const useList = config.useList
  const useItem = config.useItem
  const useDelete = config.useDelete

  const [selectedId, setSelectedId] = useUrlState(urlParam, null)
  const [editingId, setEditingId] = useState(null)
  const [editingStep, setEditingStep] = useState(0)
  // Contexto opcional que el Detail puede pasar al abrir el form (ej. el índice de
  // sub-registro a editar). Los forms que no lo usan lo ignoran.
  const [editingContext, setEditingContext] = useState(null)
  const [deletingRow, setDeletingRow] = useState(null)
  const openRef = useRef(null)
  const deleteOpenRef = useRef(null)

  const list = useList(historia.id)
  const items = list[listKey] ?? []

  const selected = useItem(selectedId)
  const selectedItem = selected[itemKey]

  const editing = useItem(editingId)
  const editingItem = editing[itemKey]

  const del = useDelete(historia.id)
  const deleteItem = del[deleteKey]
  const isDeleting = del.isDeleting

  const itemPropFor = (item) => ({ [itemProp]: item })

  function handleAdd() {
    setEditingId(null)
    setEditingStep(0)
    setEditingContext(null)
    openRef.current?.click()
  }

  function handleEdit(row, step = 0, context = null) {
    setEditingId(row.id)
    setEditingStep(step)
    setEditingContext(context)
    openRef.current?.click()
  }

  function handleDeleteRequest(row) {
    setDeletingRow(row)
    deleteOpenRef.current?.click()
  }

  async function handleConfirmDelete() {
    const wasSelected = selectedId === deletingRow.id
    // Sale del detalle ANTES del await: si se queda, la invalidación del hook de
    // borrado refetchea el detalle recién eliminado (404).
    if (wasSelected) setSelectedId(null)
    try {
      await deleteItem(deletingRow.id)
    } catch {
      if (wasSelected) setSelectedId(deletingRow.id)
    }
  }

  return (
    <Modal>
      <Modal.Open opens={formName}>
        <button ref={openRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>
      <Modal.Open opens={deleteName}>
        <button ref={deleteOpenRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>

      {selectedId ? (
        selected.isPending ? (
          <div className="h-[400px] animate-pulse rounded-xl bg-zinc-100" />
        ) : selected.isError || !selectedItem ? (
          <EmptyState
            icon={<Icon size={24} />}
            message={messages.loadError}
            hint="Intenta de nuevo más tarde."
          />
        ) : (
          <Detail
            {...itemPropFor(selectedItem)}
            patient={patient}
            onBack={() => setSelectedId(null)}
            onEdit={(step, context) => handleEdit(selectedItem, step, context)}
            onDelete={handleDeleteRequest}
          />
        )
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Heading as="h4">{title}</Heading>
            <Button type="button" size="sm" variant="primary" onClick={handleAdd}>
              <HiOutlinePlus size={13} strokeWidth={2.5} />
              Agregar
            </Button>
          </div>

          {list.isPending ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`${listSkeletonHeight} animate-pulse rounded-xl bg-zinc-100`}
                />
              ))}
            </div>
          ) : list.isError ? (
            <EmptyState
              icon={<Icon size={24} />}
              message={messages.listError}
              hint="Intenta de nuevo más tarde."
            />
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Icon size={24} />}
              message={messages.emptyMessage}
              hint={messages.emptyHint}
            />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  {...itemPropFor(item)}
                  onView={(row) => setSelectedId(row.id)}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal.Content name={formName} size="xl" noPadding>
        {editingId && editing.isPending ? (
          <div className="h-[400px] animate-pulse rounded-xl bg-zinc-100" />
        ) : editingId && editing.isError ? (
          <EmptyState
            icon={<Icon size={24} />}
            message={messages.editError}
            hint="Cierra el modal e intenta de nuevo."
          />
        ) : (
          <Form
            key={editingItem?.id ?? `new-${urlParam}`}
            historiaId={historia.id}
            patient={patient}
            {...itemPropFor(editingId ? editingItem : null)}
            initialStep={editingStep}
            editContext={editingContext}
          />
        )}
      </Modal.Content>

      <Modal.Content
        name={deleteName}
        noPadding
        variant="alert"
        icon={<HiOutlineTrash size={26} />}
      >
        <DangerConfirm
          title={deleteTitle}
          description="¿Estás seguro? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={handleConfirmDelete}
          isPending={isDeleting}
        />
      </Modal.Content>
    </Modal>
  )
}
