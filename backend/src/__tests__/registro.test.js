import request from 'supertest'
import app from '../app.js'
import { pool } from '../config/db.js'
import { randomUUID } from 'node:crypto'

const api = request(app)

// ─── POST /usuarios/registro ────────────────────────────────────────

describe('POST /usuarios/registro — auto-registro con token', () => {
  let pasanteToken
  let coordToken
  let pasanteCorreo
  let coordCorreo

  beforeAll(async () => {
    const [[rolPasante]] = await pool.query("SELECT id FROM roles WHERE codigo = 'PASANTE'")
    const [[rolCoord]] = await pool.query("SELECT id FROM roles WHERE codigo = 'COORDINADOR'")
    const [[userRow]] = await pool.query('SELECT id FROM usuarios LIMIT 1')

    pasanteToken = randomUUID()
    coordToken = randomUUID()
    pasanteCorreo = `reg.pasante.${Date.now()}@test.com`
    coordCorreo = `reg.coord.${Date.now()}@test.com`

    await pool.query(
      `INSERT INTO invitaciones_registro (correo, rol_id, token, expira_at, creado_por)
       VALUES (?, ?, UUID_TO_BIN(?), DATE_ADD(NOW(), INTERVAL 1 DAY), ?),
              (?, ?, UUID_TO_BIN(?), DATE_ADD(NOW(), INTERVAL 1 DAY), ?)`,
      [
        pasanteCorreo, rolPasante.id, pasanteToken, userRow.id,
        coordCorreo, rolCoord.id, coordToken, userRow.id,
      ],
    )
  })

  afterAll(async () => {
    await pool.query('DELETE FROM invitaciones_registro WHERE correo IN (?, ?)', [pasanteCorreo, coordCorreo])
    await pool.query('DELETE FROM usuarios WHERE correo IN (?, ?)', [pasanteCorreo, coordCorreo])
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

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('message', 'Registro completado exitosamente')
    expect(res.body.usuario).toHaveProperty('id')
    expect(res.body.usuario.correo).toBe(pasanteCorreo)
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

    expect(res.status).toBe(201)
    expect(res.body.usuario).toHaveProperty('id')
  })

  test('404 — token ya usado', async () => {
    // pasanteToken ya fue usado en el test anterior
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

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error', 'NotFound')
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

    expect(res.status).toBe(404)
  })

  test('422 — password débil rechazada', async () => {
    const weakToken = randomUUID()
    const weakCorreo = `weak.${Date.now()}@test.com`
    const [[rolRow]] = await pool.query("SELECT id FROM roles WHERE codigo = 'PASANTE'")
    const [[userRow]] = await pool.query('SELECT id FROM usuarios LIMIT 1')

    await pool.query(
      `INSERT INTO invitaciones_registro (correo, rol_id, token, expira_at, creado_por)
       VALUES (?, ?, UUID_TO_BIN(?), DATE_ADD(NOW(), INTERVAL 1 DAY), ?)`,
      [weakCorreo, rolRow.id, weakToken, userRow.id],
    )

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

    expect(res.status).toBe(422)

    await pool.query('DELETE FROM invitaciones_registro WHERE correo = ?', [weakCorreo])
  })
})
