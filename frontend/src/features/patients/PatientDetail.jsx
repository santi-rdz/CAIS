import { useNavigate } from 'react-router'
import { HiOutlineTrash } from 'react-icons/hi2'
import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import Tab from '@components/Tab'
import { usePatient } from './hooks/usePatient'
import { useDeletePatient } from './hooks/useDeletePatient'
import PatientActionBar from './components/PatientActionBar'
import PatientHeader from './components/PatientHeader'
import NotesPanel from './components/NotesPanel'
import PersonalDataPanel from './components/PersonalDataPanel'
import PatientSkeleton from './components/PatientSkeleton'
import PatientHistoria from './PatientHistoria'

export default function PatientDetail() {
  const { patient, isPending } = usePatient()
  const { deletePatient, isDeleting } = useDeletePatient()
  const navigate = useNavigate()

  if (isPending) return <PatientSkeleton />
  if (!patient) return null

  const { id } = patient

  return (
    <Modal variant="alert" icon={<HiOutlineTrash size={26} />}>
      <div className="space-y-5">
        <PatientActionBar
          onBack={() => navigate('/pacientes')}
          isDeleting={isDeleting}
        />
        <Tab defaultTab="historia">
          <PatientHeader patient={patient} />
          <div className="mt-4 space-y-4">
            <Tab.Panel value="historia" scrollable={false}>
              <PatientHistoria />
            </Tab.Panel>
            <Tab.Panel value="notas" scrollable={false}>
              <NotesPanel pacienteId={id} />
            </Tab.Panel>
            <Tab.Panel value="datos" scrollable={false}>
              <PersonalDataPanel patient={patient} />
            </Tab.Panel>
          </div>
        </Tab>
      </div>

      <Modal.Content name="delete-patient" noPadding>
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
