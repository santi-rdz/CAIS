import { useState } from 'react'
import { HiOutlinePlus, HiOutlineClipboardDocument } from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'
import { useEvolutionNotes } from '../hooks/useEvolutionNotes'
import NoteCard from './NoteCard'
import NoteDetail from './NoteDetail'
import EmptyState from './EmptyState'
import EvolutionNoteForm from './EvolutionNoteForm/EvolutionNoteForm'

export default function NotesPanel({ pacienteId, patientGenero }) {
  const { notes, isPending } = useEvolutionNotes(pacienteId)
  const [selectedNote, setSelectedNote] = useState(null)

  return (
    <div>
      <Modal>
        <div className="mb-4 flex justify-end">
          <Modal.Open opens="create-note">
            <Button variant="primary" size="md" className="gap-1.5">
              <HiOutlinePlus size={14} />
              Nueva nota
            </Button>
          </Modal.Open>
        </div>

        <Modal.Content name="create-note" size="xl" noPadding>
          <EvolutionNoteForm
            pacienteId={pacienteId}
            patientGenero={patientGenero}
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
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<HiOutlineClipboardDocument size={24} />}
          message="Sin notas de evolución"
          hint="Registra la primera nota de esta consulta."
        />
      ) : selectedNote ? (
        <NoteDetail note={selectedNote} onBack={() => setSelectedNote(null)} />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNote(note)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
