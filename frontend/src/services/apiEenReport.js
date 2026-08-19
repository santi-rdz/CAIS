import { fetchApi } from '@lib/fetchApi'

export async function getEenReports(historia_paciente_id) {
  const params = new URLSearchParams({ historia_paciente_id, limit: 50 })
  return fetchApi(`/nutricion/reporte-een?${params}`, {
    errorMsg: 'Error al obtener los reportes EEN',
  })
}

export async function getEenReportById(id) {
  return fetchApi(`/nutricion/reporte-een/${id}`, {
    errorMsg: 'Error al obtener el reporte EEN',
  })
}

export async function createEenReport(data) {
  return fetchApi('/nutricion/reporte-een', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar el reporte EEN',
  })
}

export async function updateEenReport(id, data) {
  return fetchApi(`/nutricion/reporte-een/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar el reporte EEN',
  })
}

export async function deleteEenReport(id) {
  return fetchApi(`/nutricion/reporte-een/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar el reporte EEN',
  })
}
