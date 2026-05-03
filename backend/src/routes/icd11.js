import { Router } from 'express'
import { requireAuth } from '#middleware/auth.js'

export const icd11Router = new Router()

const TOKEN_URL = 'https://icdaccessmanagement.who.int/connect/token'
const SEARCH_URL = 'https://id.who.int/icd/release/11/2024-01/mms/search'
const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

let cachedToken = null
let tokenExpiresAt = 0

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  // WHO ICD API requires HTTP Basic Auth (id:secret), not body params
  const credentials = Buffer.from(
    `${process.env.ICD_CLIENT_ID}:${process.env.ICD_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(TOKEN_URL, {
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

  if (!res.ok) {
    const body = await res.text().catch(() => '(no body)')
    throw new Error(`Token request failed: ${res.status} — ${body}`)
  }

  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiresAt =
    Date.now() + (data.expires_in ? data.expires_in * 1000 : TOKEN_TTL_MS)
  return cachedToken
}

// Search results wrap matching tokens in <em class='found'>...</em> for highlighting
function stripHighlight(html) {
  return html.replace(/<\/?em[^>]*>/g, '')
}

icd11Router.use(requireAuth)

icd11Router.get('/search', async (req, res) => {
  const q = req.query.q?.trim()
  if (!q)
    return res.status(400).json({ message: 'El parámetro q es requerido' })

  try {
    const token = await getToken()
    const url = `${SEARCH_URL}?q=${encodeURIComponent(q)}`

    const apiRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Accept-Language': 'es',
        'API-Version': 'v2',
      },
    })

    if (!apiRes.ok) {
      const body = await apiRes.text().catch(() => '(no body)')
      throw new Error(`WHO search API error: ${apiRes.status} — ${body}`)
    }

    const data = await apiRes.json()

    const results = (data.destinationEntities ?? [])
      .filter((entity) => entity.theCode)
      .map((entity) => ({
        codigo: entity.theCode,
        descripcion: stripHighlight(entity.title ?? ''),
      }))

    res.json(results)
  } catch (err) {
    console.error('[icd11] search error:', err.message)
    res.status(502).json({ message: 'Error al consultar la API de ICD-11' })
  }
})
