/**
 * @file Tests de integración para el CRUD de usuarios.
 * @description Verifica listado, paginación, filtros, creación, actualización
 * y eliminación de usuarios. Todas las rutas requieren sesión activa.
 */

import request from 'supertest'
import app from '#app'
import assert from 'assert'

// ─── Setup ──────────────────────────────────────────────────────────

/** @type {import('supertest').Agent} Agente con sesión autenticada */
let agent

beforeAll(async () => {
  agent = request.agent(app)

  await agent.post('/auth/login').send({
    email: 'carlos.herrera@cais.com',
    password: '123',
  })
})

// ─── GET /usuarios ──────────────────────────────────────────────────

/**
 * @description Suite para GET /usuarios.
 * Verifica listado paginado, filtros y ordenamiento.
 */
describe('GET /usuarios', () => {
  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get('/usuarios')
    assert.equal(res.status, 401)
  })

  /**
   * @test Devuelve 200 con estructura { users, count }.
   */
  test('200 — retorna lista paginada', async () => {
    const res = await agent.get('/usuarios')
    assert.equal(res.status, 200)
    assert(res.body['users'] !== undefined, 'property users should exist')
    assert(res.body['count'] !== undefined, 'property count should exist')
    assert(Array.isArray(res.body.users), 'users should be an array')
  })

  /**
   * @test Con limit=2 devuelve como máximo 2 usuarios.
   */
  test('200 — respeta parámetros de paginación', async () => {
    const res = await agent.get('/usuarios?page=1&limit=2')
    assert.equal(res.status, 200)
    assert(res.body.users.length <= 2, 'users.length should be <= 2')
  })

  /**
   * @test Filtrando por status=ACTIVO todos los resultados tienen estado ACTIVO.
   */
  test('200 — filtra por status', async () => {
    const res = await agent.get('/usuarios?status=ACTIVO')
    assert.equal(res.status, 200)
    for (const user of res.body.users) {
      assert.equal(user.estado, 'ACTIVO')
    }
  })

  /**
   * @test Sin filtro de status incluye invitaciones pendientes vigentes en el resultado.
   */
  test('200 — sin filtro incluye pendientes', async () => {
    const { prisma } = await import('#config/prisma.js')
    const { uuidToBuffer } = await import('#lib/uuid.js')
    const { randomUUID } = await import('node:crypto')

    const token = randomUUID()
    const correo = `no.filter.pending.${Date.now()}@test.com`

    const rolRow = await prisma.roles.findFirst({
      where: { codigo: 'PASANTE' },
      select: { id: true },
    })
    const userRow = await prisma.usuarios.findFirst({ select: { id: true } })

    await prisma.invitaciones_registro.create({
      data: {
        correo,
        rol_id: rolRow.id,
        token: uuidToBuffer(token),
        expira_at: new Date(Date.now() + 48 * 60 * 60 * 1000),
        creado_por: userRow.id,
      },
    })

    try {
      const res = await agent.get('/usuarios')
      assert.equal(res.status, 200)
      const found = res.body.users.some((u) => u.correo === correo)
      assert(
        found,
        'pending invitation should appear when no status filter is applied'
      )
    } finally {
      await prisma.invitaciones_registro.deleteMany({ where: { correo } })
    }
  })

  /**
   * @test Búsqueda por nombre o correo devuelve 200.
   */
  test('200 — busca por nombre o correo', async () => {
    const res = await agent.get('/usuarios?search=carlos')
    assert.equal(res.status, 200)
  })

  /**
   * @test Ordenamiento por nombre ascendente devuelve 200.
   */
  test('200 — ordena por nombre ascendente', async () => {
    const res = await agent.get('/usuarios?sortBy=nombre-asc')
    assert.equal(res.status, 200)
  })

  /**
   * @test Filtrando por status=PENDIENTE devuelve invitaciones no usadas con estado PENDIENTE.
   */
  test('200 — filtra invitaciones pendientes con status=PENDIENTE', async () => {
    const { prisma } = await import('#config/prisma.js')
    const { uuidToBuffer } = await import('#lib/uuid.js')
    const { randomUUID } = await import('node:crypto')

    const token = randomUUID()
    const correo = `pending.filter.${Date.now()}@test.com`

    const rolRow = await prisma.roles.findFirst({
      where: { codigo: 'PASANTE' },
      select: { id: true },
    })
    const userRow = await prisma.usuarios.findFirst({ select: { id: true } })

    await prisma.invitaciones_registro.create({
      data: {
        correo,
        rol_id: rolRow.id,
        token: uuidToBuffer(token),
        expira_at: new Date(Date.now() + 48 * 60 * 60 * 1000),
        creado_por: userRow.id,
      },
    })

    try {
      const res = await agent.get('/usuarios?status=PENDIENTE')
      assert.equal(res.status, 200)
      assert(Array.isArray(res.body.users), 'users should be an array')
      assert(res.body.count >= 1, 'count should be at least 1')
      for (const user of res.body.users) {
        assert.equal(user.estado, 'PENDIENTE')
        assert(user.correo !== undefined, 'pendiente user should have correo')
      }
    } finally {
      await prisma.invitaciones_registro.deleteMany({ where: { correo } })
    }
  })

  /**
   * @test Invitaciones expiradas no aparecen en el listado de pendientes.
   */
  test('200 — excluye invitaciones expiradas del listado de pendientes', async () => {
    const { prisma } = await import('#config/prisma.js')
    const { uuidToBuffer } = await import('#lib/uuid.js')
    const { randomUUID } = await import('node:crypto')

    const token = randomUUID()
    const correo = `expired.filter.${Date.now()}@test.com`

    const rolRow = await prisma.roles.findFirst({
      where: { codigo: 'PASANTE' },
      select: { id: true },
    })
    const userRow = await prisma.usuarios.findFirst({ select: { id: true } })

    await prisma.invitaciones_registro.create({
      data: {
        correo,
        rol_id: rolRow.id,
        token: uuidToBuffer(token),
        expira_at: new Date(Date.now() - 1000), // ya expiró
        creado_por: userRow.id,
      },
    })

    try {
      const res = await agent.get('/usuarios?status=PENDIENTE')
      assert.equal(res.status, 200)
      const found = res.body.users.some((u) => u.correo === correo)
      assert(!found, 'expired invitation should not appear in pending list')
    } finally {
      await prisma.invitaciones_registro.deleteMany({ where: { correo } })
    }
  })
})

