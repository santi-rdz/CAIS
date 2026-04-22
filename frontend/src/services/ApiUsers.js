import { fetchApi } from '@lib/fetchApi'
import { PAGE_SIZE } from '@lib/constants'

export async function getUsers({ status, rol, sortBy, search, page }) {
  const params = new URLSearchParams()

  if (status) params.append('status', status)
  if (rol) params.append('rol', rol)
  if (sortBy && sortBy !== 'clear') params.append('sortBy', sortBy)
  if (search) params.append('search', search)
  if (page) {
    params.append('page', page)
    params.append('limit', PAGE_SIZE)
  }
  const query = params.toString() ? `?${params.toString()}` : ''

  return fetchApi(`/usuarios${query}`, {
    errorMsg: 'Error al obtener los usuarios',
  })
}

export async function getUser(id) {
  return fetchApi(`/usuarios/${id}`, { errorMsg: 'Error al obtener usuario' })
}

export async function createUser(data) {
  return fetchApi('/usuarios', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al crear usuario',
  })
}

export async function registroUsuario(data) {
  return fetchApi('/usuarios/registro', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al completar el registro',
  })
}

export async function updateUser(id, data) {
  return fetchApi(`/usuarios/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar usuario',
  })
}

export async function updateUserEstado(id, estado) {
  return updateUser(id, { estado })
}

export async function deleteUser(id) {
  return fetchApi(`/usuarios/${id}`, {
    method: 'DELETE',
    errorMsg: 'No se ha podido borrar el usuario',
  })
}
