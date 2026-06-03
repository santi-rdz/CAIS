/**
 * @file Factories que insertan datos en la DB y devuelven la entidad creada.
 *
 * A diferencia de factories.js (builders de payload para HTTP), estos
 * escriben directamente en la DB vía Prisma. Pensados para usarse en
 * beforeAll de cada test file, registrándose en un cleanup tracker.
 *
 * Convenciones:
 * - Todos los factories aceptan `{ tracker }` opcional para auto-registrar
 *   los IDs creados.
 * - Retornan `{ id, idBuffer, ... }` donde id es UUID string (lo que ve la
 *   app) y idBuffer es Buffer (para referencias FK directas).
 */

import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { INVITATION_TTL_MS } from './constants.js'
import { uniqueEmail } from './ids.js'
import { STRONG_TEST_PASSWORD } from './passwords.js'

// ── Reference data lookups (catálogos) ────────────────────────────

async function getRoleId(codigo) {
  const row = await prisma.roles.findFirst({ where: { codigo }, select: { id: true } })
  if (!row) throw new Error(`Rol "${codigo}" no encontrado en la DB`)
  return row.id
}

async function getEstadoId(codigo) {
  const row = await prisma.estados.findFirst({ where: { codigo }, select: { id: true } })
  if (!row) throw new Error(`Estado "${codigo}" no encontrado en la DB`)
  return row.id
}

async function getAreaId(nombre) {
  const row = await prisma.areas.findFirst({ where: { nombre }, select: { id: true } })
  if (!row) throw new Error(`Área "${nombre}" no encontrada en la DB`)
  return row.id
}

// ── Usuarios ─────────────────────────────────────────────────────

async function createTestUser({
  role,
  area = null,
  estado = 'ACTIVO',
  password = STRONG_TEST_PASSWORD,
  tracker,
  overrides = {},
}) {
  const [rolId, estadoId, areaId] = await Promise.all([
    getRoleId(role),
    getEstadoId(estado),
    area ? getAreaId(area) : Promise.resolve(null),
  ])

  const correo = uniqueEmail(role.toLowerCase())
  const uuid = randomUUID()
  const idBuffer = uuidToBuffer(uuid)

  await prisma.usuarios.create({
    data: {
      id: idBuffer,
      nombre: 'Test',
      apellidos: `User-${role}`,
      correo,
      password_hash: await bcrypt.hash(password, 10),
      estado_id: estadoId,
      rol_id: rolId,
      area_id: areaId,
      ...overrides,
    },
  })

  tracker?.track('usuarios', idBuffer)

  return { id: uuid, idBuffer, correo, password, role, area, areaId }
}

export function createTestCoordinador(opts = {}) {
  return createTestUser({ role: 'COORDINADOR', area: 'MEDICINA', ...opts })
}

export function createTestPasante(opts = {}) {
  return createTestUser({ role: 'PASANTE', area: 'MEDICINA', ...opts })
}

export function createTestAdmin(opts = {}) {
  return createTestUser({ role: 'ADMIN', ...opts })
}

// ── Pacientes ────────────────────────────────────────────────────

/**
 * Crea un paciente vinculado a un doctor (usuario coordinador/pasante).
 * El doctor debe pasarse como objeto retornado por createTestCoordinador/Pasante.
 */
export async function createTestPaciente({ doctor, tracker, overrides = {} } = {}) {
  if (!doctor?.idBuffer) {
    throw new Error(
      'createTestPaciente requires { doctor: <user from createTestCoordinador/Pasante> }'
    )
  }

  const uuid = randomUUID()
  const idBuffer = uuidToBuffer(uuid)

  await prisma.pacientes.create({
    data: {
      id: idBuffer,
      doctor_id: doctor.idBuffer,
      nombre: 'Test',
      apellidos: `Paciente-${Date.now()}`,
      fecha_nacimiento: new Date('2000-01-01'),
      genero: 'M',
      telefono: '6860000000',
      ...overrides,
    },
  })

  tracker?.track('pacientes', idBuffer)

  return { id: uuid, idBuffer }
}

// ── Invitaciones ─────────────────────────────────────────────────

/**
 * Crea una invitación firmada por un coordinador (invitedBy).
 *
 * @returns {{ id: number, correo: string, token: string }}
 *   token es el UUID string (lo que el app espera en el body de signup).
 */
export async function createTestInvitation({
  invitedBy,
  role = 'PASANTE',
  correo,
  token = randomUUID(),
  expiresInMs = INVITATION_TTL_MS,
  tracker,
} = {}) {
  if (!invitedBy?.idBuffer) {
    throw new Error(
      'createTestInvitation requires { invitedBy: <user from createTestCoordinador> }'
    )
  }

  const rolId = await getRoleId(role)
  const correoFinal = correo ?? uniqueEmail('invite')

  const inv = await prisma.invitaciones_registro.create({
    data: {
      correo: correoFinal,
      rol_id: rolId,
      token: uuidToBuffer(token),
      expira_at: new Date(Date.now() + expiresInMs),
      creado_por: invitedBy.idBuffer,
    },
  })

  tracker?.track('invitaciones_registro', inv.id)

  return { id: inv.id, correo: correoFinal, token }
}
