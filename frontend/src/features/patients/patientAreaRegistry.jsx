import { HiOutlineClipboardDocument, HiOutlineIdentification } from 'react-icons/hi2'
import { AREAS } from '@cais/shared/constants/users'
import PersonalDataPanel from '@features/patients/components/PersonalDataPanel'
import PatientHistoria from '@features/patients/medicina/components/PatientHistoria'
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
        // NO incluye 'historia' (el período): al salir del detalle se conserva.
        // 'nota'/'notaTab' son de las Notas de evolución, que ahora viven en el
        // sidebar de la historia, así que se limpian junto con el tab interno.
        ownedParams: ['historiaTab', 'nota', 'notaTab'],
        render: (patient) => <PatientHistoria patient={patient} />,
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
