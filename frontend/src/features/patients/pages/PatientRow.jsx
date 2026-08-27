import Button from '@components/Button'
import DangerConfirm from '@components/DangerConfirm'
import Modal from '@components/Modal'
import RowActionsMenu from '@components/RowActionsMenu'
import Table from '@components/Table'
import { HiOutlineTrash } from 'react-icons/hi2'
import { useDeletePatient } from '@features/patients/hooks/useDeletePatient'
import { useNavigate } from 'react-router-dom'
import DateTime from '@components/DateTime'
import BirthDate from '@components/BirthDate'
import PersonCell from '@components/PersonCell'

export default function PatientRow({ patient }) {
  const { id, nombre, apellidos, updated_at, fecha_nacimiento, genero, telefono, correo } = patient

  const fullName = [nombre, apellidos].filter(Boolean).join(' ')
  const { deletePatient, isDeleting } = useDeletePatient()
  const navigate = useNavigate()

  return (
    <Table.Row onClick={() => navigate(`/pacientes/${id}`)} data-testid={`patient-row-${id}`}>
      <PersonCell
        name={fullName}
        secondary={telefono ?? correo}
        avatar={<PersonCell.PatientAvatar />}
      />
      <DateTime value={updated_at} />
      <BirthDate value={fecha_nacimiento} />
      <div className="font-medium text-zinc-700 capitalize">{genero ?? '---'}</div>

      <Modal>
        <RowActionsMenu>
          <Modal.Open opens="delete-patient">
            <Button
              variant="ghost"
              size="md"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={(e) => e.stopPropagation()}
            >
              <HiOutlineTrash size={16} />
              Eliminar paciente
            </Button>
          </Modal.Open>
        </RowActionsMenu>
        <Modal.Content name="delete-patient" variant="alert" icon={<HiOutlineTrash size={24} />}>
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
