import { BASE_URL } from '@lib/constants'

export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || error.error || 'Login failed')
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

export async function requestPasswordReset({ correo }) {
  const res = await fetch(`${BASE_URL}/auth/password/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || body.error || 'Error al solicitar el restablecimiento')
  }

  return await res.json()
}

export async function getResetTokenInfo(token) {
  const res = await fetch(`${BASE_URL}/auth/password/reset/${token}`)

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || body.error || 'Token inválido o expirado')
  }

  return await res.json()
}

export async function resetPassword({ token, password, confirmPassword }) {
  const res = await fetch(`${BASE_URL}/auth/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password, confirmPassword }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || body.error || 'Error al restablecer la contraseña')
  }

  return await res.json()
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
    throw new Error(body.message || body.error || 'Error al cambiar la contraseña')
  }

  return await res.json()
}
