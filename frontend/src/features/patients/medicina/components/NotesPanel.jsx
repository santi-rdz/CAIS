import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  HiOutlinePlus,
  HiOutlineClipboardDocument,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
} from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'
import { useEvolutionNotes } from '@features/patients/medicina/hooks/useEvolutionNotes'
import { useEvolutionNote } from '@features/patients/medicina/hooks/useEvolutionNote'
import { useMedicalHistories } from '@features/patients/medicina/hooks/useMedicalHistories'
import { formatFecha } from '@lib/dateHelpers'
import HistoriaPeriodSelect from '@features/patients/medicina/components/HistoriaPeriodSelect'
import NoteCard from '@features/patients/medicina/components/NoteCard'
import NoteDetail from '@features/patients/medicina/components/NoteDetail'
import EmptyState from '@components/EmptyState'
import EvolutionNoteForm from '@features/patients/medicina/forms/EvolutionNoteForm/EvolutionNoteForm'

function formatHistoriaOption(h) {
  return { value: h.id, label: formatFecha(h.creado_at) }
}

export default function NotesPanel({ pacienteId, patientGenero }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { histories } = useMedicalHistories(pacienteId)
  const [layout, setLayout] = useState('grid')
  const [noteToEditId, setNoteToEditId] = useState(null)

  const selectedId = searchParams.get('historia')
  const mostRecentId = histories[0]?.id ?? null
  const historiaId = selectedId ?? mostRecentId

  const { notes, isPending } = useEvolutionNotes(pacienteId, historiaId)
  const selectedNoteId = searchParams.get('nota') ?? null
  const openModalRef = useRef(null)

  const { note: selectedNote, isPending: isSelectedPending } = useEvolutionNote(selectedNoteId)
  const { note: noteToEdit } = useEvolutionNote(noteToEditId)

  const periodos = histories.map(formatHistoriaOption)

  function setSelectedNoteId(id) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (id) next.set('nota', id)
        else next.delete('nota')
        return next
      },
      { replace: true }
    )
  }

  function handleSelectHistory(id) {
    setSearchParams({ historia: id }, { replace: true })
  }

  function handleOpenEdit(note, { showDetail = false } = {}) {
    if (showDetail) setSelectedNoteId(note.id)
    setNoteToEditId(note.id)
    openModalRef.current?.click()
  }

  function handleCloseNoteModal() {
    setNoteToEditId(null)
  }

  return (
    <div>
      <Modal>
        <div className="mb-4 flex items-center justify-between gap-4">
          {periodos.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-6 text-zinc-400">Historia médica</span>
              <HistoriaPeriodSelect
                value={historiaId}
                onChange={handleSelectHistory}
                periodos={periodos}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Layout Toggle Buttons */}
            <div className="flex gap-1 rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                className={`rounded p-2 text-gray-500 transition-colors ${
                  layout === 'grid' ? 'bg-gray-100 text-gray-700' : 'hover:bg-gray-50'
                }`}
                aria-label="Vista en grid"
                onClick={() => setLayout('grid')}
              >
                <HiOutlineSquares2X2 size={16} />
              </button>
              <button
                type="button"
                className={`rounded p-2 text-gray-500 transition-colors ${
                  layout === 'list' ? 'bg-gray-100 text-gray-700' : 'hover:bg-gray-50'
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
                onClick={() => setNoteToEditId(null)}
                disabled={!historiaId}
                data-testid="create-note-btn"
              >
                <HiOutlinePlus size={14} />
                Nueva nota
              </Button>
            </Modal.Open>
          </div>
          <Modal.Open opens="create-note">
            <button
              ref={openModalRef}
              type="button"
              className="hidden"
              tabIndex={-1}
              aria-label="Abrir modal de nota"
            />
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-[220px] animate-pulse rounded-xl bg-zinc-100" />
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
          onEdit={() => handleOpenEdit({ id: selectedNoteId }, { showDetail: true })}
        />
      ) : selectedNoteId && isSelectedPending ? (
        <div className="h-[400px] animate-pulse rounded-xl bg-zinc-100" />
      ) : (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3'
              : 'flex flex-col gap-3'
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
