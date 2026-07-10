import { useQuery } from '@tanstack/react-query'
import { getPhysicalExams } from '@services/apiPhysicalExam'

// Se monta solo al entrar al tab de Examen Físico (Tab.Panel desmonta los tabs
// inactivos), así que el fetch no carga la vista inicial del paciente.
export function usePhysicalExams(historiaId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['physical-exams', historiaId],
    queryFn: () => getPhysicalExams(historiaId),
    enabled: !!historiaId,
  })

  return { exams: data?.exams ?? [], isPending, isError, error }
}
