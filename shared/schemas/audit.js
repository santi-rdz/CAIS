import { z } from 'zod'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

const uuidSchema = z.uuid('Debe ser un UUID válido')

const auditSchema = z.object({
  usuario_id: uuidSchema,
  accion: z.enum(Object.values(ACCIONES)),
  entidad: z.enum(Object.values(ENTIDADES)),
  paciente_id: uuidSchema.nullish(),
  objetivo_id: uuidSchema.nullish(),
})

export function validateAuditCreate(input) {
  return auditSchema.safeParse(input)
}
