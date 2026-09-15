import pkg from '@prisma/client'
const { PrismaClient } = pkg

import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const ESTADOS = ['ACTIVO', 'PENDIENTE', 'INACTIVO']
const ROLES = ['PASANTE', 'COORDINADOR', 'ADMIN']
const AREAS = ['MEDICINA', 'NUTRICION']
const ACCIONES = ['CREAR', 'ACTUALIZAR', 'ELIMINAR', 'INICIAR_SESION']
const ENTIDADES = [
  'NOTA_EVOLUCION',
  'EXAMINACION_FISICA',
  'TPAN',
  'REC_24H',
  'CAL_GET_NUTR',
  'EVAL_ANTROPOMETRICA',
  'HISTORIA_MEDICA',
  'PACIENTE',
  'USUARIO',
  'EMERGENCIA',
  'HISTORIA_NUTRICION',
  'EVAL_BIOQ_NUTRICION',
  'EVAL_NUTRICIONAL',
  'EVAL_ACT_FISICA_NUTRICION',
  'EVAL_CAL_SUENO',
  'REPORTE_EEN',
]

export async function seedCatalogs(prisma) {
  for (const codigo of ESTADOS) {
    await prisma.estados.upsert({ where: { codigo }, update: {}, create: { codigo } })
  }
  for (const codigo of ROLES) {
    await prisma.roles.upsert({ where: { codigo }, update: {}, create: { codigo } })
  }
  for (const nombre of AREAS) {
    await prisma.areas.upsert({ where: { nombre }, update: {}, create: { nombre } })
  }
  for (const codigo of ACCIONES) {
    await prisma.acciones.upsert({ where: { codigo }, update: {}, create: { codigo } })
  }
  for (const nombre of ENTIDADES) {
    await prisma.entidades.upsert({ where: { nombre }, update: {}, create: { nombre } })
  }

  console.log('✓ Catálogos base sembrados')
}

// Ejecución standalone (arranque de prod): node prisma/seedCatalogs.js
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

  seedCatalogs(prisma)
    .catch((e) => {
      console.error('Error sembrando catálogos:', e)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
