const BASE_URL = 'http://localhost:8000'

export async function getUsers({ status }) {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    const res = await fetch(`${BASE_URL}/usuarios${query}`)
    if (!res.ok) throw new Error('Erorr al obtener los uusarios')
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
