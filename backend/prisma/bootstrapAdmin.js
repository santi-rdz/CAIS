import pkg from '@prisma/client'
const { PrismaClient } = pkg

import { randomUUID } from 'node:crypto'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import bcrypt from 'bcryptjs'

const BCRYPT_ROUNDS = 12
const uuidToBuf = (uuid) => Buffer.from(uuid.replace(/-/g, ''), 'hex')

// Crea el admin inicial (bootstrap) a partir de env vars. Idempotente: si el
// correo ya existe, no lo toca (no pisa el password si el admin ya lo cambió).
// Requiere que los catálogos (roles/estados) ya estén sembrados.
export async function bootstrapAdmin(prisma) {
  const correo = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!correo || !password) {
    console.log('↷ Bootstrap admin omitido: ADMIN_EMAIL/ADMIN_PASSWORD no definidos.')
    return
  }

  const existing = await prisma.usuarios.findUnique({ where: { correo } })
  if (existing) {
    console.log(`↷ Bootstrap admin omitido: ${correo} ya existe.`)
    return
  }

  const [rolAdmin, estadoActivo] = await Promise.all([
    prisma.roles.findUnique({ where: { codigo: 'ADMIN' } }),
    prisma.estados.findUnique({ where: { codigo: 'ACTIVO' } }),
  ])
  if (!rolAdmin || !estadoActivo) {
    throw new Error('Catálogos ADMIN/ACTIVO ausentes: corre seedCatalogs antes del bootstrap.')
  }

  await prisma.usuarios.create({
    data: {
      id: uuidToBuf(randomUUID()),
      nombre: process.env.ADMIN_NOMBRE || 'Admin',
      apellidos: process.env.ADMIN_APELLIDOS || 'CAIS',
      correo,
      password_hash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      rol_id: rolAdmin.id,
      estado_id: estadoActivo.id,
      area_id: null,
    },
  })

  console.log(`✓ Bootstrap admin creado: ${correo}`)
}

// Ejecución standalone (arranque de prod): node prisma/bootstrapAdmin.js
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = new URL(process.env.DATABASE_URL)
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    allowPublicKeyRetrieval: true,
  })
  const prisma = new PrismaClient({ adapter })

  bootstrapAdmin(prisma)
    .catch((e) => {
      console.error('Error en bootstrap admin:', e)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
