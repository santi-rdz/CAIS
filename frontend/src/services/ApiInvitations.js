import { fetchApi } from '@lib/fetchApi'

export async function createInvitations(invitations) {
  return fetchApi('/invitaciones', { method: 'POST', body: invitations, errorMsg: 'Error al enviar invitaciones' })
}

export async function validateToken(token) {
  return fetchApi(`/invitaciones/${encodeURIComponent(token)}`, { errorMsg: 'Token inválido o expirado' })
}
