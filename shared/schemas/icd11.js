import { z } from 'zod'

// Búsqueda de diagnósticos CIE-11 (ICD-11 de la OMS). Solo valida el término.
export const icd11SearchSchema = z.object({
  q: z.string().trim().min(1, 'El parámetro q es requerido'),
})

export function validateIcd11Search(input) {
  return icd11SearchSchema.safeParse(input)
}
