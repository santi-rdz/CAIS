/**
 * @file Tests unitarios para los schemas de validación Zod.
 * @description Verifica que los schemas acepten datos válidos y rechacen datos inválidos
 * sin realizar llamadas HTTP. Cubre validateUser, validatePartialUser,
 * validateRegistration y validateInvitedUser.
 */

import { validateUser, validatePartialUser } from '../schemas/user.js'
import { validateRegistration } from '../schemas/register.js'
import { validateInvitedUser } from '../schemas/invitedUser.js'
import assert from 'assert'

// ─── usuario.js (admin creation) ────────────────────────────────────

/**
 * @description Suite para validateUser (creación directa por admin).
 * Verifica validaciones de rol, password, correo, teléfono y campos específicos por rol.
 */
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

  /**
   * @test Pasante con todos los campos requeridos es aceptado.
   */
  test('acepta pasante válido', () => {
    const result = validateUser(basePasante)
    assert.equal(result.success, true)
  })

  /**
   * @test Coordinador con todos los campos requeridos es aceptado.
   */
  test('acepta coordinador válido', () => {
    const result = validateUser(baseCoord)
    assert.equal(result.success, true)
  })

  /**
   * @test Password de 5 caracteres (menor al mínimo de 6) es rechazada.
   */
  test('rechaza password menor a 6 caracteres', () => {
    const result = validateUser({ ...basePasante, password: '12345' })
    assert.equal(result.success, false)
  })

  /**
   * @test Password sin mayúsculas ni caracteres especiales es aceptada (reglas relajadas para admin).
   */
  test('acepta password simple (sin mayúsculas/especiales)', () => {
    const result = validateUser({ ...basePasante, password: 'simple' })
    assert.equal(result.success, true)
  })

  /**
   * @test Correo sin formato válido es rechazado.
   */
  test('rechaza correo inválido', () => {
    const result = validateUser({ ...basePasante, correo: 'no-es-email' })
    assert.equal(result.success, false)
  })

  /**
   * @test Teléfono con menos de 10 dígitos es rechazado.
   */
  test('rechaza teléfono con menos de 10 dígitos', () => {
    const result = validateUser({ ...basePasante, telefono: '12345' })
    assert.equal(result.success, false)
  })

  /**
   * @test Rol no permitido (admin) es rechazado.
   */
  test('rechaza rol inválido', () => {
    const result = validateUser({ ...basePasante, rol: 'admin' })
    assert.equal(result.success, false)
  })

  /**
   * @test Pasante sin matrícula es rechazado.
   */
  test('rechaza pasante sin matrícula', () => {
    const { matricula, ...sinMatricula } = basePasante
    const result = validateUser(sinMatricula)
    assert.equal(result.success, false)
  })

  /**
   * @test Coordinador sin cédula es rechazado.
   */
  test('rechaza coordinador sin cédula', () => {
    const { cedula, ...sinCedula } = baseCoord
    const result = validateUser(sinCedula)
    assert.equal(result.success, false)
  })
})

/**
 * @description Suite para validatePartialUser (actualización parcial).
 * Todos los campos son opcionales pero deben ser válidos si se proveen.
 */
describe('validatePartialUser — actualización parcial', () => {
  /**
   * @test Solo nombre es suficiente y aceptado.
   */
  test('acepta solo nombre', () => {
    const result = validatePartialUser({ nombre: 'Carlos' })
    assert.equal(result.success, true)
  })

  /**
   * @test Objeto vacío es aceptado (todos los campos son opcionales).
   */
  test('acepta objeto vacío', () => {
    const result = validatePartialUser({})
    assert.equal(result.success, true)
  })

  /**
   * @test Correo con formato inválido en actualización parcial es rechazado.
   */
  test('rechaza correo inválido en parcial', () => {
    const result = validatePartialUser({ correo: 'bad' })
    assert.equal(result.success, false)
  })
})

// ─── registro.js (auto-registro con token) ──────────────────────────

/**
 * @description Suite para validateRegistration (auto-registro con token).
 * Verifica reglas estrictas de password y coincidencia de confirmación.
 */
describe('validateRegistration — auto-registro', () => {
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

  /**
   * @test Datos completos de pasante con password fuerte son aceptados.
   */
  test('acepta registro pasante válido', () => {
    const result = validateRegistration(basePasante, 'PASANTE')
    assert.equal(result.success, true)
  })

  /**
   * @test Datos completos de coordinador con password fuerte son aceptados.
   */
  test('acepta registro coordinador válido', () => {
    const result = validateRegistration(baseCoord, 'COORDINADOR')
    assert.equal(result.success, true)
  })

  /**
   * @test Password sin mayúscula no cumple los requisitos de auto-registro.
   */
  test('rechaza password sin mayúscula', () => {
    const result = validateRegistration(
      { ...basePasante, password: 'abc12345!', confirmPassword: 'abc12345!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Password sin número no cumple los requisitos de auto-registro.
   */
  test('rechaza password sin número', () => {
    const result = validateRegistration(
      { ...basePasante, password: 'Abcdefgh!', confirmPassword: 'Abcdefgh!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Password sin carácter especial no cumple los requisitos de auto-registro.
   */
  test('rechaza password sin carácter especial', () => {
    const result = validateRegistration(
      { ...basePasante, password: 'Abc12345x', confirmPassword: 'Abc12345x' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Password de 4 caracteres (menor al mínimo de 8) es rechazada.
   */
  test('rechaza password menor a 8 caracteres', () => {
    const result = validateRegistration(
      { ...basePasante, password: 'Ab1!', confirmPassword: 'Ab1!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test confirmPassword diferente a password es rechazada.
   */
  test('rechaza confirmPassword que no coincide', () => {
    const result = validateRegistration(
      { ...basePasante, confirmPassword: 'Diferente1!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Token con formato distinto a UUID es rechazado.
   */
  test('rechaza token no UUID', () => {
    const result = validateRegistration(
      { ...basePasante, token: 'no-es-uuid' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })
})

// ─── createPreUser.js (invitaciones) ────────────────────────────────

/**
 * @description Suite para validateInvitedUser (creación de invitaciones).
 * Verifica que el schema acepte arrays válidos y rechace emails, roles y formatos incorrectos.
 */
describe('validateInvitedUser — invitaciones', () => {
  /**
   * @test Array con dos invitaciones válidas (pasante y coordinador) es aceptado.
   */
  test('acepta array de invitaciones válidas', () => {
    const result = validateInvitedUser([
      { email: 'a@uabc.edu.mx', role: 'pasante' },
      { email: 'b@uabc.edu.mx', role: 'coordinador' },
    ])
    assert.equal(result.success, true)
  })

  /**
   * @test Array vacío es rechazado (se requiere al menos una invitación).
   */
  test('rechaza array vacío', () => {
    const result = validateInvitedUser([])
    assert.equal(result.success, false)
  })

  /**
   * @test Email con formato inválido es rechazado.
   */
  test('rechaza email inválido', () => {
    const result = validateInvitedUser([{ email: 'no-email', role: 'pasante' }])
    assert.equal(result.success, false)
  })

  /**
   * @test Rol no permitido (admin) es rechazado.
   */
  test('rechaza rol inválido', () => {
    const result = validateInvitedUser([
      { email: 'a@uabc.edu.mx', role: 'admin' },
    ])
    assert.equal(result.success, false)
  })

  /**
   * @test Objeto en lugar de array es rechazado (se espera un array).
   */
  test('rechaza objeto sin array', () => {
    const result = validateInvitedUser({
      email: 'a@uabc.edu.mx',
      role: 'pasante',
    })
    assert.equal(result.success, false)
  })
})
