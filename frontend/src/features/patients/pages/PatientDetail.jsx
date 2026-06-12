import { useNavigate } from 'react-router-dom'
import { HiOutlineTrash } from 'react-icons/hi2'

import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import Tab from '@components/Tab'
import usePermissions from '@hooks/usePermissions'
import { usePatient } from '@features/patients/hooks/usePatient'
import { useDeletePatient } from '@features/patients/hooks/useDeletePatient'
import PatientActionBar from '@features/patients/components/PatientActionBar'
import PatientHeader from '@features/patients/components/PatientHeader'
import PatientSkeleton from '@features/patients/components/PatientSkeleton'
import { getPatientArea } from '@features/patients/patientAreaRegistry'

export default function PatientDetail() {
  const { patient, isPending } = usePatient()
  const { deletePatient, isDeleting } = useDeletePatient()
  const { area } = usePermissions()
  const navigate = useNavigate()

  if (isPending) return <PatientSkeleton />
  if (!patient) return null

  const { id } = patient
  const { tabs, editForm } = getPatientArea(area)

  return (
    <Modal>
      <div className="space-y-5">
        <PatientActionBar
          patientName={[patient.nombre, patient.apellidos].filter(Boolean).join(' ')}
          isDeleting={isDeleting}
        />
        <Tab defaultTab={tabs[0]?.value} syncUrl>
          <PatientHeader patient={patient} tabs={tabs} />
          <div className="mt-4 space-y-4">
            {tabs.map((tab) => (
              <Tab.Panel key={tab.value} value={tab.value} scrollable={false}>
                {tab.render(patient)}
              </Tab.Panel>
            ))}
          </div>
        </Tab>
      </div>

      <Modal.Content name="edit-patient" size="xl" noPadding>
        {editForm(patient)}
      </Modal.Content>

      <Modal.Content
        name="delete-patient"
        noPadding
        variant="alert"
        icon={<HiOutlineTrash size={26} />}
      >
        <DangerConfirm
          title="Eliminar paciente"
          description="¿Estás seguro? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={() => deletePatient(id).then(() => navigate('/pacientes'))}
          isPending={isDeleting}
        />
      </Modal.Content>
    </Modal>
  )
}
