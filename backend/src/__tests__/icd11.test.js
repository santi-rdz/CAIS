import request from 'supertest'
import app from '#app'
import { authenticatedAdmin } from './helpers/agents.js'
import { createCleanupTracker } from './helpers/cleanup.js'
import { resetIcd11Cache } from '#services/icd11.js'

const api = request(app)
const tracker = createCleanupTracker()

let agent
let originalFetch

const FAKE_TOKEN = { access_token: 'fake-token', expires_in: 3600, token_type: 'Bearer' }

// `title` trae etiquetas <em> de resaltado que el service debe limpiar; la
// última entidad no tiene `theCode` y debe filtrarse.
const FAKE_SEARCH = {
  destinationEntities: [
    {
      id: '.../1',
      title: "Fiebre <em class='found'>tifoidea</em>, sin especificación",
      theCode: '1A07.Z',
    },
    { id: '.../2', title: "Otra fiebre <em class='found'>tifoidea</em>", theCode: '1A07.Y' },
    { id: '.../foundation', title: 'Entidad sin código', theCode: null },
  ],
}

const isTokenUrl = (url) => url.includes('icdaccessmanagement')

function mockFetchOk() {
  return async (url) => ({
    ok: true,
    json: async () => (isTokenUrl(url) ? FAKE_TOKEN : FAKE_SEARCH),
  })
}

beforeAll(async () => {
  ;({ agent } = await authenticatedAdmin({ tracker }))
  originalFetch = global.fetch
})

afterEach(() => {
  global.fetch = originalFetch
  resetIcd11Cache()
})

afterAll(() => tracker.cleanup())

describe('GET /icd11/search', () => {
  test('401 — sin sesión', async () => {
    const res = await api.get('/icd11/search?q=tifoidea')
    expect(res.status).toBe(401)
  })

  test('422 — falta parámetro q', async () => {
    const res = await agent.get('/icd11/search')
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ValidationError')
  })

  test('422 — q vacío (solo espacios)', async () => {
    const res = await agent.get('/icd11/search?q=%20%20')
    expect(res.status).toBe(422)
  })

  test('200 — devuelve array de { codigo, descripcion } y limpia <em>', async () => {
    global.fetch = mockFetchOk()
    const res = await agent.get('/icd11/search?q=tifoidea')
    expect(res.status).toBe(200)
    expect(res.body[0]).toEqual({
      codigo: '1A07.Z',
      descripcion: 'Fiebre tifoidea, sin especificación',
    })
    expect(res.body[0].descripcion).not.toContain('<em')
  })

  test('200 — filtra entidades sin theCode', async () => {
    global.fetch = mockFetchOk()
    const res = await agent.get('/icd11/search?q=tifoidea')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body.every((r) => r.codigo)).toBe(true)
  })

  test('200 — sin resultados devuelve array vacío', async () => {
    global.fetch = async (url) => ({
      ok: true,
      json: async () => (isTokenUrl(url) ? FAKE_TOKEN : { destinationEntities: [] }),
    })
    const res = await agent.get('/icd11/search?q=zzzzz')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  test('200 — búsqueda por código exacto resuelve vía codeinfo', async () => {
    global.fetch = async (url) => {
      if (isTokenUrl(url)) return { ok: true, json: async () => FAKE_TOKEN }
      if (url.includes('/codeinfo/'))
        return { ok: true, json: async () => ({ stemId: 'http://id.who.int/icd/.../123' }) }
      // entidad resuelta desde el stemId
      return {
        ok: true,
        json: async () => ({ code: '5A10', title: { '@value': 'Diabetes mellitus tipo 1' } }),
      }
    }
    const res = await agent.get('/icd11/search?q=5A10')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ codigo: '5A10', descripcion: 'Diabetes mellitus tipo 1' }])
  })

  test('200 — código inexistente cae a búsqueda de texto', async () => {
    global.fetch = async (url) => {
      if (isTokenUrl(url)) return { ok: true, json: async () => FAKE_TOKEN }
      if (url.includes('/codeinfo/'))
        return { ok: false, status: 404, text: async () => 'not found' }
      return { ok: true, json: async () => ({ destinationEntities: [] }) }
    }
    const res = await agent.get('/icd11/search?q=9Z99')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  test('502 — falla la API de búsqueda', async () => {
    global.fetch = async (url) =>
      isTokenUrl(url)
        ? { ok: true, json: async () => FAKE_TOKEN }
        : { ok: false, status: 503, text: async () => 'unavailable' }
    const res = await agent.get('/icd11/search?q=tifoidea')
    expect(res.status).toBe(502)
    expect(res.body.message).toBeDefined()
  })

  test('502 — falla la obtención del token', async () => {
    global.fetch = async () => ({ ok: false, status: 401, text: async () => 'unauthorized' })
    const res = await agent.get('/icd11/search?q=tifoidea')
    expect(res.status).toBe(502)
  })
})
