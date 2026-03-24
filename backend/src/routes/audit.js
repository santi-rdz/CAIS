import { Router } from 'express'
import { AuditController } from '#controllers/audit.js'
import { requireAuth, requireRole } from '#middleware/auth.js'

const privileged = requireRole('COORDINADOR', 'ADMIN')

export const auditRouter = new Router()

auditRouter.use(requireAuth)

auditRouter.get('/', privileged, AuditController.getAll)
