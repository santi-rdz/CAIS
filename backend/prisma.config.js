import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

function makeAdapter() {
  const url = new URL(process.env.DATABASE_URL)
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
    url: process.env.DATABASE_URL,
  },
  migrate: {
    adapter: makeAdapter,
  },
})
