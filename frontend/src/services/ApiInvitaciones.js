import { BASE_URL } from '@lib/constants'
import { throwApiError } from '@lib/ApiError'

export async function createInvitaciones(invitaciones, userId) {
  const res = await fetch(`${BASE_URL}/invitaciones`, {
    method: 'POST',
    body: JSON.stringify(invitaciones),
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
  })
  if (!res.ok) await throwApiError(res, 'Error al enviar invitaciones')
  return await res.json()
}

export async function validateToken(token) {
  const res = await fetch(
    `${BASE_URL}/invitaciones/${encodeURIComponent(token)}`
  )
  if (!res.ok) await throwApiError(res, 'Token inválido o expirado')
  return await res.json()
}
