import { BASE_URL } from '@lib/constants'

export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Login failed')
  }

  return await res.json()
}

export async function getMe() {
  const res = await fetch(`${BASE_URL}/auth/me`, { credentials: 'include' })
  if (!res.ok) throw new Error('No autenticado')
  return await res.json()
}

export async function logout() {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

export async function changePassword(data) {
  const res = await fetch(`${BASE_URL}/auth/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Error al cambiar la contraseña')
  }

  return await res.json()
}
