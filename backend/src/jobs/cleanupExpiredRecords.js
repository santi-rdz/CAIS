import { prisma } from '#config/prisma.js'
import { USED_TOKEN_GRACE_MS } from '#lib/constants.js'

export async function cleanupExpiredRecords() {
  const now = new Date()
  const usedBefore = new Date(now.getTime() - USED_TOKEN_GRACE_MS)
  const usedAndStale = { usado: true, created_at: { lt: usedBefore } }

  const [sessions, passwordResetTokens, invitacionesRegistro] = await prisma.$transaction([
    prisma.sessions.deleteMany({ where: { expire: { lt: now } } }),
    prisma.password_reset_tokens.deleteMany({
      where: { OR: [{ expira_at: { lt: now } }, usedAndStale] },
    }),
    prisma.invitaciones_registro.deleteMany({
      where: { OR: [{ expira_at: { lt: now } }, usedAndStale] },
    }),
  ])

  return {
    sessions: sessions.count,
    password_reset_tokens: passwordResetTokens.count,
    invitaciones_registro: invitacionesRegistro.count,
  }
}
