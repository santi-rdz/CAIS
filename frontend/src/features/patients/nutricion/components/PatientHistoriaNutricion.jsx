import { usePatientHistoria } from '@features/patients/hooks/usePatientHistoria'
import PatientHistoriaShell from '@features/patients/components/PatientHistoriaShell'
import { useNutritionHistories } from '@features/patients/nutricion/hooks/useNutritionHistories'
import { useNutritionHistory } from '@features/patients/nutricion/hooks/useNutritionHistory'
import NutritionalPatientForm from '@features/patients/nutricion/forms/NutritionalPatientForm/NutritionalPatientForm'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import RecordTable from '@features/patients/shared/sections/RecordTable'
import {
  ENFERMEDAD_COLUMNS,
  TRATAMIENTO_COLUMNS,
  ADICCIONES_COLUMNS,
  buildAdiccionesRows,
} from '@features/patients/nutricion/constants'

// Tab de la vista → step de la modal (HISTORIA_STEPS: Historia Médica,
// Tratamiento Alternativo, Adicciones).
const TAB_TO_STEP = { enfermedades: 0, tratamientos: 1, adicciones: 2 }

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
        <RecordTable
          columns={ENFERMEDAD_COLUMNS}
          rows={historia.historias_medicas_nutricion}
          emptyMessage="Sin enfermedades registradas."
        />
      </div>
    ),
  },
  {
    value: 'tratamientos',
    label: 'Tratamientos alternativos',
    render: (historia) => (
      <RecordTable
        columns={TRATAMIENTO_COLUMNS}
        rows={historia.tratamiento_alt_nutricion}
        emptyMessage="Sin tratamientos alternativos registrados."
      />
    ),
  },
  {
    value: 'adicciones',
    label: 'Adicciones',
    render: (historia) => (
      <RecordTable columns={ADICCIONES_COLUMNS} rows={buildAdiccionesRows(historia.adicciones)} />
    ),
  },
]

export default function PatientHistoriaNutricion({ patient }) {
  const state = usePatientHistoria({
    useHistories: useNutritionHistories,
    useHistory: useNutritionHistory,
    periodField: 'fecha_ingreso',
    tabToStep: TAB_TO_STEP,
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
