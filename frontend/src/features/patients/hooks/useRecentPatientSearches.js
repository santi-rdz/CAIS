import { useQuery, useQueryClient } from '@tanstack/react-query'

const KEY = ['__recent-patient-searches__']
const MAX = 5

export function useRecentPatientSearches() {
  const qc = useQueryClient()

  const { data: recent = [] } = useQuery({
    queryKey: KEY,
    queryFn: () => [],
    initialData: [],
    staleTime: Infinity,
    gcTime: Infinity,
    networkMode: 'always',
  })

  function add(patient) {
    qc.setQueryData(KEY, (prev = []) => {
      const deduped = prev.filter((p) => p.id !== patient.id)
      return [patient, ...deduped].slice(0, MAX)
    })
  }

  function clear() {
    qc.setQueryData(KEY, [])
  }

  return { recent, add, clear }
}
