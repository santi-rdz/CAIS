import { prisma } from '#config/prisma.js'

export class AuthModel {
  static async findByEmail(correo) {
    return prisma.usuarios.findUnique({
      where: { correo },
      select: {
        id: true,
        correo: true,
        nombre: true,
        password_hash: true,
        roles: { select: { codigo: true } },
        estados: { select: { codigo: true } },
      },
    })
  }

  static async updatePassword(userId, passwordHash, tx = prisma) {
    return tx.usuarios.update({
      where: { id: userId },
      data: { password_hash: passwordHash },
    })
  }

  // ─── Reset tokens ─────────────────────────────────────────────────────────

  static tokenToBuffer(token) {
    return Buffer.from(token.replace(/-/g, ''), 'hex')
  }

  static async createResetToken(userId, token, expiresAt) {
    const tokenBuffer = AuthModel.tokenToBuffer(token)
    return prisma.$transaction([
      prisma.password_reset_tokens.deleteMany({
        where: { usuario_id: userId },
      }),
      prisma.password_reset_tokens.create({
        data: { usuario_id: userId, token: tokenBuffer, expira_at: expiresAt },
      }),
    ])
  }

  static async findResetToken(token) {
    return prisma.password_reset_tokens.findUnique({
      where: { token: AuthModel.tokenToBuffer(token) },
    })
  }

  static async consumeResetToken(tokenBuffer, userId, newPasswordHash) {
    return prisma.$transaction(async (tx) => {
      const { count } = await tx.password_reset_tokens.updateMany({
        where: {
          token: tokenBuffer,
          usuario_id: userId,
          usado: false,
          expira_at: { gte: new Date() },
        },
        data: { usado: true },
      })

      if (count !== 1) {
        throw new Error('Token inválido, expirado o ya utilizado')
      }

      await tx.usuarios.update({
        where: { id: userId },
        data: { password_hash: newPasswordHash },
      })
    })
  }

  static async deleteResetToken(token) {
    return prisma.password_reset_tokens.delete({
      where: { token: AuthModel.tokenToBuffer(token) },
    })
  }

  static async deleteResetTokensByUser(userId) {
    return prisma.password_reset_tokens.deleteMany({
      where: { usuario_id: userId },
    })
  }
}
