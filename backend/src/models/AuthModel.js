import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { BadRequestError } from '#lib/appError.js'

export class AuthModel {
  static async findByEmail(correo) {
    return prisma.usuarios.findUnique({
      where: { correo },
      select: {
        id: true,
        correo: true,
        nombre: true,
        password_hash: true,
        area_id: true,
        areas: { select: { nombre: true } },
        roles: { select: { codigo: true } },
        estados: { select: { codigo: true } },
      },
    })
  }

  static async findSessionUser(userId) {
    return prisma.usuarios.findUnique({
      where: { id: uuidToBuffer(userId) },
      select: {
        id: true,
        nombre: true,
        correo: true,
        foto: true,
        roles: { select: { codigo: true } },
        areas: { select: { nombre: true } },
      },
    })
  }

  static async findByIdWithHash(userId) {
    return prisma.usuarios.findUnique({
      where: { id: uuidToBuffer(userId) },
      select: { id: true, password_hash: true },
    })
  }

  static async touchLastAccess(userId, tx = prisma) {
    return tx.usuarios.update({
      where: { id: uuidToBuffer(userId) },
      data: { ultimo_acceso: new Date() },
    })
  }

  static async updatePassword(userId, passwordHash, tx = prisma) {
    return tx.usuarios.update({
      where: { id: userId },
      data: { password_hash: passwordHash },
    })
  }

  // Cambia el password e invalida los tokens de reset atómicamente: si el borrado
  // falla, el password no debe quedar cambiado con tokens de reset vivos.
  // Recibe el UUID string de sesión (como findSessionUser/findByIdWithHash) y
  // convierte una vez; los helpers internos operan sobre el Buffer.
  static async changePassword(userId, passwordHash) {
    const idBuffer = uuidToBuffer(userId)
    return prisma.$transaction(async (tx) => {
      await this.updatePassword(idBuffer, passwordHash, tx)
      await this.deleteResetTokensByUser(idBuffer, tx)
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
        throw new BadRequestError('Token inválido, expirado o ya utilizado')
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

  static async deleteResetTokensByUser(userId, tx = prisma) {
    return tx.password_reset_tokens.deleteMany({
      where: { usuario_id: userId },
    })
  }
}
