import { fetchApi } from '@lib/fetchApi'

export function searchIcd11(q) {
  return fetchApi(`/icd11/search?q=${encodeURIComponent(q)}`, {
    errorMsg: 'Error al consultar la API de CIE-11',
  })
}
