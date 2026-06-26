import { Router } from 'express'
import { UserController } from '#controllers/users.js'
import { requireAuth, requireRole } from '#middleware/auth.js'
import { validate, validateUuidParam } from '#middleware/validate.js'
import { validateUserCreate, validateUserUpdate } from '@cais/shared/schemas/users'
import { ROLES } from '@cais/shared/constants/users'

const privileged = requireRole(ROLES.COORDINADOR, ROLES.ADMIN)

export const userRouter = new Router()

// Pública — debe estar antes de requireAuth. El body se valida en el controller
// porque el schema depende del rol de la invitación (resuelto en runtime).
userRouter.post('/registro', UserController.registro)

// Todas las rutas de aquí en adelante requieren sesión
userRouter.use(requireAuth)

userRouter
  .route('/')
  .get(privileged, UserController.getAll)
  .post(privileged, validate(validateUserCreate), UserController.create)

userRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(UserController.getById)
  .patch(privileged, validate(validateUserUpdate), UserController.update)
  .delete(privileged, UserController.delete)
