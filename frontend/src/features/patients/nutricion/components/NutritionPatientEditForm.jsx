import Spinner from '@components/Spinner'
import { useNutritionHistories } from '@features/patients/nutricion/hooks/useNutritionHistories'
import { useNutritionHistory } from '@features/patients/nutricion/hooks/useNutritionHistory'
import NutritionalPatientForm from '@features/patients/nutricion/forms/NutritionalPatientForm/NutritionalPatientForm'

// Editar paciente (nutrición): la edición incluye el motivo de consulta de la
// historia más reciente, así que la resolvemos antes de montar el form para que
// los defaults la incluyan (useForm fija los defaults solo al montar).
export default function NutritionPatientEditForm({ patient, onCloseModal }) {
  const { histories, isPending: isLoadingList } = useNutritionHistories(patient.id)
  const latestId = histories[0]?.id ?? null
  const { historia, isPending: isLoadingHistoria } = useNutritionHistory(latestId)

  if (isLoadingList || (latestId && isLoadingHistoria)) return <Spinner />

  return (
    <NutritionalPatientForm
      patient={patient}
      historia={historia}
      patientOnly
      onCloseModal={onCloseModal}
    />
  )
}
