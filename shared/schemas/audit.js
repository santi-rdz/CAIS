import { z } from 'zod'

const uuidSchema = z.uuid('Debe ser un UUID válido')

const auditCreateSchema = z.object({
  usuario_id: uuidSchema,
  accion: z.string().min(1, 'La acción es requerida'),
  entidad: z.string().min(1, 'La entidad es requerida'),
  objetivo_id: uuidSchema.nullable().optional(),
})

export function validateAuditCreate(input) {
  return auditCreateSchema.safeParse(input)
}
