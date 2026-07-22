import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SIMILAR_PATIENT_MIN_CHARS } from '@cais/shared/constants/patients'
import { SIMILAR_PATIENTS_DEBOUNCE_MS } from '@features/patients/constants'
import { getSimilarPatients } from '@services/apiPatient'

// Busca pacientes similares en la otra área cuando los 4 campos ancla están
// completos. Debounced para no consultar en cada tecla; la consulta se keyea y
// dispara desde el mismo `debouncedKey` para que no se desincronicen.
export function useSimilarPatients({ nombre, apellidos, fecha_nacimiento, genero }, enabled) {
  const fecha = fecha_nacimiento?.isValid?.() ? fecha_nacimiento.format('YYYY-MM-DD') : null
  const anchorKey =
    enabled &&
    nombre?.trim().length >= SIMILAR_PATIENT_MIN_CHARS &&
    apellidos?.trim().length >= SIMILAR_PATIENT_MIN_CHARS &&
    fecha &&
    genero
      ? `${nombre.trim()}|${apellidos.trim()}|${fecha}|${genero}`
      : null

  const [debouncedKey, setDebouncedKey] = useState(null)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKey(anchorKey), SIMILAR_PATIENTS_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [anchorKey])

  const { data } = useQuery({
    queryKey: ['similar-patients', debouncedKey],
    queryFn: () => {
      const [nom, ape, fn, gen] = debouncedKey.split('|')
      return getSimilarPatients({ nombre: nom, apellidos: ape, fecha_nacimiento: fn, genero: gen })
    },
    enabled: Boolean(debouncedKey),
  })

  return { similares: debouncedKey ? (data?.similares ?? []) : [] }
}
