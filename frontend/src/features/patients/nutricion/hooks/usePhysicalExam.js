import { useQuery } from '@tanstack/react-query'
import { getPhysicalExamById } from '@services/apiPhysicalExam'

export function usePhysicalExam(id) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['physical-exam', id],
    queryFn: () => getPhysicalExamById(id),
    enabled: Boolean(id),
  })

  return { exam: data ?? null, isPending, isError, error }
}
