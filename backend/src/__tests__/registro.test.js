import request from 'supertest'
import app from '../app.js'
import { prisma } from '../config/prisma.js'
import { uuidToBuffer } from '../lib/uuid.js'
import { randomUUID } from 'node:crypto'
import assert from 'assert'

const api = request(app)

// ─── POST /usuarios/registro ────────────────────────────────────────

describe('POST /usuarios/registro — auto-registro con token', () => {
  let pasanteToken
  let coordToken
  let pasanteCorreo
  let coordCorreo

  beforeAll(async () => {
    const rolPasante = await prisma.roles.findFirst({
      where: { codigo: 'PASANTE' },
      select: { id: true },
    })
    const rolCoord = await prisma.roles.findFirst({
      where: { codigo: 'COORDINADOR' },
      select: { id: true },
    })
    const userRow = await prisma.usuarios.findFirst({ select: { id: true } })

    pasanteToken = randomUUID()
    coordToken = randomUUID()
    pasanteCorreo = `reg.pasante.${Date.now()}@test.com`
    coordCorreo = `reg.coord.${Date.now()}@test.com`

    const expiraAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.invitaciones_registro.createMany({
      data: [
        {
          correo: pasanteCorreo,
          rol_id: rolPasante.id,
          token: uuidToBuffer(pasanteToken),
          expira_at: expiraAt,
          creado_por: userRow.id,
        },
        {
          correo: coordCorreo,
          rol_id: rolCoord.id,
          token: uuidToBuffer(coordToken),
          expira_at: expiraAt,
          creado_por: userRow.id,
        },
      ],
    })
  })

  afterAll(async () => {
    await prisma.invitaciones_registro.deleteMany({
      where: { correo: { in: [pasanteCorreo, coordCorreo] } },
    })
    await prisma.usuarios.deleteMany({
      where: { correo: { in: [pasanteCorreo, coordCorreo] } },
    })
  })

  test('201 — registra pasante con token válido', async () => {
    const res = await api.post('/usuarios/registro').send({
      token: pasanteToken,
      nombre: 'Reg',
      apellido: 'Pasante',
      fechaNacimiento: '2000-01-01',
      telefono: '6861111111',
      password: 'Abc12345!',
      confirmPassword: 'Abc12345!',
      matricula: 'RMAT01',
      servicioInicioAnio: '2026',
      servicioInicioPeriodo: '1',
      servicioFinAnio: '2026',
      servicioFinPeriodo: '2',
    })

    assert.equal(res.status, 201)
    assert.equal(res.body.message, 'Registro completado exitosamente')
    assert(res.body.usuario['id'] !== undefined, 'property id should exist')
    assert.equal(res.body.usuario.correo, pasanteCorreo)
  })

  test('201 — registra coordinador con token válido', async () => {
    const res = await api.post('/usuarios/registro').send({
      token: coordToken,
      nombre: 'Reg',
      apellido: 'Coord',
      fechaNacimiento: '1990-01-01',
      telefono: '6862222222',
      password: 'Abc12345!',
      confirmPassword: 'Abc12345!',
      cedula: 'RCED01',
    })

    assert.equal(res.status, 201)
    assert(res.body.usuario['id'] !== undefined, 'property id should exist')
  })

  test('404 — token ya usado', async () => {
    const res = await api.post('/usuarios/registro').send({
      token: pasanteToken,
      nombre: 'X',
      apellido: 'Y',
      fechaNacimiento: '2000-01-01',
      telefono: '6863333333',
      password: 'Abc12345!',
      confirmPassword: 'Abc12345!',
      matricula: 'M1',
      servicioInicioAnio: '2026',
      servicioInicioPeriodo: '1',
      servicioFinAnio: '2026',
      servicioFinPeriodo: '2',
    })

    assert.equal(res.status, 404)
    assert.equal(res.body['error'], 'NotFound')
  })

  test('404 — token inexistente', async () => {
    const res = await api.post('/usuarios/registro').send({
      token: randomUUID(),
      nombre: 'X',
      apellido: 'Y',
      fechaNacimiento: '2000-01-01',
      telefono: '6864444444',
      password: 'Abc12345!',
      confirmPassword: 'Abc12345!',
      matricula: 'M2',
      servicioInicioAnio: '2026',
      servicioInicioPeriodo: '1',
      servicioFinAnio: '2026',
      servicioFinPeriodo: '2',
    })

    assert.equal(res.status, 404)
  })

  test('422 — password débil rechazada', async () => {
    const weakToken = randomUUID()
    const weakCorreo = `weak.${Date.now()}@test.com`
    const rolRow = await prisma.roles.findFirst({
      where: { codigo: 'PASANTE' },
      select: { id: true },
    })
    const userRow = await prisma.usuarios.findFirst({ select: { id: true } })

    await prisma.invitaciones_registro.create({
      data: {
        correo: weakCorreo,
        rol_id: rolRow.id,
        token: uuidToBuffer(weakToken),
        expira_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        creado_por: userRow.id,
      },
    })

    const res = await api.post('/usuarios/registro').send({
      token: weakToken,
      nombre: 'Weak',
      apellido: 'Pass',
      fechaNacimiento: '2000-01-01',
      telefono: '6865555555',
      password: 'simple',
      confirmPassword: 'simple',
      matricula: 'M3',
      servicioInicioAnio: '2026',
      servicioInicioPeriodo: '1',
      servicioFinAnio: '2026',
      servicioFinPeriodo: '2',
    })

    assert.equal(res.status, 422)

    await prisma.invitaciones_registro.deleteMany({
      where: { correo: weakCorreo },
    })
  })
})
