import { fetchApi } from '@lib/fetchApi'

export async function createInvitations(invitations) {
  return fetchApi('/invitaciones', {
    method: 'POST',
    body: invitations,
    errorMsg: 'Error al enviar invitaciones',
  })
}

export async function validateToken(token) {
  return fetchApi(`/invitaciones/${encodeURIComponent(token)}`, {
    errorMsg: 'Token inválido o expirado',
  })
}

export async function resendInvitation(correo) {
  return fetchApi('/invitaciones/reenviar', {
    method: 'POST',
    body: { correo },
    errorMsg: 'Error al reenviar la invitación',
  })
}

export async function deleteInvitation(correo) {
  return fetchApi('/invitaciones', {
    method: 'DELETE',
    body: { correo },
    errorMsg: 'Error al eliminar la invitación',
  })
}
