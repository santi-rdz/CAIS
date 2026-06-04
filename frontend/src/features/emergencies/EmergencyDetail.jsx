import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import { formatFechaLong } from '@lib/dateHelpers'
import { HiOutlineTrash } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { useEmergency } from '@features/emergencies/hooks/useEmergency'
import { useDeleteEmergency } from '@features/emergencies/hooks/useDeleteEmergency'
import EmergencyForm from '@features/emergencies/EmergencyForm'
import ActionBar from '@features/emergencies/components/ActionBar'
import HeaderCard from '@features/emergencies/components/HeaderCard'
import PatientCard from '@features/emergencies/components/PatientCard'
import MedicalCard from '@features/emergencies/components/MedicalCard'
import Skeleton from '@features/emergencies/components/Skeleton'

export default function EmergencyDetail() {
  const { emergency, isPending } = useEmergency()
  const { deleteEmergency, isDeleting } = useDeleteEmergency()
  const navigate = useNavigate()

  if (isPending) return <Skeleton />
  if (!emergency) return null

  return (
    <Modal>
      <div className="space-y-6">
        <ActionBar emergencyDate={formatFechaLong(emergency.fecha_hora)} isDeleting={isDeleting} />
        <HeaderCard emergency={emergency} />
        <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
          <PatientCard emergency={emergency} />
          <MedicalCard emergency={emergency} />
        </div>
      </div>

      <Modal.Content name="edit-emergency" noPadding>
        <EmergencyForm emergency={emergency} />
      </Modal.Content>

      <Modal.Content
        name="delete-emergency"
        noPadding
        variant="alert"
        icon={<HiOutlineTrash size={26} />}
      >
        <DangerConfirm
          title="Eliminar emergencia"
          description="¿Estás seguro? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={() => deleteEmergency(emergency.id).then(() => navigate('/emergencias'))}
          isPending={isDeleting}
        />
      </Modal.Content>
    </Modal>
  )
}