// ─── GET /usuarios/:id ─────────────────────────────────────────────

/**
 * @description Suite para GET /usuarios/:id.
 * Verifica obtención de usuario por ID, 404 y protección con auth.
 */
describe('GET /usuarios/:id', () => {
  /** @type {string} ID del primer usuario de la base de datos */
  let userId

  beforeAll(async () => {
    const res = await agent.get('/usuarios?page=1&limit=1')
    userId = res.body.users[0]?.id
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).get(
      '/usuarios/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 401)
  })

  /**
   * @test ID existente devuelve 200 con id, correo y rol.
   */
  test('200 — retorna usuario existente', async () => {
    if (!userId) return
    const res = await agent.get(`/usuarios/${userId}`)
    assert.equal(res.status, 200)
    assert.equal(res.body['id'], userId)
    assert(res.body['correo'] !== undefined, 'property correo should exist')
    assert(res.body['rol'] !== undefined, 'property rol should exist')
  })

  /**
   * @test UUID inexistente devuelve 404 con propiedad message.
   */
  test('404 — usuario no existe', async () => {
    const res = await agent.get(
      '/usuarios/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
    assert(res.body['message'] !== undefined, 'property message should exist')
  })
})

// ─── POST /usuarios ─────────────────────────────────────────────────

/**
 * @description Suite para POST /usuarios (creación directa por admin).
 * Verifica creación de pasante y coordinador, validaciones y conflictos.
 */
describe('POST /usuarios — creación directa por admin', () => {
  const pasanteValido = {
    nombre: 'Test',
    apellido: 'Pasante',
    correo: `test.pasante.${Date.now()}@test.com`,
    fechaNacimiento: '2000-01-01',
    telefono: '6861111111',
    rol: 'pasante',
    password: 'Abc12345!',
    matricula: 'TMAT01',
    servicioInicioAnio: '2026',
    servicioInicioPeriodo: '1',
    servicioFinAnio: '2026',
    servicioFinPeriodo: '2',
  }

  const coordValido = {
    nombre: 'Test',
    apellido: 'Coord',
    correo: `test.coord.${Date.now()}@test.com`,
    fechaNacimiento: '1990-01-01',
    telefono: '6862222222',
    rol: 'coordinador',
    password: 'Abc12345!',
    cedula: 'TCED01',
  }

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).post('/usuarios').send(pasanteValido)
    assert.equal(res.status, 401)
  })

  /**
   * @test Pasante con datos válidos se crea y devuelve 201 con id y correo.
   */
  test('201 — crea pasante', async () => {
    const res = await agent.post('/usuarios').send(pasanteValido)
    assert.equal(res.status, 201)
    assert.equal(res.body['message'], 'Usuario creado exitosamente')
    assert(res.body.usuario['id'] !== undefined, 'property should exist')
    assert.equal(res.body.usuario.correo, pasanteValido.correo)

    // limpiar
    await agent.delete(`/usuarios/${res.body.usuario.id}`)
  })

  /**
   * @test Coordinador con datos válidos se crea y devuelve 201 con id.
   */
  test('201 — crea coordinador', async () => {
    const res = await agent.post('/usuarios').send(coordValido)
    assert.equal(res.status, 201)
    assert(res.body.usuario['id'] !== undefined, 'property should exist')

    await agent.delete(`/usuarios/${res.body.usuario.id}`)
  })

  /**
   * @test Body con solo nombre (sin campos requeridos) devuelve 422 ValidationError.
   */
  test('422 — rechaza datos inválidos', async () => {
    const res = await agent.post('/usuarios').send({ nombre: 'Solo nombre' })
    assert.equal(res.status, 422)
    assert.equal(res.body['error'], 'ValidationError')
  })

  /**
   * @test Password menor a 6 caracteres devuelve 422.
   */
  test('422 — rechaza password menor a 6 caracteres', async () => {
    const res = await agent
      .post('/usuarios')
      .send({ ...pasanteValido, password: '12345' })
    assert.equal(res.status, 422)
  })

  /**
   * @test Password simple de 6+ caracteres es aceptada (admin no requiere complejidad).
   */
  test('201 — acepta password simple de 6+ caracteres', async () => {
    const res = await agent.post('/usuarios').send({
      ...pasanteValido,
      password: '123456',
      correo: `simple.pass.${Date.now()}@uabc.edu.mx`,
    })
    assert.equal(res.status, 201)

    await agent.delete(`/usuarios/${res.body.usuario.id}`)
  })

  /**
   * @test Crear dos usuarios con el mismo correo devuelve 409 Conflict en el segundo.
   */
  test('409 — rechaza correo duplicado', async () => {
    const correo = `dup.${Date.now()}@test.com`
    const data = { ...pasanteValido, correo }

    const first = await agent.post('/usuarios').send(data)
    assert.equal(first.status, 201)

    const second = await agent.post('/usuarios').send(data)
    assert.equal(second.status, 409)
    assert.equal(second.body['error'], 'Conflict')

    await agent.delete(`/usuarios/${first.body.usuario.id}`)
  })
})

