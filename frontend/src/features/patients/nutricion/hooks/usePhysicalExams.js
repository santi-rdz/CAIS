import { useInfiniteList } from '@hooks/useInfiniteList'
import { getPhysicalExams } from '@services/apiPhysicalExam'

export function usePhysicalExams(historiaId) {
  return useInfiniteList({
    queryKey: ['physical-exams', historiaId],
    queryFn: ({ page, limit }) => getPhysicalExams(historiaId, { page, limit }),
    listKey: 'exams',
    enabled: !!historiaId,
  })
}
