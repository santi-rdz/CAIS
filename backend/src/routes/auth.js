import express from 'express'
import { AuthController } from '#controllers/auth.js'
import { requireAuth } from '#middleware/auth.js'

export const authRouter = express.Router()

authRouter.post('/login', AuthController.login)
authRouter.get('/me', requireAuth, AuthController.me)
authRouter.post('/logout', AuthController.logout)
authRouter.post('/change-password', requireAuth, AuthController.changePassword)
