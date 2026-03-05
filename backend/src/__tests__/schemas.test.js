import { validateUser, validatePartialUser } from '../schemas/usuario.js'
import { validateRegistro } from '../schemas/registro.js'
import { validateInvitedUser } from '../schemas/createPreUser.js'
import { describe, test } from 'node:test'
import assert from 'node:assert'

// ─── usuario.js (admin creation) ────────────────────────────────────

describe('validateUser — creación directa por admin', () => {
  const basePasante = {
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan@uabc.edu.mx',
    fechaNacimiento: '2000-01-15',
    telefono: '6861234567',
    rol: 'pasante',
    password: 'abc123',
    matricula: 'MAT001',
    servicioInicioAnio: '2026',
    servicioInicioPeriodo: '1',
    servicioFinAnio: '2026',
    servicioFinPeriodo: '2',
  }

  const baseCoord = {
    nombre: 'Ana',
    apellido: 'López',
    correo: 'ana@uabc.edu.mx',
    fechaNacimiento: '1990-05-20',
    telefono: '6869876543',
    rol: 'coordinador',
    password: 'abc123',
    cedula: 'CED001',
  }

  test('acepta pasante válido', () => {
    const result = validateUser(basePasante)
    assert.equal(result.success, true)
  })

  test('acepta coordinador válido', () => {
    const result = validateUser(baseCoord)
    assert.equal(result.success, true)
  })

  test('rechaza password menor a 6 caracteres', () => {
    const result = validateUser({ ...basePasante, password: '12345' })
    assert.equal(result.success, false)
  })

  test('acepta password simple (sin mayúsculas/especiales)', () => {
    const result = validateUser({ ...basePasante, password: 'simple' })
    assert.equal(result.success, true)
  })

  test('rechaza correo inválido', () => {
    const result = validateUser({ ...basePasante, correo: 'no-es-email' })
    assert.equal(result.success, false)
  })

  test('rechaza teléfono con menos de 10 dígitos', () => {
    const result = validateUser({ ...basePasante, telefono: '12345' })
    assert.equal(result.success, false)
  })

  test('rechaza rol inválido', () => {
    const result = validateUser({ ...basePasante, rol: 'admin' })
    assert.equal(result.success, false)
  })

  test('rechaza pasante sin matrícula', () => {
    const { matricula, ...sinMatricula } = basePasante
    const result = validateUser(sinMatricula)
    assert.equal(result.success, false)
  })

  test('rechaza coordinador sin cédula', () => {
    const { cedula, ...sinCedula } = baseCoord
    const result = validateUser(sinCedula)
    assert.equal(result.success, false)
  })
})

describe('validatePartialUser — actualización parcial', () => {
  test('acepta solo nombre', () => {
    const result = validatePartialUser({ nombre: 'Carlos' })
    assert.equal(result.success, true)
  })

  test('acepta objeto vacío', () => {
    const result = validatePartialUser({})
    assert.equal(result.success, true)
  })

  test('rechaza correo inválido en parcial', () => {
    const result = validatePartialUser({ correo: 'bad' })
    assert.equal(result.success, false)
  })
})

// ─── registro.js (auto-registro con token) ──────────────────────────

describe('validateRegistro — auto-registro', () => {
  const validToken = '550e8400-e29b-41d4-a716-446655440000'

  const basePasante = {
    token: validToken,
    nombre: 'Juan',
    apellido: 'Pérez',
    fechaNacimiento: '2000-01-15',
    telefono: '6861234567',
    password: 'Abc12345!',
    confirmPassword: 'Abc12345!',
    matricula: 'MAT001',
    servicioInicioAnio: '2026',
    servicioInicioPeriodo: '1',
    servicioFinAnio: '2026',
    servicioFinPeriodo: '2',
  }

  const baseCoord = {
    token: validToken,
    nombre: 'Ana',
    apellido: 'López',
    fechaNacimiento: '1990-05-20',
    telefono: '6869876543',
    password: 'Abc12345!',
    confirmPassword: 'Abc12345!',
    cedula: 'CED001',
  }

  test('acepta registro pasante válido', () => {
    const result = validateRegistro(basePasante, 'PASANTE')
    assert.equal(result.success, true)
  })

  test('acepta registro coordinador válido', () => {
    const result = validateRegistro(baseCoord, 'COORDINADOR')
    assert.equal(result.success, true)
  })

  test('rechaza password sin mayúscula', () => {
    const result = validateRegistro(
      { ...basePasante, password: 'abc12345!', confirmPassword: 'abc12345!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  test('rechaza password sin número', () => {
    const result = validateRegistro(
      { ...basePasante, password: 'Abcdefgh!', confirmPassword: 'Abcdefgh!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  test('rechaza password sin carácter especial', () => {
    const result = validateRegistro(
      { ...basePasante, password: 'Abc12345x', confirmPassword: 'Abc12345x' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  test('rechaza password menor a 8 caracteres', () => {
    const result = validateRegistro(
      { ...basePasante, password: 'Ab1!', confirmPassword: 'Ab1!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  test('rechaza confirmPassword que no coincide', () => {
    const result = validateRegistro(
      { ...basePasante, confirmPassword: 'Diferente1!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  test('rechaza token no UUID', () => {
    const result = validateRegistro(
      { ...basePasante, token: 'no-es-uuid' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })
})

// ─── createPreUser.js (invitaciones) ────────────────────────────────

describe('validateInvitedUser — invitaciones', () => {
  test('acepta array de invitaciones válidas', () => {
    const result = validateInvitedUser([
      { email: 'a@uabc.edu.mx', role: 'pasante' },
      { email: 'b@uabc.edu.mx', role: 'coordinador' },
    ])
    assert.equal(result.success, true)
  })

  test('rechaza array vacío', () => {
    const result = validateInvitedUser([])
    assert.equal(result.success, false)
  })

  test('rechaza email inválido', () => {
    const result = validateInvitedUser([{ email: 'no-email', role: 'pasante' }])
    assert.equal(result.success, false)
  })

  test('rechaza rol inválido', () => {
    const result = validateInvitedUser([
      { email: 'a@uabc.edu.mx', role: 'admin' },
    ])
    assert.equal(result.success, false)
  })

  test('rechaza objeto sin array', () => {
    const result = validateInvitedUser({
      email: 'a@uabc.edu.mx',
      role: 'pasante',
    })
    assert.equal(result.success, false)
  })
})
