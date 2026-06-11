import {
  HiOutlineClipboardDocument,
  HiOutlinePencilSquare,
  HiOutlineIdentification,
} from 'react-icons/hi2'
import { AREAS } from '@cais/shared/constants/users'
import PersonalDataPanel from '@features/patients/components/PersonalDataPanel'
import PatientHistoria from '@features/patients/medicina/components/PatientHistoria'
import NotesPanel from '@features/patients/medicina/components/NotesPanel'
import PatientHistoriaNutricion from '@features/patients/nutricion/components/PatientHistoriaNutricion'

// Tab de datos personales: idéntico en todas las áreas (tabla `pacientes`).
const datosTab = {
  value: 'datos',
  label: 'Datos personales',
  icon: <HiOutlineIdentification size={13} />,
  render: (patient) => <PersonalDataPanel patient={patient} />,
}

// Registro de tabs por área. Cada tab define su trigger (label/icon) y el
// contenido a renderizar. Para agregar un área nueva basta con una entrada aquí.
const PATIENT_AREA_TABS = {
  [AREAS.MEDICINA]: [
    {
      value: 'historia',
      label: 'Historia médica',
      icon: <HiOutlineClipboardDocument size={13} />,
      render: (patient) => <PatientHistoria patient={patient} />,
    },
    {
      value: 'notas',
      label: 'Notas de evolución',
      icon: <HiOutlinePencilSquare size={13} />,
      render: (patient) => <NotesPanel pacienteId={patient.id} patientGenero={patient.genero} />,
    },
    datosTab,
  ],
  [AREAS.NUTRICION]: [
    {
      value: 'historia',
      label: 'Historia nutricional',
      icon: <HiOutlineClipboardDocument size={13} />,
      render: (patient) => <PatientHistoriaNutricion patient={patient} />,
    },
    datosTab,
  ],
}

// Devuelve los tabs del área del usuario; fallback a medicina.
export function getPatientAreaTabs(area) {
  return PATIENT_AREA_TABS[area] ?? PATIENT_AREA_TABS[AREAS.MEDICINA]
}
