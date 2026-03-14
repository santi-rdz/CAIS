import { getPatient } from '@services/apiPatient'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export function usePatient() {
  const { id } = useParams()
  const { data: patient, isPending } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatient(id),
  })

  return { patient, isPending }
}
