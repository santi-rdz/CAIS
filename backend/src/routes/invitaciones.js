import { Router } from 'express'
import { InvitacionController } from '../controllers/invitaciones.js'

export const invitacionRouter = new Router()

invitacionRouter.post('/', InvitacionController.create)
invitacionRouter.get('/:token', InvitacionController.validateToken)
