import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, env } from 'prisma/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// El CLI de Prisma carga este config sin pasar por el flag --env-file de los
// scripts, así que cargamos el .env de la raíz del monorepo de forma nativa.
// En CI/Docker las env vars ya están en el entorno → solo si el archivo existe.
const here = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(here, '../.env')
if (existsSync(envPath)) process.loadEnvFile(envPath)

function makeAdapter() {
  const url = new URL(env('DATABASE_URL'))
  return new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    allowPublicKeyRetrieval: true,
  })
}

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrate: {
    adapter: makeAdapter,
  },
  migrations: {
    seed: 'node prisma/seed.js',
  },
})
