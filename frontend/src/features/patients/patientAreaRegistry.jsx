import {
  HiOutlineClipboardDocument,
  HiOutlinePencilSquare,
  HiOutlineIdentification,
} from 'react-icons/hi2'
import { AREAS } from '@cais/shared/constants/users'
import PersonalDataPanel from '@features/patients/components/PersonalDataPanel'
import PatientHistoria from '@features/patients/medicina/components/PatientHistoria'
import NotesPanel from '@features/patients/medicina/components/NotesPanel'
import MedicalPatientForm from '@features/patients/medicina/forms/MedicalPatientForm/MedicalPatientForm'
import PatientHistoriaNutricion from '@features/patients/nutricion/components/PatientHistoriaNutricion'
import NutritionPersonalDataPanel from '@features/patients/nutricion/components/NutritionPersonalDataPanel'
import NutritionPatientEditForm from '@features/patients/nutricion/components/NutritionPatientEditForm'

// Tab de datos personales — el panel cambia por área porque cada una captura
// distintos campos del paciente.
const makeDatosTab = (Panel) => ({
  value: 'datos',
  label: 'Datos personales',
  icon: <HiOutlineIdentification size={13} />,
  render: (patient) => <Panel patient={patient} />,
})

// Un registro por área: las tabs del detalle + el form de "Editar info del
// paciente". El editForm devuelve el elemento raíz que <Modal.Content> clona para
// inyectarle onCloseModal. Para agregar un área basta una entrada aquí.
const PATIENT_AREA = {
  [AREAS.MEDICINA]: {
    tabs: [
      {
        value: 'historia',
        label: 'Historia médica',
        icon: <HiOutlineClipboardDocument size={13} />,
        // NO incluye 'historia' (el período seleccionado): ese lo comparten
        // "Historia médica" y "Notas" a propósito, para que al cambiar de tab
        // sigas viendo el mismo período. Solo se limpia el tab interno.
        ownedParams: ['historiaTab'],
        render: (patient) => <PatientHistoria patient={patient} />,
      },
      {
        value: 'notas',
        label: 'Notas de evolución',
        icon: <HiOutlinePencilSquare size={13} />,
        ownedParams: ['nota', 'notaTab'],
        render: (patient) => <NotesPanel pacienteId={patient.id} patientGenero={patient.genero} />,
      },
      makeDatosTab(PersonalDataPanel),
    ],
    editForm: (patient) => <MedicalPatientForm patient={patient} patientOnly />,
  },
  [AREAS.NUTRICION]: {
    tabs: [
      {
        value: 'historia',
        label: 'Historia nutricional',
        icon: <HiOutlineClipboardDocument size={13} />,
        // No incluye 'historia' (compartido a propósito, ver nota en medicina).
        ownedParams: ['historiaTab', 'bioqEval', 'bioqTab'],
        render: (patient) => <PatientHistoriaNutricion patient={patient} />,
      },
      makeDatosTab(NutritionPersonalDataPanel),
    ],
    editForm: (patient) => <NutritionPatientEditForm patient={patient} />,
  },
}

// Devuelve la config del área del usuario; fallback a medicina.
export function getPatientArea(area) {
  return PATIENT_AREA[area] ?? PATIENT_AREA[AREAS.MEDICINA]
}
