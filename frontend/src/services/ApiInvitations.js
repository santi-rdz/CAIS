import { BASE_URL } from '@lib/constants'
import { throwApiError } from '@lib/ApiError'

export async function createInvitations(invitations) {
  const res = await fetch(`${BASE_URL}/invitaciones`, {
    method: 'POST',
    body: JSON.stringify(invitations),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al enviar invitaciones')
  return await res.json()
}

export async function validateToken(token) {
  const res = await fetch(
    `${BASE_URL}/invitaciones/${encodeURIComponent(token)}`,
    { credentials: 'include' }
  )
  if (!res.ok) await throwApiError(res, 'Token inválido o expirado')
  return await res.json()
}
