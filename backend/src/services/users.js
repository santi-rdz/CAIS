import { randomUUID } from 'node:crypto'
import { INVITATION_TTL_MS } from '#lib/constants.js'
import { InvitationModel } from '#models/InvitationModel.js'
import { prisma } from '#config/prisma.js'
import { sendEmail } from '#lib/sendEmail.js'
import { registerEmail } from '#lib/registerEmail.js'
import { serverConfig } from '#config/env.js'
import { ConflictError } from '#lib/appError.js'

export class UserService {
  static async preRegister(usersData, creadoPor) {
    const emails = usersData.map((u) => u.email)

    const uniqueEmails = [...new Set(emails)]
    if (uniqueEmails.length < emails.length) {
      const seen = new Set()
      const dupes = emails.filter((e) => (seen.has(e) ? true : !seen.add(e)))
      throw new ConflictError('El payload contiene correos duplicados', {
        emails: [...new Set(dupes)],
      })
    }

    const existing = await prisma.usuarios.findMany({
      where: { correo: { in: emails } },
      select: { correo: true },
    })

    if (existing.length > 0) {
      throw new ConflictError('Uno o más correos ya tienen una cuenta registrada', {
        emails: existing.map((u) => u.correo),
      })
    }

    const pendingInvitations = await prisma.invitaciones_registro.findMany({
      where: { correo: { in: emails }, usado: false },
      select: { correo: true },
    })

    if (pendingInvitations.length > 0) {
      throw new ConflictError('Uno o más correos ya tienen una invitación pendiente', {
        emails: pendingInvitations.map((i) => i.correo),
      })
    }

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
        expiraAt: new Date(Date.now() + INVITATION_TTL_MS),
        creadoPor,
      })
    }

    try {
      await prisma.$transaction(async (tx) => {
        await InvitationModel.insertMany(invitations, tx)
      })
    } catch (err) {
      // Carrera: un correo consiguió una invitación entre el chequeo y el insert.
      // Reconsultamos para reportar solo los que realmente chocaron.
      if (err.code === 'P2002') {
        const raced = await prisma.invitaciones_registro.findMany({
          where: { correo: { in: emails }, usado: false },
          select: { correo: true },
        })
        throw new ConflictError('Uno o más correos ya tienen una invitación pendiente', {
          emails: raced.map((i) => i.correo),
        })
      }
      throw err
    }

    const emailErrors = []
    for (const inv of invitations) {
      const url = `${serverConfig.frontendUrl}/registro?token=${inv.token}`
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

    const url = `${serverConfig.frontendUrl}/registro?token=${updated.token}`
    await sendEmail({
      to: correo,
      subject: 'Completa tu registro — CAIS',
      html: registerEmail(correo, url),
    })

    return { correo }
  }
}
