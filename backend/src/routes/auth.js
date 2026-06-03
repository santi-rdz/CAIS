import express from 'express'
import { AuthController } from '#controllers/auth.js'
import { requireAuth } from '#middleware/auth.js'
import {
  loginRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
} from '#lib/security.js'

export const authRouter = express.Router()

// ─── Sesión ────────────────────────────────────────────────────────────────
authRouter.post('/login', loginRateLimiter, AuthController.login)
authRouter.get('/me', requireAuth, AuthController.me)
authRouter.post('/logout', AuthController.logout)

// ─── Contraseña desde configuración (usuario autenticado) ──────────────────
// PATCH /auth/password  { currentPassword, password, confirmPassword }
authRouter.patch('/password', requireAuth, AuthController.changePassword)

// ─── Flujo "olvidé mi contraseña" (sin sesión) ─────────────────────────────
// POST /auth/password/forgot   { correo }
// POST /auth/password/reset    { token, password, confirmPassword }
authRouter.post('/password/forgot', forgotPasswordRateLimiter, AuthController.requestPasswordReset)
authRouter.post('/password/reset', resetPasswordRateLimiter, AuthController.confirmPasswordReset)
