import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import {
  RATE_LIMIT_API_WINDOW_MS,
  RATE_LIMIT_API_MAX,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_LOGIN,
  RATE_LIMIT_FORGOT_PASSWORD,
  RATE_LIMIT_RESET_PASSWORD,
} from '#lib/constants.js'
import { isProduction, serverConfig } from '#config/env.js'

const RATE_LIMIT_MESSAGE = {
  error: 'Demasiadas solicitudes, espera un momento',
  message: 'Demasiadas solicitudes, espera un momento',
  code: 'RATE_LIMITED',
}

function normalizeOrigin(value) {
  try {
    return new URL(value).origin
  } catch {
    return value.replace(/\/+$/, '')
  }
}

const corsOrigins = serverConfig.corsOrigins.map(normalizeOrigin)

export const corsOptions = {
  origin(origin, callback) {
    // Sin Origin (curl, health checks) lo dejamos pasar.
    if (!origin || corsOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true)
      return
    }
    callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 24 * 60 * 60,
}

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'same-site' },
  hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
})

const passthrough = (_req, _res, next) => next()

// Inerte fuera de producción: en tests acumularía cuotas entre suites.
function buildLimiter(opts) {
  if (!isProduction) return passthrough
  return rateLimit({
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: RATE_LIMIT_MESSAGE,
    ...opts,
  })
}

export const apiRateLimiter = buildLimiter({
  windowMs: RATE_LIMIT_API_WINDOW_MS,
  limit: RATE_LIMIT_API_MAX,
})

// skipSuccessfulRequests: un usuario válido no se agota; un atacante sí.
export const loginRateLimiter = buildLimiter({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_LOGIN,
  skipSuccessfulRequests: true,
})

export const forgotPasswordRateLimiter = buildLimiter({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_FORGOT_PASSWORD,
})

export const resetPasswordRateLimiter = buildLimiter({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_RESET_PASSWORD,
})
