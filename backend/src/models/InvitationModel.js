import { randomUUID } from 'node:crypto'
import { INVITATION_TTL_MS } from '#lib/constants.js'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'

export class InvitationModel {
  static async insertMany(invitations, tx = prisma) {
    for (const inv of invitations) {
      await tx.invitaciones_registro.create({
        data: {
          correo: inv.correo,
          rol_id: inv.rolId,
          token: uuidToBuffer(inv.token),
          expira_at: inv.expiraAt,
          creado_por: uuidToBuffer(inv.creadoPor),
        },
      })
    }
  }

  static async findByToken(token) {
    const inv = await prisma.invitaciones_registro.findFirst({
      where: {
        token: uuidToBuffer(token),
        usado: false,
        expira_at: { gt: new Date() },
      },
      include: {
        roles: true,
        usuarios: { select: { area_id: true } },
      },
    })

    if (!inv) return null

    return {
      id: inv.id,
      correo: inv.correo,
      rol: inv.roles.codigo,
      usado: inv.usado,
      expira_at: inv.expira_at,
      area_id: inv.usuarios?.area_id ?? null,
    }
  }

  static async markAsUsed(token, tx = prisma) {
    await tx.invitaciones_registro.update({
      where: { token: uuidToBuffer(token) },
      data: { usado: true },
    })
  }

  static async deleteByCorreo(correo) {
    const result = await prisma.invitaciones_registro.deleteMany({
      where: { correo, usado: false },
    })
    return result.count > 0
  }

  static async refreshToken(correo) {
    const token = randomUUID()
    const expiraAt = new Date(Date.now() + INVITATION_TTL_MS)

    const result = await prisma.invitaciones_registro.updateMany({
      where: { correo, usado: false },
      data: { token: uuidToBuffer(token), expira_at: expiraAt },
    })

    if (result.count === 0) return null
    return { correo, token }
  }
}
