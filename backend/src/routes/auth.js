import express from 'express'
import { AuthController } from '#controllers/auth.js'
import { requireAuth } from '#middleware/auth.js'
import { validate } from '#middleware/validate.js'
import { validateLogin, validateForgotPassword } from '@cais/shared/schemas/auth'
import { validateChangePassword, validatePasswordReset } from '@cais/shared/schemas/password'
import {
  loginRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
} from '#lib/security.js'

export const authRouter = express.Router()

// ─── Sesión ────────────────────────────────────────────────────────────────
authRouter.post('/login', loginRateLimiter, validate(validateLogin), AuthController.login)
authRouter.get('/me', requireAuth, AuthController.me)
authRouter.post('/logout', AuthController.logout)

// ─── Contraseña desde configuración (usuario autenticado) ──────────────────
// PATCH /auth/password  { currentPassword, password, confirmPassword }
authRouter.patch(
  '/password',
  requireAuth,
  validate(validateChangePassword),
  AuthController.changePassword
)

// ─── Flujo "olvidé mi contraseña" (sin sesión) ─────────────────────────────
// POST /auth/password/forgot   { correo }
// POST /auth/password/reset    { token, password, confirmPassword }
authRouter.post(
  '/password/forgot',
  forgotPasswordRateLimiter,
  validate(validateForgotPassword),
  AuthController.requestPasswordReset
)
authRouter.post(
  '/password/reset',
  resetPasswordRateLimiter,
  validate(validatePasswordReset),
  AuthController.confirmPasswordReset
)
