import { BASE_URL } from '@lib/constants'
export async function createInvitaciones(invitaciones, userId) {
  const res = await fetch(`${BASE_URL}/invitaciones`, {
    method: 'POST',
    body: JSON.stringify(invitaciones),
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Error al enviar invitaciones')
  }
  return await res.json()
}

export async function validateToken(token) {
  const res = await fetch(`${BASE_URL}/invitaciones/${encodeURIComponent(token)}`)
  if (!res.ok) throw new Error('Token inválido o expirado')
  return await res.json()
}
