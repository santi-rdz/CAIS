import Button from '@components/Button'
import DangerConfirm from '@components/DangerConfirm'
import Modal from '@components/Modal'
import RowActionsMenu from '@components/RowActionsMenu'
import Table from '@components/Table'
import { HiOutlineTrash } from 'react-icons/hi2'
import { useDeletePatient } from './hooks/useDeletePatient'
import { useNavigate } from 'react-router'
import DateTime from '@components/DateTime'
import BirthDate from '@components/BirthDate'
import PersonCell from '@components/PersonCell'

export default function PatientRow({ patient }) {
  const { id, nombre, actualizado_at, fecha_nacimiento, genero, telefono, correo } = patient
  const { deletePatient, isDeleting } = useDeletePatient()
  const navigate = useNavigate()

  return (
    <Table.Row onClick={() => navigate(`/pacientes/${id}`)}>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <span className="text-6 flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-0.5 text-zinc-400 shadow-xs ring-1 ring-zinc-200/60">
          Ver detalles →
        </span>
      </span>
      <PersonCell
        name={nombre}
        secondary={telefono ?? correo}
        avatar={<PersonCell.PatientAvatar />}
      />
      <DateTime value={actualizado_at} />
      <BirthDate value={fecha_nacimiento} />
      <div>{genero}</div>
      <Modal variant="alert" icon={<HiOutlineTrash size={24} />}>
        <RowActionsMenu>
          <Modal.Open opens="delete-patient">
            <Button
              variant="ghost"
              size="md"
              className="w-full justify-start"
              onClick={(e) => e.stopPropagation()}
            >
              <HiOutlineTrash size={16} />
              Eliminar paciente
            </Button>
          </Modal.Open>
        </RowActionsMenu>
        <Modal.Content name="delete-patient">
          <DangerConfirm
            title="Eliminar paciente"
            description="¿Estás seguro de borrar a este paciente?"
            confirmLabel="Eliminar"
            onConfirm={() => deletePatient(id)}
            isPending={isDeleting}
          />
        </Modal.Content>
      </Modal>
    </Table.Row>
  )
}
