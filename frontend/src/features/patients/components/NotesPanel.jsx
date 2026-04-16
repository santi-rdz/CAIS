import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { HiOutlinePlus, HiOutlineClipboardDocument } from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'
import { useEvolutionNotes } from '../hooks/useEvolutionNotes'
import { useMedicalHistories } from '../hooks/useMedicalHistories'
import { formatFecha } from '@lib/dateHelpers'
import HistoriaPeriodSelect from '../historia/components/HistoriaPeriodSelect'
import NoteCard from './NoteCard'
import NoteDetail from './NoteDetail'
import EmptyState from './EmptyState'
import EvolutionNoteForm from './EvolutionNoteForm/EvolutionNoteForm'

function formatHistoriaOption(h) {
  return { value: h.id, label: formatFecha(h.creado_at) }
}

export default function NotesPanel({ pacienteId, patientGenero }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { histories } = useMedicalHistories(pacienteId)

  const selectedId = searchParams.get('historia')
  const editNoteId = searchParams.get('editNote')
  const mostRecentId = histories[0]?.id ?? null
  const historiaId = selectedId ?? mostRecentId

  const { notes, isPending } = useEvolutionNotes(pacienteId, historiaId)
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteToEdit, setNoteToEdit] = useState(null)
  const openModalRef = useRef(null)
  const selectedNoteFresh = selectedNote
    ? (notes.find((note) => note.id === selectedNote.id) ?? null)
    : null

  const periodos = histories.map(formatHistoriaOption)

  useEffect(() => {
    if (!editNoteId) {
      setNoteToEdit(null)
      return
    }
    const noteFromList = notes.find((note) => note.id === editNoteId) ?? null
    if (noteFromList) setNoteToEdit(noteFromList)
  }, [editNoteId, notes])

  function handleSelectHistory(id) {
    setSearchParams({ historia: id }, { replace: true })
    setSelectedNote(null)
  }

  function handleOpenCreate() {
    const next = new URLSearchParams(searchParams)
    next.delete('editNote')
    setNoteToEdit(null)
    setSearchParams(next, { replace: true })
  }

  function handleOpenEdit(note, { showDetail = false } = {}) {
    if (showDetail) setSelectedNote(note)
    setNoteToEdit(note)
    const next = new URLSearchParams(searchParams)
    next.set('editNote', note.id)
    setSearchParams(next, { replace: true })
    openModalRef.current?.click()
  }

  function handleCloseNoteModal() {
    const next = new URLSearchParams(searchParams)
    next.delete('editNote')
    setNoteToEdit(null)
    setSearchParams(next, { replace: true })
  }

  return (
    <div>
      <Modal>
        <div className="mb-4 flex items-center justify-between">
          {periodos.length > 0 && (
            <HistoriaPeriodSelect
              value={historiaId}
              onChange={handleSelectHistory}
              periodos={periodos}
            />
          )}
          <Modal.Open opens="create-note">
            <Button
              variant="primary"
              size="md"
              className="gap-1.5"
              onClick={handleOpenCreate}
            >
              <HiOutlinePlus size={14} />
              Nueva nota
            </Button>
          </Modal.Open>
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
      ) : selectedNoteFresh ? (
        <NoteDetail
          note={selectedNoteFresh}
          onBack={() => setSelectedNote(null)}
          onEdit={() => handleOpenEdit(selectedNoteFresh, { showDetail: true })}
        />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNote(note)}
              onEdit={handleOpenEdit}
              isSelected={selectedNote?.id === note.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
