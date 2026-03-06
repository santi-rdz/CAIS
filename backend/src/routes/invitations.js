import { Router } from 'express'
import { InvitationController } from '../controllers/invitations.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const privileged = requireRole('COORDINADOR', 'ADMIN')

export const invitationRouter = new Router()

// Pública — validar token de invitación (usuario no autenticado)
invitationRouter.get('/:token', InvitationController.validateToken)

// Requiere sesión y rol
invitationRouter.post('/', requireAuth, privileged, InvitationController.create)
