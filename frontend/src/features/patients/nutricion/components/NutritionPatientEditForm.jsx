import Spinner from '@components/Spinner'
import { useNutritionHistories } from '@features/patients/nutricion/hooks/useNutritionHistories'
import { useNutritionHistory } from '@features/patients/nutricion/hooks/useNutritionHistory'
import NutritionalPatientForm from '@features/patients/nutricion/forms/NutritionalPatientForm/NutritionalPatientForm'

// Editar paciente (nutrición): la edición incluye el motivo de consulta de la
// historia más reciente, así que la resolvemos antes de montar el form para que
// los defaults la incluyan (useForm fija los defaults solo al montar).
export default function NutritionPatientEditForm({ patient, onCloseModal }) {
  const {
    histories = [],
    isPending: isLoadingList,
    isError: isListError,
  } = useNutritionHistories(patient.id)
  const latestId = histories[0]?.id ?? null
  const {
    historia,
    isPending: isLoadingHistoria,
    isError: isHistoriaError,
  } = useNutritionHistory(latestId)

  if (isLoadingList || (latestId && isLoadingHistoria)) return <Spinner />

  if (isListError || isHistoriaError) {
    return (
      <p className="text-5 p-6 text-center text-red-400">
        No se pudo cargar la información de nutrición. Intenta de nuevo.
      </p>
    )
  }

  if (!latestId) {
    return (
      <p className="text-5 p-6 text-center text-zinc-400">
        Este paciente aún no tiene una historia nutricional registrada.
      </p>
    )
  }

  return (
    <NutritionalPatientForm
      patient={patient}
      historia={historia}
      patientOnly
      onCloseModal={onCloseModal}
    />
  )
}