// ─── PATCH /usuarios/:id ────────────────────────────────────────────

/**
 * @description Suite para PATCH /usuarios/:id.
 * Verifica actualización parcial y protección con auth.
 */
describe('PATCH /usuarios/:id', () => {
  /** @type {string} ID del usuario de prueba creado en beforeAll */
  let userId

  beforeAll(async () => {
    const res = await agent.post('/usuarios').send({
      nombre: 'Patch',
      apellido: 'Test',
      correo: `patch.${Date.now()}@test.com`,
      fechaNacimiento: '2000-01-01',
      telefono: '6863333333',
      rol: 'pasante',
      password: 'Abc12345!',
      matricula: 'PMAT01',
      servicioInicioAnio: '2026',
      servicioInicioPeriodo: '1',
      servicioFinAnio: '2026',
      servicioFinPeriodo: '2',
    })
    userId = res.body.usuario.id
  })

  afterAll(async () => {
    if (userId) await agent.delete(`/usuarios/${userId}`)
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app)
      .patch('/usuarios/00000000-0000-0000-0000-000000000000')
      .send({ nombre: 'Sin auth' })
    assert.equal(res.status, 401)
  })

  /**
   * @test Actualizar nombre devuelve 200 con el nuevo valor.
   */
  test('200 — actualiza nombre', async () => {
    const res = await agent
      .patch(`/usuarios/${userId}`)
      .send({ nombre: 'Nombre Actualizado' })
    assert.equal(res.status, 200)
    assert.equal(res.body.nombre, 'Nombre Actualizado')
  })

  /**
   * @test Actualizar teléfono devuelve 200 con el nuevo valor.
   */
  test('200 — actualiza telefono', async () => {
    const res = await agent
      .patch(`/usuarios/${userId}`)
      .send({ telefono: '6861234567' })
    assert.equal(res.status, 200)
    assert.equal(res.body.telefono, '6861234567')
  })

  /**
   * @test Actualizar matrícula devuelve 200 con el nuevo valor.
   */
  test('200 — actualiza matricula', async () => {
    const res = await agent
      .patch(`/usuarios/${userId}`)
      .send({ matricula: 'MAT-UPDATED' })
    assert.equal(res.status, 200)
    assert.equal(res.body.matricula, 'MAT-UPDATED')
  })

  /**
   * @test Actualizar nombre y apellido los combina en el campo nombre.
   */
  test('200 — combina nombre y apellido', async () => {
    const res = await agent
      .patch(`/usuarios/${userId}`)
      .send({ nombre: 'Nuevo', apellido: 'Nombre' })
    assert.equal(res.status, 200)
    assert.equal(res.body.nombre, 'Nuevo Nombre')
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — usuario no existe', async () => {
    const res = await agent
      .patch('/usuarios/00000000-0000-0000-0000-000000000000')
      .send({ nombre: 'No existe' })
    assert.equal(res.status, 404)
  })
})

