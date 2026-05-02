/**
 * @file Tests de integración para GET /api/icd11/search.
 * @description Verifica autenticación, validación del parámetro q y el proxy
 * hacia la API de la OMS (ICD-11 MMS). Las llamadas externas se mockean con
 * global.fetch.
 */

import request from 'supertest'
import app from '#app'
import assert from 'assert'

// ─── Helpers ────────────────────────────────────────────────────────────────

const FAKE_TOKEN_RESPONSE = {
  access_token: 'fake-token',
  expires_in: 3600,
  token_type: 'Bearer',
}

/**
 * Respuesta de búsqueda falsa para ICD-11 MMS.
 * El campo `title` viene con etiquetas <em> que el endpoint debe limpiar.
 */
const FAKE_SEARCH_RESPONSE = {
  destinationEntities: [
    {
      id: 'http://id.who.int/icd/release/11/2024-01/mms/1528414070/unspecified',
      title: "Fiebre <em class='found'>tifoidea</em>, sin especificación",
      theCode: '1A07.Z',
      chapter: '01',
    },
    {
      id: 'http://id.who.int/icd/release/11/2024-01/mms/1528414070/other',
      title: "Otra fiebre <em class='found'>tifoidea</em> especificada",
      theCode: '1A07.Y',
      chapter: '01',
    },
    {
      // Sin theCode: debe filtrarse
      id: 'http://id.who.int/icd/release/11/2024-01/mms/foundation-only',
      title: 'Entidad sin código',
      theCode: null,
    },
  ],
}

function mockFetchSuccess() {
  return async (url) => ({
    ok: true,
    json: async () =>
      url.includes('icdaccessmanagement') ? FAKE_TOKEN_RESPONSE : FAKE_SEARCH_RESPONSE,
  })
}

// ─── Setup ───────────────────────────────────────────────────────────────────

let agent
let originalFetch

beforeAll(async () => {
  agent = request.agent(app)
  await agent.post('/auth/login').send({
    email: 'carlos.herrera@cais.com',
    password: '123',
  })

  originalFetch = global.fetch
})

afterEach(() => {
  global.fetch = originalFetch
})

// ─── GET /api/icd11/search ───────────────────────────────────────────────────

describe('GET /api/icd11/search', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get('/api/icd11/search?q=tifoidea')
    assert.equal(res.status, 401)
  })

  /**
   * @test Sin el parámetro q devuelve 400.
   */
  test('400 — falta parámetro q', async () => {
    global.fetch = mockFetchSuccess()
    const res = await agent.get('/api/icd11/search')
    assert.equal(res.status, 400)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })

  /**
   * @test q vacío (solo espacios) devuelve 400.
   */
  test('400 — q vacío devuelve 400', async () => {
    global.fetch = mockFetchSuccess()
    const res = await agent.get('/api/icd11/search?q=   ')
    assert.equal(res.status, 400)
  })

  /**
   * @test Búsqueda exitosa devuelve array con codigo y descripcion.
   */
  test('200 — devuelve array con codigo y descripcion', async () => {
    global.fetch = mockFetchSuccess()
    const res = await agent.get('/api/icd11/search?q=tifoidea')
    assert.equal(res.status, 200)
    assert(Array.isArray(res.body), 'response should be an array')
    assert(res.body.length > 0, 'array should not be empty')
    const first = res.body[0]
    assert(first['codigo'] !== undefined, 'property codigo should exist')
    assert(first['descripcion'] !== undefined, 'property descripcion should exist')
  })

  /**
   * @test theCode y title se mapean y las etiquetas <em> se eliminan.
   */
  test('200 — limpia etiquetas <em> del title', async () => {
    global.fetch = mockFetchSuccess()
    const res = await agent.get('/api/icd11/search?q=tifoidea')
    assert.equal(res.status, 200)
    assert.equal(res.body[0].codigo, '1A07.Z')
    assert.equal(res.body[0].descripcion, 'Fiebre tifoidea, sin especificación')
    assert(
      !res.body[0].descripcion.includes('<em'),
      'descripcion should not contain <em> tags'
    )
  })

  /**
   * @test Las entidades sin theCode se excluyen del resultado.
   */
  test('200 — filtra entidades sin theCode', async () => {
    global.fetch = mockFetchSuccess()
    const res = await agent.get('/api/icd11/search?q=tifoidea')
    assert.equal(res.status, 200)
    // El mock tiene 3 entidades, una con theCode null debe filtrarse
    assert.equal(res.body.length, 2)
    for (const item of res.body) {
      assert(item.codigo, 'every result should have a codigo')
    }
  })

  /**
   * @test Cuando la API de la OMS falla devuelve 502.
   */
  test('502 — error en la API de la OMS devuelve 502', async () => {
    global.fetch = async (url) => {
      if (url.includes('icdaccessmanagement')) {
        return { ok: true, json: async () => FAKE_TOKEN_RESPONSE }
      }
      return { ok: false, status: 503, text: async () => 'Service unavailable' }
    }

    const res = await agent.get('/api/icd11/search?q=tifoidea')
    assert.equal(res.status, 502)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })

  /**
   * @test Cuando falla la obtención del token devuelve 502.
   */
  test('502 — error en el token devuelve 502', async () => {
    global.fetch = async () => ({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    })
    const res = await agent.get('/api/icd11/search?q=tifoidea')
    assert.equal(res.status, 502)
  })

  /**
   * @test destinationEntities vacío devuelve array vacío.
   */
  test('200 — sin resultados devuelve array vacío', async () => {
    global.fetch = async (url) => ({
      ok: true,
      json: async () =>
        url.includes('icdaccessmanagement')
          ? FAKE_TOKEN_RESPONSE
          : { destinationEntities: [] },
    })

    const res = await agent.get('/api/icd11/search?q=zzzzzzz')
    assert.equal(res.status, 200)
    assert(Array.isArray(res.body), 'response should be an array')
    assert.equal(res.body.length, 0)
  })
})
