import { Router } from 'express'
import { InvitationController } from '../controllers/invitations.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export const invitationRouter = new Router()

invitationRouter.post(
  '/',
  requireAuth,
  requireRole('COORDINADOR'),
  InvitationController.create
)
invitationRouter.get('/:token', InvitationController.validateToken)
