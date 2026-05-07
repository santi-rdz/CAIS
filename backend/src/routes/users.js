import { Router } from 'express'
import { UserController } from '#controllers/users.js'
import { requireAuth, requireRole } from '#middleware/auth.js'
import { ROLES } from '@cais/shared/constants/users'

const privileged = requireRole(ROLES.COORDINADOR, ROLES.ADMIN)

export const userRouter = new Router()

// Pública — debe estar antes de requireAuth
userRouter.post('/registro', UserController.registro)

// Todas las rutas de aquí en adelante requieren sesión
userRouter.use(requireAuth)

userRouter.get('/', privileged, UserController.getAll)
userRouter.post('/', privileged, UserController.create)
userRouter.get('/:id', UserController.getById)
userRouter.delete('/:id', privileged, UserController.delete)
userRouter.patch('/:id', privileged, UserController.update)
