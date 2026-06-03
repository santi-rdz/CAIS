import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer } from '#lib/uuid.js'
import { INVITATION_TTL_MS } from './constants.js'
import { uniqueEmail } from './ids.js'
import { STRONG_TEST_PASSWORD } from './passwords.js'

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

async function getAnyUserBufferId() {
  const row = await prisma.usuarios.findFirst({ select: { id: true } })
  if (!row) throw new Error('Se requiere al menos un usuario en la DB')
  return row.id
}

export async function createInvitation({
  correo = uniqueEmail('inv'),
  role = 'PASANTE',
  expiresInMs = INVITATION_TTL_MS,
  token = randomUUID(),
} = {}) {
  const [rolId, creadoPor] = await Promise.all([getRoleId(role), getAnyUserBufferId()])

  await prisma.invitaciones_registro.create({
    data: {
      correo,
      rol_id: rolId,
      token: uuidToBuffer(token),
      expira_at: new Date(Date.now() + expiresInMs),
      creado_por: creadoPor,
    },
  })

  return {
    correo,
    token,
    cleanup: () => prisma.invitaciones_registro.deleteMany({ where: { correo } }),
  }
}

export async function createUserDirect({
  correo = uniqueEmail('user'),
  estado = 'ACTIVO',
  role = 'PASANTE',
  password = STRONG_TEST_PASSWORD,
  nombre = 'Test',
  apellidos = 'User',
} = {}) {
  const [estadoId, rolId] = await Promise.all([getEstadoId(estado), getRoleId(role)])

  const id = randomUUID()
  await prisma.usuarios.create({
    data: {
      id: uuidToBuffer(id),
      nombre,
      apellidos,
      correo,
      password_hash: await bcrypt.hash(password, 10),
      estado_id: estadoId,
      rol_id: rolId,
    },
  })

  return {
    id,
    correo,
    password,
    cleanup: () => prisma.usuarios.delete({ where: { id: uuidToBuffer(id) } }),
  }
}

export async function deleteInvitationsByEmails(correos) {
  if (!correos?.length) return
  await prisma.invitaciones_registro.deleteMany({ where: { correo: { in: correos } } })
}

export async function deleteUsersByEmails(correos) {
  if (!correos?.length) return
  await prisma.usuarios.deleteMany({ where: { correo: { in: correos } } })
}

export async function getAnyPatientId(agent) {
  const res = await agent.get('/pacientes?page=1&limit=1')
  const items = res.body.pacientes ?? res.body.patients ?? res.body
  const patientId = Array.isArray(items) ? items[0]?.id : undefined
  if (!patientId) {
    throw new Error(`Se requiere al menos un paciente de prueba. status=${res.status}`)
  }
  return patientId
}

export async function getCurrentUserId(agent) {
  const res = await agent.get('/auth/me')
  if (!res.body?.id) {
    throw new Error(`No se pudo resolver el usuario autenticado. status=${res.status}`)
  }
  return res.body.id
}
