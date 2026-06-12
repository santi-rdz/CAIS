import { usePatientHistoria } from '@features/patients/hooks/usePatientHistoria'
import PatientHistoriaShell from '@features/patients/components/PatientHistoriaShell'
import { useMedicalHistories } from '@features/patients/medicina/hooks/useMedicalHistories'
import { useMedicalHistory } from '@features/patients/medicina/hooks/useMedicalHistory'
import MedicalPatientForm from '@features/patients/medicina/forms/MedicalPatientForm/MedicalPatientForm'
import {
  buildAntPatFields,
  buildAntFamFields,
  buildAparSistFields,
} from '@features/patients/medicina/constants'
import FieldsSection from '@features/patients/medicina/sections/FieldsSection'
import SignosVitalesSection from '@features/patients/medicina/sections/SignosVitalesSection'
import NoPatologicosSection from '@features/patients/medicina/sections/NoPatologicosSection'
import ConsultaYPlanSection from '@features/patients/medicina/sections/ConsultaYPlanSection'

// Tab de la vista → step de la modal (CLONE_STEPS: omite Identificación →
// Heredofamiliares es el step 0).
const TAB_TO_STEP = {
  heredofamiliares: 0,
  'no-patologicos': 1,
  patologicos: 2,
  aparatos: 3,
  exploracion: 4,
  'consulta-plan': 5,
}

const TABS = [
  {
    value: 'heredofamiliares',
    label: 'Heredofamiliares',
    render: (h) => <FieldsSection fields={buildAntFamFields(h.antecedentes_familiares)} />,
  },
  {
    value: 'no-patologicos',
    label: 'No Patológicos',
    render: (h) => <NoPatologicosSection historia={h} />,
  },
  {
    value: 'patologicos',
    label: 'Patológicos',
    render: (h) => (
      <FieldsSection fields={buildAntPatFields(h.antecedentes_patologicos)} cols={3} />
    ),
  },
  {
    value: 'aparatos',
    label: 'Aparatos y sistemas',
    render: (h) => <FieldsSection fields={buildAparSistFields(h.aparatos_sistemas)} cols={3} />,
  },
  {
    value: 'exploracion',
    label: 'Exploración física',
    render: (h) => <SignosVitalesSection info={h.informacion_fisica} />,
  },
  {
    value: 'consulta-plan',
    label: 'Consulta y Plan',
    render: (h) => <ConsultaYPlanSection historia={h} />,
  },
]

export default function PatientHistoria({ patient }) {
  const state = usePatientHistoria({
    useHistories: useMedicalHistories,
    useHistory: useMedicalHistory,
    periodField: 'creado_at',
    tabToStep: TAB_TO_STEP,
  })

  return (
    <PatientHistoriaShell
      patient={patient}
      periodLabel="Historia médica"
      FormComponent={MedicalPatientForm}
      tabs={TABS}
      emptyMessage="Sin historia médica registrada."
      errorMessage="No se pudo cargar la historia médica. Intenta de nuevo."
      {...state}
    />
  )
}