// ─── PATCH /usuarios/:id — estado ──────────────────────────────────

/**
 * @description Suite para PATCH /usuarios/:id actualizando el campo estado.
 */
describe('PATCH /usuarios/:id — actualizar estado', () => {
  let userId

  beforeAll(async () => {
    const res = await agent.get('/usuarios?status=ACTIVO&limit=1&page=1')
    userId = res.body.users[0]?.id
  })

  /**
   * @test Cambiar estado a INACTIVO devuelve 200 con estado actualizado.
   */
  test('200 — bloquea usuario (ACTIVO → INACTIVO)', async () => {
    if (!userId) return
    const res = await agent
      .patch(`/usuarios/${userId}`)
      .send({ estado: 'INACTIVO' })
    assert.equal(res.status, 200)
    assert.equal(res.body.estado, 'INACTIVO')
  })

  /**
   * @test Cambiar estado a ACTIVO devuelve 200 con estado actualizado.
   */
  test('200 — desbloquea usuario (INACTIVO → ACTIVO)', async () => {
    if (!userId) return
    const res = await agent
      .patch(`/usuarios/${userId}`)
      .send({ estado: 'ACTIVO' })
    assert.equal(res.status, 200)
    assert.equal(res.body.estado, 'ACTIVO')
  })

  /**
   * @test Estado inválido devuelve 422.
   */
  test('422 — estado inválido es rechazado', async () => {
    if (!userId) return
    const res = await agent
      .patch(`/usuarios/${userId}`)
      .send({ estado: 'BLOQUEADO' })
    assert.equal(res.status, 422)
  })
})

// ─── DELETE /usuarios/:id ───────────────────────────────────────────

/**
 * @description Suite para DELETE /usuarios/:id.
 * Verifica eliminación exitosa, 404 y protección con auth.
 */
describe('DELETE /usuarios/:id', () => {
  /** @type {string} ID del usuario de prueba creado en beforeAll */
  let userId

  beforeAll(async () => {
    const res = await agent.post('/usuarios').send({
      nombre: 'Delete',
      apellido: 'Test',
      correo: `delete.${Date.now()}@test.com`,
      fechaNacimiento: '2000-01-01',
      telefono: '6864444444',
      rol: 'pasante',
      password: 'Abc12345!',
      matricula: 'DMAT01',
      servicioInicioAnio: '2026',
      servicioInicioPeriodo: '1',
      servicioFinAnio: '2026',
      servicioFinPeriodo: '2',
    })
    userId = res.body.usuario?.id
  })

  afterAll(async () => {
    if (userId) await agent.delete(`/usuarios/${userId}`)
  })

  /**
   * @test Sin sesión devuelve 401.
   */
  test('401 — sin sesión devuelve 401', async () => {
    const res = await request(app).delete(
      '/usuarios/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 401)
  })

  /**
   * @test UUID inexistente devuelve 404.
   */
  test('404 — usuario no existe', async () => {
    const res = await agent.delete(
      '/usuarios/00000000-0000-0000-0000-000000000000'
    )
    assert.equal(res.status, 404)
  })

  /**
   * @test Usuario existente se elimina y devuelve 200 con propiedad message.
   */
  test('200 — elimina usuario existente', async () => {
    if (!userId) return
    const res = await agent.delete(`/usuarios/${userId}`)
    assert.equal(res.status, 200)
    assert(res.body['message'] !== undefined, 'property message should exist')
    userId = null
  })
})
