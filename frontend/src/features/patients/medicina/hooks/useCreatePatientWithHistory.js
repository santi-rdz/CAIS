import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { registerMedicalPatient } from '@services/apiMedicalHistory'
import { toastApiError } from '@lib/ApiError'

export function useCreatePatientWithHistory() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    // Registro atómico server-side: el backend crea paciente + historia en una
    // sola transacción. Con `pacienteId` sincroniza un paciente existente de
    // otra área en vez de crear uno nuevo.
    mutationFn: ({ patientData, historyData, pacienteId }) =>
      registerMedicalPatient(
        pacienteId
          ? { paciente_id: pacienteId, patient: patientData, historia: historyData }
          : { patient: patientData, historia: historyData }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['medical-histories'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success(data?.message ?? 'Paciente registrado correctamente')
    },
  })

  async function register(payload) {
    try {
      return await mutateAsync(payload)
    } catch (err) {
      toastApiError(err)
      throw err
    }
  }

  return { register, isRegistering: isPending }
}
