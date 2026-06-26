import { Router } from 'express'
import { AuditController } from '#controllers/audit.js'
import { requireAuth, requireRole } from '#middleware/auth.js'
import { validateUuidParam } from '#middleware/validate.js'
import { ROLES } from '@cais/shared/constants/users'

const privileged = requireRole(ROLES.COORDINADOR, ROLES.ADMIN)

export const auditRouter = new Router()

auditRouter.use(requireAuth)

auditRouter.get('/', privileged, AuditController.getAll)
auditRouter.get('/:id', privileged, validateUuidParam(), AuditController.getById)
