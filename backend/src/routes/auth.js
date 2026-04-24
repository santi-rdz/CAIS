import express from 'express'
import rateLimit from 'express-rate-limit'
import {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_FORGOT_PASSWORD,
  RATE_LIMIT_RESET_PASSWORD,
} from '#lib/constants.js'
import { AuthController } from '#controllers/auth.js'
import { requireAuth } from '#middleware/auth.js'

export const authRouter = express.Router()

const rateLimitMessage = {
  error: 'Demasiados intentos, espera 15 minutos antes de intentar de nuevo',
}

const forgotPasswordLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_FORGOT_PASSWORD,
  message: rateLimitMessage,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

const resetPasswordLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_RESET_PASSWORD,
  message: rateLimitMessage,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

// ─── Sesión ────────────────────────────────────────────────────────────────
authRouter.post('/login', AuthController.login)
authRouter.get('/me', requireAuth, AuthController.me)
authRouter.post('/logout', AuthController.logout)

// ─── Contraseña desde configuración (usuario autenticado) ──────────────────
// PATCH /auth/password  { currentPassword, newPassword, confirmNewPassword }
authRouter.patch('/password', requireAuth, AuthController.changePassword)

// ─── Flujo "olvidé mi contraseña" (sin sesión) ─────────────────────────────
// POST /auth/password/forgot   { correo }
// POST /auth/password/reset    { token, password, confirmPassword }
authRouter.post(
  '/password/forgot',
  forgotPasswordLimiter,
  AuthController.requestPasswordReset
)
authRouter.post(
  '/password/reset',
  resetPasswordLimiter,
  AuthController.confirmPasswordReset
)
