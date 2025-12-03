import { PAGE_SIZE } from '@lib/constants'

const BASE_URL = 'http://localhost:8000'

export async function getUsers({ status, sortBy, search, page }) {
  try {
    const params = new URLSearchParams()

    if (status) params.append('status', status)
    if (sortBy && sortBy !== 'clear') params.append('sortBy', sortBy)
    if (search) params.append('search', search)
    if (page) {
      params.append('page', page)
      params.append('limit', PAGE_SIZE)
    }
    const query = params.toString() ? `?${params.toString()}` : ''

    const res = await fetch(`${BASE_URL}/usuarios${query}`)
    if (!res.ok) throw new Error('Error al obtener los usuarios')
    const data = await res.json()
    return data
  } catch (error) {
    return { error: true, message: error.message }
  }
}

export async function createPreUser(preUser) {
  try {
    const res = await fetch(`${BASE_URL}/usuarios/pre`, {
      method: 'POST',
      body: JSON.stringify(preUser),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw Error()
    return await res.json()
  } catch {
    throw Error('Error al crear usuario')
  }
}

export async function deleteUser(id) {
  try {
    const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw Error()
    return await res.json()
  } catch {
    throw Error('No se ha podido borrar el usuario')
  }
}

export async function getUser(id) {
  try {
    const res = await fetch(`http://localhost:8000/usuarios/${id}`)

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Error fetching user')
    }

    return await res.json()
  } catch (error) {
    throw new Error(error.message)
  }
}
