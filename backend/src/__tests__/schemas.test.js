/**
 * @file Tests unitarios para los schemas de validación Zod.
 * @description Verifica que los schemas acepten datos válidos y rechacen datos inválidos
 * sin realizar llamadas HTTP. Cubre validateAdminCreate, validateUserUpdate,
 * validateSelfRegister y validateInvitedUser.
 */

import {
  validateAdminCreate,
  validateUserUpdate,
  validateSelfRegister,
} from '@cais/shared/schemas/users'
import { validateInvitedUser } from '@cais/shared/schemas/invitations'
import assert from 'assert'

// ─── usuario.js (admin creation) ────────────────────────────────────

/**
 * @description Suite para validateAdminCreate (creación directa por admin).
 * Verifica validaciones de rol, password, correo, teléfono y campos específicos por rol.
 */
describe('validateAdminCreate — creación directa por admin', () => {
  const basePasante = {
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan@uabc.edu.mx',
    fechaNacimiento: '2000-01-15',
    telefono: '6861234567',
    rol: 'pasante',
    password: 'Abc12345!',
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
    password: 'Abc12345!',
    cedula: 'CED001',
  }

  /**
   * @test Pasante con todos los campos requeridos es aceptado.
   */
  test('acepta pasante válido', () => {
    const result = validateAdminCreate(basePasante)
    assert.equal(result.success, true)
  })

  /**
   * @test Coordinador con todos los campos requeridos es aceptado.
   */
  test('acepta coordinador válido', () => {
    const result = validateAdminCreate(baseCoord)
    assert.equal(result.success, true)
  })

  /**
   * @test Password de 5 caracteres (menor al mínimo de 6) es rechazada.
   */
  test('rechaza password menor a 6 caracteres', () => {
    const result = validateAdminCreate({ ...basePasante, password: '12345' })
    assert.equal(result.success, false)
  })

  /**
   * @test Password de 6 caracteres es aceptada (admin no requiere complejidad).
   */
  test('acepta password simple de 6+ caracteres (admin)', () => {
    const result = validateAdminCreate({ ...basePasante, password: '123456' })
    assert.equal(result.success, true)
  })

  /**
   * @test Correo sin formato válido es rechazado.
   */
  test('rechaza correo inválido', () => {
    const result = validateAdminCreate({
      ...basePasante,
      correo: 'no-es-email',
    })
    assert.equal(result.success, false)
  })

  /**
   * @test Teléfono con menos de 10 dígitos es rechazado.
   */
  test('rechaza teléfono con menos de 10 dígitos', () => {
    const result = validateAdminCreate({ ...basePasante, telefono: '12345' })
    assert.equal(result.success, false)
  })

  /**
   * @test Rol no permitido (admin) es rechazado.
   */
  test('rechaza rol inválido', () => {
    const result = validateAdminCreate({ ...basePasante, rol: 'admin' })
    assert.equal(result.success, false)
  })

  /**
   * @test Pasante sin matrícula es rechazado.
   */
  test('rechaza pasante sin matrícula', () => {
    const { matricula, ...sinMatricula } = basePasante
    const result = validateAdminCreate(sinMatricula)
    assert.equal(result.success, false)
  })

  /**
   * @test Coordinador sin cédula es rechazado.
   */
  test('rechaza coordinador sin cédula', () => {
    const { cedula, ...sinCedula } = baseCoord
    const result = validateAdminCreate(sinCedula)
    assert.equal(result.success, false)
  })
})

/**
 * @description Suite para validateUserUpdate (actualización parcial).
 * Todos los campos son opcionales pero deben ser válidos si se proveen.
 */
describe('validateUserUpdate — actualización parcial', () => {
  /**
   * @test Solo nombre es suficiente y aceptado.
   */
  test('acepta solo nombre', () => {
    const result = validateUserUpdate({ nombre: 'Carlos' })
    assert.equal(result.success, true)
  })

  /**
   * @test Objeto vacío es aceptado (todos los campos son opcionales).
   */
  test('acepta objeto vacío', () => {
    const result = validateUserUpdate({})
    assert.equal(result.success, true)
  })

  /**
   * @test Correo con formato inválido en actualización parcial es rechazado.
   */
  test('rechaza correo inválido en parcial', () => {
    const result = validateUserUpdate({ correo: 'bad' })
    assert.equal(result.success, false)
  })
})

// ─── registro.js (auto-registro con token) ──────────────────────────

/**
 * @description Suite para validateSelfRegister (auto-registro con token).
 * Verifica reglas estrictas de password y coincidencia de confirmación.
 */
describe('validateSelfRegister — auto-registro', () => {
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
    const result = validateSelfRegister(basePasante, 'PASANTE')
    assert.equal(result.success, true)
  })

  /**
   * @test Datos completos de coordinador con password fuerte son aceptados.
   */
  test('acepta registro coordinador válido', () => {
    const result = validateSelfRegister(baseCoord, 'COORDINADOR')
    assert.equal(result.success, true)
  })

  /**
   * @test Password sin mayúscula no cumple los requisitos de auto-registro.
   */
  test('rechaza password sin mayúscula', () => {
    const result = validateSelfRegister(
      { ...basePasante, password: 'abc12345!', confirmPassword: 'abc12345!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Password sin número no cumple los requisitos de auto-registro.
   */
  test('rechaza password sin número', () => {
    const result = validateSelfRegister(
      { ...basePasante, password: 'Abcdefgh!', confirmPassword: 'Abcdefgh!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Password sin carácter especial no cumple los requisitos de auto-registro.
   */
  test('rechaza password sin carácter especial', () => {
    const result = validateSelfRegister(
      { ...basePasante, password: 'Abc12345x', confirmPassword: 'Abc12345x' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Password de 4 caracteres (menor al mínimo de 8) es rechazada.
   */
  test('rechaza password menor a 8 caracteres', () => {
    const result = validateSelfRegister(
      { ...basePasante, password: 'Ab1!', confirmPassword: 'Ab1!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test confirmPassword diferente a password es rechazada.
   */
  test('rechaza confirmPassword que no coincide', () => {
    const result = validateSelfRegister(
      { ...basePasante, confirmPassword: 'Diferente1!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Token con formato distinto a UUID es rechazado.
   */
  test('rechaza token no UUID', () => {
    const result = validateSelfRegister(
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
