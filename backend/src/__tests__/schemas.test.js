import { validateUserCreate, validateUserUpdate, validateSignup } from '@cais/shared/schemas/users'
import { validateInvitedUser } from '@cais/shared/schemas/invitations'
import { validateAuditCreate } from '@cais/shared/schemas/audit'
import { ACCIONES, ENTIDADES } from '@cais/shared/constants/users'

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'

const basePasanteCreate = {
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

const baseCoordCreate = {
  nombre: 'Ana',
  apellidos: 'López',
  correo: 'ana@uabc.edu.mx',
  fecha_nacimiento: '1990-05-20',
  telefono: '6869876543',
  rol: 'coordinador',
  password: 'Abc12345!',
  cedula: 'CED001',
}

const basePasanteSignup = {
  token: VALID_UUID,
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

const baseCoordSignup = {
  token: VALID_UUID,
  nombre: 'Ana',
  apellidos: 'López',
  fecha_nacimiento: '1990-05-20',
  telefono: '6869876543',
  password: 'Abc12345!',
  confirmPassword: 'Abc12345!',
  cedula: 'CED001',
}

describe('validateUserCreate', () => {
  test('acepta pasante válido', () => {
    expect(validateUserCreate(basePasanteCreate).success).toBe(true)
  })

  test('acepta coordinador válido', () => {
    expect(validateUserCreate(baseCoordCreate).success).toBe(true)
  })

  test('rechaza password menor a 6 caracteres', () => {
    const result = validateUserCreate({ ...basePasanteCreate, password: '12345' })
    expect(result.success).toBe(false)
  })

  test('acepta password simple de 6+ caracteres (admin no exige complejidad)', () => {
    const result = validateUserCreate({ ...basePasanteCreate, password: '123456' })
    expect(result.success).toBe(true)
  })

  test('rechaza correo inválido', () => {
    const result = validateUserCreate({ ...basePasanteCreate, correo: 'no-es-email' })
    expect(result.success).toBe(false)
  })

  test('rechaza teléfono con menos de 10 dígitos', () => {
    const result = validateUserCreate({ ...basePasanteCreate, telefono: '12345' })
    expect(result.success).toBe(false)
  })

  test('rechaza rol inválido', () => {
    const result = validateUserCreate({ ...basePasanteCreate, rol: 'superusuario' })
    expect(result.success).toBe(false)
  })

  test('rechaza pasante sin matrícula', () => {
    expect(validateUserCreate({ ...basePasanteCreate, matricula: undefined }).success).toBe(false)
  })

  test('rechaza coordinador sin cédula', () => {
    expect(validateUserCreate({ ...baseCoordCreate, cedula: undefined }).success).toBe(false)
  })
})

describe('validateUserUpdate', () => {
  test('acepta solo nombre', () => {
    expect(validateUserUpdate({ nombre: 'Carlos' }).success).toBe(true)
  })

  test('acepta objeto vacío', () => {
    expect(validateUserUpdate({}).success).toBe(true)
  })

  test('rechaza correo inválido', () => {
    expect(validateUserUpdate({ correo: 'bad' }).success).toBe(false)
  })
})

describe('validateSignup', () => {
  test('acepta registro pasante válido', () => {
    expect(validateSignup(basePasanteSignup, 'PASANTE').success).toBe(true)
  })

  test('acepta registro coordinador válido', () => {
    expect(validateSignup(baseCoordSignup, 'COORDINADOR').success).toBe(true)
  })

  test.each([
    ['sin mayúscula', 'abc12345!'],
    ['sin carácter especial', 'Abc12345x'],
    ['menor a 8 caracteres', 'Ab1!'],
  ])('rechaza password %s', (_label, password) => {
    const result = validateSignup(
      { ...basePasanteSignup, password, confirmPassword: password },
      'PASANTE'
    )
    expect(result.success).toBe(false)
  })

  test('rechaza confirmPassword que no coincide', () => {
    const result = validateSignup(
      { ...basePasanteSignup, confirmPassword: 'Diferente1!' },
      'PASANTE'
    )
    expect(result.success).toBe(false)
  })

  test('rechaza token no UUID', () => {
    const result = validateSignup({ ...basePasanteSignup, token: 'no-es-uuid' }, 'PASANTE')
    expect(result.success).toBe(false)
  })
})

describe('validateAuditCreate', () => {
  const baseAudit = {
    usuario_id: VALID_UUID,
    accion: ACCIONES.CREAR,
    entidad: ENTIDADES.PACIENTE,
  }

  test('acepta datos válidos sin objetivo_id', () => {
    expect(validateAuditCreate(baseAudit).success).toBe(true)
  })

  test('acepta datos válidos con objetivo_id UUID', () => {
    const result = validateAuditCreate({
      ...baseAudit,
      objetivo_id: '660e8400-e29b-41d4-a716-446655440001',
    })
    expect(result.success).toBe(true)
  })

  test('acepta objetivo_id null', () => {
    expect(validateAuditCreate({ ...baseAudit, objetivo_id: null }).success).toBe(true)
  })

  test('acepta datos válidos con paciente_id UUID', () => {
    const result = validateAuditCreate({
      ...baseAudit,
      paciente_id: '770e8400-e29b-41d4-a716-446655440002',
    })
    expect(result.success).toBe(true)
  })

  test.each([
    ['usuario_id', { usuario_id: 'no-es-uuid' }],
    ['objetivo_id', { objetivo_id: 'no-es-uuid' }],
    ['paciente_id', { paciente_id: 'no-es-uuid' }],
  ])('rechaza %s no UUID', (_label, override) => {
    expect(validateAuditCreate({ ...baseAudit, ...override }).success).toBe(false)
  })

  test('rechaza accion vacía', () => {
    expect(validateAuditCreate({ ...baseAudit, accion: '' }).success).toBe(false)
  })

  test('rechaza entidad vacía', () => {
    expect(validateAuditCreate({ ...baseAudit, entidad: '' }).success).toBe(false)
  })

  test('rechaza input sin usuario_id', () => {
    expect(validateAuditCreate({ ...baseAudit, usuario_id: undefined }).success).toBe(false)
  })
})

describe('validateInvitedUser', () => {
  test('acepta array de invitaciones válidas', () => {
    const result = validateInvitedUser([
      { email: 'a@uabc.edu.mx', role: 'pasante' },
      { email: 'b@uabc.edu.mx', role: 'coordinador' },
    ])
    expect(result.success).toBe(true)
  })

  test('rechaza array vacío', () => {
    expect(validateInvitedUser([]).success).toBe(false)
  })

  test('rechaza email inválido', () => {
    expect(validateInvitedUser([{ email: 'no-email', role: 'pasante' }]).success).toBe(false)
  })

  test('rechaza rol inválido', () => {
    expect(validateInvitedUser([{ email: 'a@uabc.edu.mx', role: 'superusuario' }]).success).toBe(
      false
    )
  })

  test('rechaza objeto sin array', () => {
    expect(validateInvitedUser({ email: 'a@uabc.edu.mx', role: 'pasante' }).success).toBe(false)
  })
})
