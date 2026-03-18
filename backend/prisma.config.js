import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

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
})
