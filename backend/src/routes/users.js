import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const userRouter = new Router()

userRouter.get('/', UserController.getAll)
userRouter.get('/:id', UserController.getById)
userRouter.delete('/:id', UserController.delete)
userRouter.patch('/:id', UserController.update)
userRouter.post('/pre', UserController.preRegister)
userRouter.post('/complete', UserController.fullRegister)
