import './loadEnv.js'

const DEFAULT_FRONTEND_URL = 'http://localhost:5173'
const DEFAULT_CORS_ORIGINS = [DEFAULT_FRONTEND_URL, 'http://127.0.0.1:5173', 'http://frontend:5173']

function envValue(name) {
  const value = process.env[name]?.trim()
  return value || undefined
}

export function requiredEnv(name) {
  const value = envValue(name)
  if (!value) throw new Error(`${name} es requerido`)
  return value
}

function positiveIntEnv(name, fallback) {
  const value = Number(envValue(name))
  return Number.isInteger(value) && value > 0 ? value : fallback
}

function csvEnv(name, fallback) {
  const values = envValue(name)
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  return values?.length ? values : fallback
}

const nodeEnv = envValue('NODE_ENV') ?? 'development'
export const isProduction = nodeEnv === 'production'

const frontendUrl = envValue('FRONTEND_URL') ?? DEFAULT_FRONTEND_URL
const corsOrigins = csvEnv('CORS_ORIGINS', [frontendUrl, ...DEFAULT_CORS_ORIGINS])

if (isProduction && !envValue('SESSION_SECRET')) {
  throw new Error('SESSION_SECRET es requerido en producción')
}

// Cookie segura por default en prod, override con SESSION_COOKIE_SECURE
// para pruebas locales de prod sobre HTTP (donde HTTPS no termina).
const cookieSecureEnv = envValue('SESSION_COOKIE_SECURE')?.toLowerCase()
const sessionCookieSecure =
  cookieSecureEnv === 'false' ? false : cookieSecureEnv === 'true' ? true : isProduction

export const serverConfig = {
  nodeEnv,
  isTest: nodeEnv === 'test',
  port: positiveIntEnv('PORT', 8000),
  frontendUrl,
  corsOrigins,
  jsonBodyLimit: envValue('JSON_BODY_LIMIT') ?? '100kb',
  sessionSecret: envValue('SESSION_SECRET') ?? 'dev-secret-change-in-prod',
  sessionCookieSecure,
  trustProxy: isProduction,
}
