import express from 'express'
import { AuthController } from '#controllers/auth.js'
import { requireAuth } from '#middleware/auth.js'

export const authRouter = express.Router()

authRouter.post('/login', AuthController.login)
authRouter.get('/me', requireAuth, AuthController.me)
authRouter.post('/logout', AuthController.logout)
authRouter.post('/reset-password', AuthController.requestPasswordReset)
authRouter.post('/reset-password/confirm', AuthController.resetPassword)


// DEV ONLY: Get latest reset token for testing purposes
// This endpoint is blocked in production (NODE_ENV === 'production')
authRouter.get(
  '/reset-password/dev-token',
  AuthController.getDevResetToken
)
