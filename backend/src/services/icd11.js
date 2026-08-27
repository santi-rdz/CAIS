import { serverConfig } from '#config/env.js'
import { BadGatewayError } from '#lib/appError.js'

const TOKEN_URL = 'https://icdaccessmanagement.who.int/connect/token'
const MMS_URL = 'https://id.who.int/icd/release/11/2024-01/mms'
const SEARCH_URL = `${MMS_URL}/search`
const CODEINFO_URL = `${MMS_URL}/codeinfo`
const UPSTREAM_TIMEOUT_MS = 10_000
// El endpoint /search solo matchea texto (títulos/sinónimos), no el código; una
// query con dígito y sin espacios se trata como código y se resuelve por codeinfo.
const CODE_RE = /^(?=.*\d)[0-9a-z.]{2,8}$/i
const TOKEN_REFRESH_MARGIN_MS = 60_000 // renueva 1 min antes de expirar

let cachedToken = null
let tokenExpiresAt = 0

async function fetchWithTimeout(url, options = {}, timeoutMs = UPSTREAM_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  // La API de la OMS pide HTTP Basic Auth (id:secret), no params en el body.
  const { icdClientId, icdClientSecret } = serverConfig
  const credentials = Buffer.from(`${icdClientId}:${icdClientSecret}`).toString('base64')

  const res = await fetchWithTimeout(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'icdapi_access',
    }).toString(),
  })
  if (!res.ok) throw new Error(`token ${res.status}`)

  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000 - TOKEN_REFRESH_MARGIN_MS
  return cachedToken
}

// Los resultados envuelven el término buscado en <em class='found'>…</em>.
const stripHighlight = (html) => html.replace(/<\/?em[^>]*>/g, '')

const whoHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
  'Accept-Language': 'es',
  'API-Version': 'v2',
})

// Resuelve un código exacto: codeinfo → stemId → entidad → título.
// Devuelve null si el código no existe (para caer a búsqueda de texto).
async function resolveByCode(code, token) {
  const infoRes = await fetchWithTimeout(`${CODEINFO_URL}/${encodeURIComponent(code)}`, {
    headers: whoHeaders(token),
  })
  if (!infoRes.ok) return null

  const info = await infoRes.json()
  if (!info.stemId) return null

  const entityRes = await fetchWithTimeout(info.stemId.replace(/^http:/, 'https:'), {
    headers: whoHeaders(token),
  })
  if (!entityRes.ok) return null

  const entity = await entityRes.json()
  if (!entity.code) return null
  return { codigo: entity.code, descripcion: stripHighlight(entity.title?.['@value'] ?? '') }
}

async function searchByText(q, token) {
  const res = await fetchWithTimeout(`${SEARCH_URL}?q=${encodeURIComponent(q)}`, {
    headers: whoHeaders(token),
  })
  if (!res.ok) throw new Error(`search ${res.status}`)

  const data = await res.json()
  return (data.destinationEntities ?? [])
    .filter((entity) => entity.theCode)
    .map((entity) => ({
      codigo: entity.theCode,
      descripcion: stripHighlight(entity.title ?? ''),
    }))
}

export async function searchIcd11(q) {
  try {
    const token = await getToken()
    const term = q.trim()

    if (CODE_RE.test(term)) {
      const byCode = await resolveByCode(term.toUpperCase(), token)
      if (byCode) return [byCode]
    }

    return await searchByText(term, token)
  } catch (err) {
    console.error('[icd11] search error:', err.message)
    throw new BadGatewayError('Error al consultar la API de CIE-11')
  }
}

// Solo para tests: limpia el token cacheado entre casos.
export function resetIcd11Cache() {
  cachedToken = null
  tokenExpiresAt = 0
}
