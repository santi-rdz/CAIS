import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  HiOutlinePlus,
  HiOutlineClipboardDocument,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
} from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'
import { useEvolutionNotes } from '../hooks/useEvolutionNotes'
import { useEvolutionNote } from '../hooks/useEvolutionNote'
import { useMedicalHistories } from '../hooks/useMedicalHistories'
import { formatFecha } from '@lib/dateHelpers'
import HistoriaPeriodSelect from './HistoriaPeriodSelect'
import NoteCard from './NoteCard'
import NoteDetail from './NoteDetail'
import EmptyState from '@components/EmptyState'
import EvolutionNoteForm from '../forms/EvolutionNoteForm/EvolutionNoteForm'

function formatHistoriaOption(h) {
  return { value: h.id, label: formatFecha(h.creado_at) }
}

export default function NotesPanel({ pacienteId, patientGenero }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { histories } = useMedicalHistories(pacienteId)
  const [layout, setLayout] = useState('grid')

  const selectedId = searchParams.get('historia')
  const editNoteId = searchParams.get('editNote')
  const mostRecentId = histories[0]?.id ?? null
  const historiaId = selectedId ?? mostRecentId

  const { notes, isPending } = useEvolutionNotes(pacienteId, historiaId)
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const openModalRef = useRef(null)

  const { note: selectedNote, isPending: isSelectedPending } =
    useEvolutionNote(selectedNoteId)
  const { note: noteToEdit } = useEvolutionNote(editNoteId)

  const periodos = histories.map(formatHistoriaOption)

  function handleSelectHistory(id) {
    setSearchParams({ historia: id }, { replace: true })
    setSelectedNoteId(null)
  }

  function handleOpenCreate() {
    const next = new URLSearchParams(searchParams)
    next.delete('editNote')
    setSearchParams(next, { replace: true })
  }

  function handleOpenEdit(note, { showDetail = false } = {}) {
    if (showDetail) setSelectedNoteId(note.id)
    const next = new URLSearchParams(searchParams)
    next.set('editNote', note.id)
    setSearchParams(next, { replace: true })
  }

  // Gate modal open until noteToEdit loads to avoid remount flash
  useEffect(() => {
    if (editNoteId && noteToEdit?.id === editNoteId) {
      openModalRef.current?.click()
    }
  }, [editNoteId, noteToEdit?.id])

  function handleCloseNoteModal() {
    const next = new URLSearchParams(searchParams)
    next.delete('editNote')
    setSearchParams(next, { replace: true })
  }

  return (
    <div>
      <Modal>
        <div className="mb-4 flex items-center justify-between gap-4">
          {periodos.length > 0 && (
            <HistoriaPeriodSelect
              value={historiaId}
              onChange={handleSelectHistory}
              periodos={periodos}
            />
          )}
          <div className="flex items-center gap-2">
            {/* Layout Toggle Buttons */}
            <div className="flex gap-1 rounded-lg border border-gray-200 p-1">
              <button
                className={`rounded p-2 text-gray-500 transition-colors ${
                  layout === 'grid'
                    ? 'bg-gray-100 text-gray-700'
                    : 'hover:bg-gray-50'
                }`}
                aria-label="Vista en grid"
                onClick={() => setLayout('grid')}
              >
                <HiOutlineSquares2X2 size={16} />
              </button>
              <button
                className={`rounded p-2 text-gray-500 transition-colors ${
                  layout === 'list'
                    ? 'bg-gray-100 text-gray-700'
                    : 'hover:bg-gray-50'
                }`}
                aria-label="Vista en lista"
                onClick={() => setLayout('list')}
              >
                <HiOutlineListBullet size={16} />
              </button>
            </div>

            <Modal.Open opens="create-note">
              <Button
                variant="primary"
                size="md"
                className="gap-1.5"
                onClick={handleOpenCreate}
                disabled={!historiaId}
              >
                <HiOutlinePlus size={14} />
                Nueva nota
              </Button>
            </Modal.Open>
          </div>
          <Modal.Open opens="create-note">
            <button ref={openModalRef} className="hidden" aria-hidden="true" />
          </Modal.Open>
        </div>

        <Modal.Content name="create-note" size="xl" noPadding>
          <EvolutionNoteForm
            key={`evolution-note-form-${noteToEdit?.id ?? 'new'}-${historiaId ?? 'none'}`}
            pacienteId={pacienteId}
            patientGenero={patientGenero}
            historiaId={historiaId}
            note={noteToEdit}
            onCloseModal={handleCloseNoteModal}
          />
        </Modal.Content>
      </Modal>

      {isPending ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-[176px] animate-pulse rounded-xl bg-zinc-100"
            />
          ))}
        </div>
      ) : !historiaId ? (
        <EmptyState
          icon={<HiOutlineClipboardDocument size={24} />}
          message="Sin historia médica"
          hint="Crea una historia médica para registrar notas de evolución."
        />
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<HiOutlineClipboardDocument size={24} />}
          message="Sin notas de evolución"
          hint="Registra la primera nota de esta consulta."
        />
      ) : selectedNoteId && !isSelectedPending && selectedNote ? (
        <NoteDetail
          note={selectedNote}
          onBack={() => setSelectedNoteId(null)}
          onEdit={() =>
            handleOpenEdit({ id: selectedNoteId }, { showDetail: true })
          }
        />
      ) : selectedNoteId && isSelectedPending ? (
        <div className="h-[400px] animate-pulse rounded-xl bg-zinc-100" />
      ) : (
        <div
          className={
            layout === 'grid'
              ? 'auto-fit-grid grid gap-3'
              : 'flex flex-col gap-3'
          }
          style={
            layout === 'grid'
              ? {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '12px',
                }
              : undefined
          }
        >
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNoteId(note.id)}
              onEdit={handleOpenEdit}
              isSelected={selectedNoteId === note.id}
              layout={layout}
            />
          ))}
        </div>
      )}
    </div>
  )
}
