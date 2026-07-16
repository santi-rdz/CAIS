import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { requiredEnv } from '#config/env.js'

function databaseConfig() {
  const url = new URL(requiredEnv('DATABASE_URL'))
  return {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
  }
}

// Jest instancia un PrismaClient por archivo de test → muchos pools simultáneos.
// connectionLimit: 5 en test evita rebasar el max_connections de MySQL.
const adapter = new PrismaMariaDb({
  ...databaseConfig(),
  allowPublicKeyRetrieval: true,
  ...(process.env.NODE_ENV === 'test' && { connectionLimit: 5 }),
})

export const prisma = new PrismaClient({ adapter })
