import { Router } from 'express'
import { UserController } from '#controllers/users.js'
import { requireAuth, requireRole } from '#middleware/auth.js'

const privileged = requireRole('COORDINADOR', 'ADMIN')

export const userRouter = new Router()

// Pública — debe estar antes de requireAuth
userRouter.post('/registro', UserController.registro)

// Todas las rutas de aquí en adelante requieren sesión
userRouter.use(requireAuth)

userRouter.get('/', privileged, UserController.getAll)
userRouter.post('/', privileged, UserController.create)
userRouter.get('/:id', UserController.getById)
userRouter.delete('/:id', privileged, UserController.delete)
userRouter.patch('/:id', UserController.update)
