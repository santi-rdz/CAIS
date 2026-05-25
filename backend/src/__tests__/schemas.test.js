/**
 * @file Tests unitarios para los schemas de validación Zod.
 * @description Verifica que los schemas acepten datos válidos y rechacen datos inválidos
 * sin realizar llamadas HTTP. Cubre validateUserCreate, validateUserUpdate,
 * validateSignup y validateInvitedUser.
 */

import { validateUserCreate, validateUserUpdate, validateSignup } from '@cais/shared/schemas/users'
import { validateInvitedUser } from '@cais/shared/schemas/invitations'
import { validateAuditCreate } from '@cais/shared/schemas/audit'
import assert from 'assert'

// ─── usuario.js (admin creation) ────────────────────────────────────

/**
 * @description Suite para validateUserCreate (creación de usuario).
 * Verifica validaciones de rol, password, correo, teléfono y campos específicos por rol.
 */
describe('validateUserCreate — creación de usuario', () => {
  const basePasante = {
    nombre: 'Juan',
    apellidos: 'Pérez',
    correo: 'juan@uabc.edu.mx',
    fecha_nacimiento: '2000-01-15',
    telefono: '6861234567',
    rol: 'pasante',
    password: 'Abc12345!',
    matricula: 'MAT001',
    servicio_inicio_anio: '2026',
    servicio_inicio_periodo: '1',
    servicio_fin_anio: '2026',
    servicio_fin_periodo: '2',
  }

  const baseCoord = {
    nombre: 'Ana',
    apellidos: 'López',
    correo: 'ana@uabc.edu.mx',
    fecha_nacimiento: '1990-05-20',
    telefono: '6869876543',
    rol: 'coordinador',
    password: 'Abc12345!',
    cedula: 'CED001',
  }

  /**
   * @test Pasante con todos los campos requeridos es aceptado.
   */
  test('acepta pasante válido', () => {
    const result = validateUserCreate(basePasante)
    assert.equal(result.success, true)
  })

  /**
   * @test Coordinador con todos los campos requeridos es aceptado.
   */
  test('acepta coordinador válido', () => {
    const result = validateUserCreate(baseCoord)
    assert.equal(result.success, true)
  })

  /**
   * @test Password de 5 caracteres (menor al mínimo de 6) es rechazada.
   */
  test('rechaza password menor a 6 caracteres', () => {
    const result = validateUserCreate({ ...basePasante, password: '12345' })
    assert.equal(result.success, false)
  })

  /**
   * @test Password de 6 caracteres es aceptada (admin no requiere complejidad).
   */
  test('acepta password simple de 6+ caracteres (admin)', () => {
    const result = validateUserCreate({ ...basePasante, password: '123456' })
    assert.equal(result.success, true)
  })

  /**
   * @test Correo sin formato válido es rechazado.
   */
  test('rechaza correo inválido', () => {
    const result = validateUserCreate({
      ...basePasante,
      correo: 'no-es-email',
    })
    assert.equal(result.success, false)
  })

  /**
   * @test Teléfono con menos de 10 dígitos es rechazado.
   */
  test('rechaza teléfono con menos de 10 dígitos', () => {
    const result = validateUserCreate({ ...basePasante, telefono: '12345' })
    assert.equal(result.success, false)
  })

  /**
   * @test Rol inexistente es rechazado.
   */
  test('rechaza rol inválido', () => {
    const result = validateUserCreate({ ...basePasante, rol: 'superusuario' })
    assert.equal(result.success, false)
  })

  /**
   * @test Pasante sin matrícula es rechazado.
   */
  test('rechaza pasante sin matrícula', () => {
    const { matricula: _matricula, ...sinMatricula } = basePasante
    const result = validateUserCreate(sinMatricula)
    assert.equal(result.success, false)
  })

  /**
   * @test Coordinador sin cédula es rechazado.
   */
  test('rechaza coordinador sin cédula', () => {
    const { cedula: _cedula, ...sinCedula } = baseCoord
    const result = validateUserCreate(sinCedula)
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
 * @description Suite para validateSignup (auto-registro con token).
 * Verifica reglas estrictas de password y coincidencia de confirmación.
 */
describe('validateSignup — auto-registro', () => {
  const validToken = '550e8400-e29b-41d4-a716-446655440000'

  const basePasante = {
    token: validToken,
    nombre: 'Juan',
    apellidos: 'Pérez',
    fecha_nacimiento: '2000-01-15',
    telefono: '6861234567',
    password: 'Abc12345!',
    confirmPassword: 'Abc12345!',
    matricula: 'MAT001',
    servicio_inicio_anio: '2026',
    servicio_inicio_periodo: '1',
    servicio_fin_anio: '2026',
    servicio_fin_periodo: '2',
  }

  const baseCoord = {
    token: validToken,
    nombre: 'Ana',
    apellidos: 'López',
    fecha_nacimiento: '1990-05-20',
    telefono: '6869876543',
    password: 'Abc12345!',
    confirmPassword: 'Abc12345!',
    cedula: 'CED001',
  }

  /**
   * @test Datos completos de pasante con password fuerte son aceptados.
   */
  test('acepta registro pasante válido', () => {
    const result = validateSignup(basePasante, 'PASANTE')
    assert.equal(result.success, true)
  })

  /**
   * @test Datos completos de coordinador con password fuerte son aceptados.
   */
  test('acepta registro coordinador válido', () => {
    const result = validateSignup(baseCoord, 'COORDINADOR')
    assert.equal(result.success, true)
  })

  /**
   * @test Password sin mayúscula no cumple los requisitos de auto-registro.
   */
  test('rechaza password sin mayúscula', () => {
    const result = validateSignup(
      { ...basePasante, password: 'abc12345!', confirmPassword: 'abc12345!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Password sin número no cumple los requisitos de auto-registro.
   */
  test('rechaza password sin número', () => {
    const result = validateSignup(
      { ...basePasante, password: 'Abcdefgh!', confirmPassword: 'Abcdefgh!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Password sin carácter especial no cumple los requisitos de auto-registro.
   */
  test('rechaza password sin carácter especial', () => {
    const result = validateSignup(
      { ...basePasante, password: 'Abc12345x', confirmPassword: 'Abc12345x' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test Password de 4 caracteres (menor al mínimo de 8) es rechazada.
   */
  test('rechaza password menor a 8 caracteres', () => {
    const result = validateSignup(
      { ...basePasante, password: 'Ab1!', confirmPassword: 'Ab1!' },
      'PASANTE'
    )
    assert.equal(result.success, false)
  })

  /**
   * @test confirmPassword diferente a password es rechazada.
   */
  test('rechaza confirmPassword que no coincide', () => {
    const result = validateSignup({ ...basePasante, confirmPassword: 'Diferente1!' }, 'PASANTE')
    assert.equal(result.success, false)
  })

  /**
   * @test Token con formato distinto a UUID es rechazado.
   */
  test('rechaza token no UUID', () => {
    const result = validateSignup({ ...basePasante, token: 'no-es-uuid' }, 'PASANTE')
    assert.equal(result.success, false)
  })
})

// ─── audit.js (creación de auditoría) ───────────────────────────────

/**
 * @description Suite para validateAuditCreate (creación de registro de auditoría).
 * Verifica que el schema acepte datos válidos y rechace UUIDs, acciones y entidades inválidas.
 */
describe('validateAuditCreate — creación de auditoría', () => {
  const base = {
    usuario_id: '550e8400-e29b-41d4-a716-446655440000',
    accion: 'CREATE',
    entidad: 'pacientes',
  }

  /**
   * @test Datos mínimos válidos (sin objetivo_id) son aceptados.
   */
  test('acepta datos válidos sin objetivo_id', () => {
    const result = validateAuditCreate(base)
    assert.equal(result.success, true)
  })

  /**
   * @test Datos con objetivo_id UUID válido son aceptados.
   */
  test('acepta datos válidos con objetivo_id', () => {
    const result = validateAuditCreate({
      ...base,
      objetivo_id: '660e8400-e29b-41d4-a716-446655440001',
    })
    assert.equal(result.success, true)
  })

  /**
   * @test objetivo_id con valor null es aceptado.
   */
  test('acepta objetivo_id null', () => {
    const result = validateAuditCreate({ ...base, objetivo_id: null })
    assert.equal(result.success, true)
  })

  /**
   * @test usuario_id con formato distinto a UUID es rechazado.
   */
  test('rechaza usuario_id no UUID', () => {
    const result = validateAuditCreate({ ...base, usuario_id: 'no-es-uuid' })
    assert.equal(result.success, false)
  })

  /**
   * @test objetivo_id con formato distinto a UUID es rechazado.
   */
  test('rechaza objetivo_id no UUID', () => {
    const result = validateAuditCreate({ ...base, objetivo_id: 'no-es-uuid' })
    assert.equal(result.success, false)
  })

  /**
   * @test accion vacía es rechazada.
   */
  test('rechaza accion vacía', () => {
    const result = validateAuditCreate({ ...base, accion: '' })
    assert.equal(result.success, false)
  })

  /**
   * @test entidad vacía es rechazada.
   */
  test('rechaza entidad vacía', () => {
    const result = validateAuditCreate({ ...base, entidad: '' })
    assert.equal(result.success, false)
  })

  /**
   * @test Ausencia de usuario_id es rechazada.
   */
  test('rechaza input sin usuario_id', () => {
    const { usuario_id: _usuario_id, ...sinUsuario } = base
    const result = validateAuditCreate(sinUsuario)
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
   * @test Rol inexistente es rechazado.
   */
  test('rechaza rol inválido', () => {
    const result = validateInvitedUser([{ email: 'a@uabc.edu.mx', role: 'superusuario' }])
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
