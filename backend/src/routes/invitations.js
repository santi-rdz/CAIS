import { Router } from 'express'
import { InvitationController } from '../controllers/invitations.js'

export const invitationRouter = new Router()

invitationRouter.post('/', InvitationController.create)
invitationRouter.get('/:token', InvitationController.validateToken)
