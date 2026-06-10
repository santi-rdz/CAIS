import { useNavigate } from 'react-router-dom'
import { HiOutlineTrash } from 'react-icons/hi2'

import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import Tab from '@components/Tab'
import { usePatient } from '@features/patients/hooks/usePatient'
import { useDeletePatient } from '@features/patients/hooks/useDeletePatient'
import PatientActionBar from '@features/patients/components/PatientActionBar'
import PatientHeader from '@features/patients/components/PatientHeader'
import NotesPanel from '@features/patients/medicina/components/NotesPanel'
import PersonalDataPanel from '@features/patients/components/PersonalDataPanel'
import PatientSkeleton from '@features/patients/components/PatientSkeleton'
import PatientHistoria from '@features/patients/medicina/components/PatientHistoria'
import MedicalPatientForm from '@features/patients/medicina/forms/MedicalPatientForm/MedicalPatientForm'

export default function PatientDetail() {
  const { patient, isPending } = usePatient()
  const { deletePatient, isDeleting } = useDeletePatient()
  const navigate = useNavigate()

  if (isPending) return <PatientSkeleton />
  if (!patient) return null

  const { id } = patient

  return (
    <Modal>
      <div className="space-y-5">
        <PatientActionBar
          patientName={[patient.nombre, patient.apellidos].filter(Boolean).join(' ')}
          isDeleting={isDeleting}
        />
        <Tab defaultTab="historia" syncUrl>
          <PatientHeader patient={patient} />
          <div className="mt-4 space-y-4">
            <Tab.Panel value="historia" scrollable={false}>
              <PatientHistoria patient={patient} />
            </Tab.Panel>
            <Tab.Panel value="notas" scrollable={false}>
              <NotesPanel pacienteId={id} patientGenero={patient.genero} />
            </Tab.Panel>
            <Tab.Panel value="datos" scrollable={false}>
              <PersonalDataPanel patient={patient} />
            </Tab.Panel>
          </div>
        </Tab>
      </div>

      <Modal.Content name="edit-patient" size="xl" noPadding>
        <MedicalPatientForm patient={patient} patientOnly />
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
