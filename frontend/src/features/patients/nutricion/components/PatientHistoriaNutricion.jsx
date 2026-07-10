import { HiOutlineClipboardDocumentList, HiOutlineSparkles } from 'react-icons/hi2'
import { usePatientHistoria } from '@features/patients/hooks/usePatientHistoria'
import PatientHistoriaShell from '@features/patients/components/PatientHistoriaShell'
import { useNutritionHistories } from '@features/patients/nutricion/hooks/useNutritionHistories'
import { useNutritionHistory } from '@features/patients/nutricion/hooks/useNutritionHistory'
import NutritionalPatientForm from '@features/patients/nutricion/forms/NutritionalPatientForm/NutritionalPatientForm'
import SuenoTab from '@features/patients/nutricion/tabs/SuenoTab'
import ActFisicaTab from '@features/patients/nutricion/tabs/ActFisicaTab'
import BioquimicaTab from '@features/patients/nutricion/tabs/BioquimicaTab'
import ExamFisicaTab from '@features/patients/nutricion/tabs/ExamFisicaTab'
import NutricionalTab from '@features/patients/nutricion/tabs/NutricionalTab'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import RecordTable from '@features/patients/shared/sections/RecordTable'
import Heading from '@components/Heading'
import {
  ENFERMEDAD_COLUMNS,
  TRATAMIENTO_COLUMNS,
  ADICCIONES_COLUMNS,
  buildAdiccionesRows,
} from '@features/patients/nutricion/constants'

// Tab de la vista → step de la modal principal (HISTORIA_STEPS).
// HISTORIA_STEPS = STEPS.slice(1): 0=Historia Médica, 1=Tratamiento, 2=Adicciones, 3=Sueño, 4=AF
const TAB_TO_STEP = { enfermedades: 0, tratamientos: 1, adicciones: 2, sueno: 3, af: 4 }

const TABS = [
  {
    value: 'enfermedades',
    label: 'Historia médica',
    render: (historia) => (
      <div className="space-y-6">
        <FieldsSection
          fields={[{ label: 'Motivo de consulta', value: historia.motivo_consulta }]}
          cols={1}
        />
        <div className="space-y-3">
          <Heading as="h4">Enfermedades</Heading>
          <RecordTable
            columns={ENFERMEDAD_COLUMNS}
            rows={historia.historias_medicas_nutricion}
            emptyMessage="Sin enfermedades registradas."
            emptyIcon={<HiOutlineClipboardDocumentList size={24} />}
          />
        </div>
      </div>
    ),
  },
  {
    value: 'tratamientos',
    label: 'Tratamientos alternativos',
    render: (historia) => (
      <div className="space-y-3">
        <Heading as="h4">Tratamientos alternativos</Heading>
        <RecordTable
          columns={TRATAMIENTO_COLUMNS}
          rows={historia.tratamiento_alt_nutricion}
          emptyMessage="Sin tratamientos alternativos registrados."
          emptyIcon={<HiOutlineSparkles size={24} />}
        />
      </div>
    ),
  },
  {
    value: 'adicciones',
    label: 'Adicciones',
    render: (historia) => (
      <div className="space-y-3">
        <Heading as="h4">Adicciones</Heading>
        <RecordTable columns={ADICCIONES_COLUMNS} rows={buildAdiccionesRows(historia.adicciones)} />
      </div>
    ),
  },
  {
    value: 'sueno',
    label: 'Sueño',
    render: (historia) => <SuenoTab historia={historia} />,
  },
  {
    value: 'af',
    label: 'Actividad física',
    render: (historia) => <ActFisicaTab historia={historia} />,
  },
  {
    value: 'bioquimica',
    label: 'Bioquímica',
    render: (historia) => <BioquimicaTab historia={historia} />,
  },
  {
    value: 'examen',
    label: 'Examen físico',
    render: (historia) => <ExamFisicaTab historia={historia} />,
  },
  {
    value: 'frecuencia',
    label: 'Evaluación nutricional',
    render: (historia) => <NutricionalTab historia={historia} />,
  },
]

export default function PatientHistoriaNutricion({ patient }) {
  const state = usePatientHistoria({
    useHistories: useNutritionHistories,
    useHistory: useNutritionHistory,
    periodField: 'fecha_ingreso',
    tabToStep: TAB_TO_STEP,
    dependentParams: [
      'bioqEval',
      'bioqTab',
      'suenoEval',
      'afEval',
      'nutrEval',
      'nutrTab',
      'examEval',
      'examTab',
    ],
  })

  return (
    <PatientHistoriaShell
      patient={patient}
      periodLabel="Historia nutricional"
      FormComponent={NutritionalPatientForm}
      tabs={TABS}
      emptyMessage="Sin historia nutricional registrada."
      errorMessage="No se pudo cargar la historia nutricional. Intenta de nuevo."
      {...state}
    />
  )
}
