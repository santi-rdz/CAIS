import Button from '@components/Button'
import DangerConfirm from '@components/DangerConfirm'
import Modal from '@components/Modal'
import RowActionsMenu from '@components/RowActionsMenu'
import Table from '@components/Table'
import { HiOutlineTrash, HiArrowRight } from 'react-icons/hi2'
import { useDeletePatient } from '../hooks/useDeletePatient'
import { useNavigate } from 'react-router'
import DateTime from '@components/DateTime'
import BirthDate from '@components/BirthDate'
import PersonCell from '@components/PersonCell'

export default function PatientRow({ patient }) {
  const {
    id,
    nombre,
    apellidos,
    actualizado_at,
    fecha_nacimiento,
    genero,
    telefono,
    correo,
  } = patient

  const fullName = [nombre, apellidos].filter(Boolean).join(' ')
  const { deletePatient, isDeleting } = useDeletePatient()
  const navigate = useNavigate()

  return (
    <Table.Row onClick={() => navigate(`/pacientes/${id}`)}>
      <span className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-green-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-y-0 right-16 flex translate-x-2 items-center opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        <span className="text-6 flex items-center gap-1.5 rounded-full bg-green-800 px-3 py-1.5 font-medium text-white shadow-sm">
          Ver detalles
          <span className="animate-nudge-x">
            <HiArrowRight size={11} />
          </span>
        </span>
      </span>
      <PersonCell
        name={fullName}
        secondary={telefono ?? correo}
        avatar={<PersonCell.PatientAvatar />}
      />
      <DateTime value={actualizado_at} />
      <BirthDate value={fecha_nacimiento} />
      <div>{genero}</div>
      <Modal>
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
        <Modal.Content
          name="delete-patient"
          variant="alert"
          icon={<HiOutlineTrash size={24} />}
        >
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
