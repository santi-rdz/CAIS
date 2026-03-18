import { HiOutlinePlus, HiOutlineClipboardDocument } from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'
import { useEvolutionNotes } from '../hooks/useEvolutionNotes'
import NoteCard from './NoteCard'
import EmptyState from './EmptyState'

export default function NotesPanel({ pacienteId }) {
  const { notes, isPending } = useEvolutionNotes(pacienteId)

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Modal.Open opens="create-note">
          <Button variant="primary" size="md" className="gap-1.5">
            <HiOutlinePlus size={14} />
            Nueva nota
          </Button>
        </Modal.Open>
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-zinc-100"
            />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<HiOutlineClipboardDocument size={24} />}
          message="Sin notas de evolución"
          hint="Registra la primera nota de esta consulta."
        />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}
