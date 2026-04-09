import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPatient, deletePatient } from '@services/apiPatient'
import { createMedicalHistory } from '@services/apiMedicalHistory'
import { toastApiError } from '@lib/ApiError'

export function useCreatePatientWithHistory() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ patientData, historyData }) => {
      const { patient } = await createPatient(patientData)

      try {
        await createMedicalHistory({ paciente_id: patient.id, ...historyData })
      } catch (historyError) {
        await deletePatient(patient.id)
        throw historyError
      }

      return patient
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['medical-histories'] })
      toast.success('Paciente registrado correctamente')
    },
  })

  async function register(payload) {
    try {
      const result = await mutateAsync(payload)
      // toast.success se maneja en onSuccess via invalidation
      return result
    } catch (err) {
      toastApiError(err)
      throw err
    }
  }

  return { register, isRegistering: isPending }
}
