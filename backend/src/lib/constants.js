// ─── Seguridad ────────────────────────────────────────────────────────────────
export const BCRYPT_ROUNDS = 12

// ─── Sesión ───────────────────────────────────────────────────────────────────
export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000 // 8 horas

// ─── Invitaciones de registro ─────────────────────────────────────────────────
export const INVITATION_TTL_MS = 48 * 60 * 60 * 1000 // 48 horas

// ─── Reset de contraseña ──────────────────────────────────────────────────────
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000 // 1 hora

// ─── Rate limiting ────────────────────────────────────────────────────────────
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutos
export const RATE_LIMIT_FORGOT_PASSWORD = 5
export const RATE_LIMIT_RESET_PASSWORD = 10
