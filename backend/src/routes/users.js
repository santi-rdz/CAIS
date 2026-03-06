import { Router } from 'express'
import { UserController } from '../controllers/users.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export const userRouter = new Router()

userRouter.get(
  '/',
  requireAuth,
  requireRole('COORDINADOR'),
  UserController.getAll
)
userRouter.post(
  '/',
  requireAuth,
  requireRole('COORDINADOR'),
  UserController.create
)
userRouter.post('/registro', UserController.registro)
userRouter.get('/:id', requireAuth, UserController.getById)
userRouter.delete(
  '/:id',
  requireAuth,
  requireRole('COORDINADOR'),
  UserController.delete
)
userRouter.patch('/:id', requireAuth, UserController.update)
