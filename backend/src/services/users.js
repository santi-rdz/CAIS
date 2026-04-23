import { randomUUID } from 'node:crypto'
import { InvitationModel } from '#models/InvitationModel.js'
import { prisma } from '#config/prisma.js'
import { sendEmail } from '#lib/sendEmail.js'
import { registerEmail } from '#lib/registerEmail.js'

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'

export class UserService {
  static async preRegister(usersData, creadoPor) {
    const invitations = []

    for (const u of usersData) {
      const roleRow = await prisma.roles.findFirst({
        where: { codigo: u.role.toUpperCase() },
      })
      if (!roleRow) throw new Error(`Rol "${u.role}" no existe`)

      invitations.push({
        correo: u.email,
        rolId: roleRow.id,
        token: randomUUID(),
        expiraAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
        creadoPor,
      })
    }

    await prisma.$transaction(async (tx) => {
      await InvitationModel.insertMany(invitations, tx)
    })

    const emailErrors = []
    for (const inv of invitations) {
      const url = `${FRONTEND_URL}/registro?token=${inv.token}`
      try {
        await sendEmail({
          to: inv.correo,
          subject: 'Completa tu registro — CAIS',
          html: registerEmail(inv.correo, url),
        })
      } catch (err) {
        emailErrors.push({ email: inv.correo, error: err.message })
      }
    }

    return {
      created: invitations.length,
      emailErrors,
    }
  }

  static async resendInvitation(correo) {
    const updated = await InvitationModel.refreshToken(correo)
    if (!updated) return null

    const url = `${FRONTEND_URL}/registro?token=${updated.token}`
    await sendEmail({
      to: correo,
      subject: 'Completa tu registro — CAIS',
      html: registerEmail(correo, url),
    })

    return { correo }
  }
}
