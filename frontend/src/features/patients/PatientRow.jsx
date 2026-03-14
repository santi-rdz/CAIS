import Button from '@ui/Button'
import DangerConfirm from '@ui/DangerConfirm'
import Modal from '@ui/Modal'
import RowActionsMenu from '@ui/RowActionsMenu'
import Table from '@ui/Table'
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi2'
import { useDeletePatient } from './hooks/useDeletePatient'
import { useNavigate } from 'react-router'
import { formatFecha } from '@lib/dateHelpers'
import DateTime from '@ui/DateTime'

export default function PatientRow({ patient }) {
  const { id, nombre, actualizado_at, fecha_nacimiento, genero } = patient
  const { deletePatient, isDeleting } = useDeletePatient()
  const navigate = useNavigate()
  console.log('PatientRow render', { patient })
  const handleVerDetalles = () => {
    navigate(`/pacientes/${id}`)
  }

  return (
    <Table.Row>
      <div>{nombre}</div>
      <DateTime value={actualizado_at} />
      <div>{formatFecha(fecha_nacimiento)}</div>
      <div>{genero}</div>
      <Modal variant="alert" icon={<HiOutlineTrash size={24} />}>
        <RowActionsMenu>
          <Button
            onClick={handleVerDetalles}
            variant="ghost"
            size="md"
            className="w-full justify-start"
          >
            <HiOutlineEye size={16} />
            Ver detalles
          </Button>
          <Modal.Open opens="delete-emergency">
            <Button variant="ghost" size="md" className="">
              <HiOutlineTrash size={16} />
              Eliminar emergencia
            </Button>
          </Modal.Open>
        </RowActionsMenu>
        <Modal.Content>
          <DangerConfirm
            title="Eliminar emergencia"
            description="¿Estás seguro de borrar a este usuario?"
            confirmLabel="Eliminar"
            onConfirm={() => deletePatient(id)}
            isPending={isDeleting}
          />
        </Modal.Content>
      </Modal>
    </Table.Row>
  )
}
