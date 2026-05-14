import { fetchApi } from '@lib/fetchApi'

export function searchIcd11(q) {
  return fetchApi(`/api/icd11/search?q=${encodeURIComponent(q)}`)
}
