import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const userRouter = new Router()

userRouter.get('/', UserController.getAll)
userRouter.post('/', UserController.create)
userRouter.post('/registro', UserController.registro)
userRouter.get('/:id', UserController.getById)
userRouter.delete('/:id', UserController.delete)
userRouter.patch('/:id', UserController.update)
