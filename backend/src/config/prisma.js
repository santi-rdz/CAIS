import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const url = new URL(process.env.DATABASE_URL)

// Jest aísla el registro de módulos por archivo, así que cada archivo de test
// instancia su propio PrismaClient con su propio pool. El default del adapter es
// 10 conexiones por pool (Prisma v7); con ~19 archivos eso rebasa el
// max_connections de MySQL (151) y los beforeAll se cuelgan esperando conexión.
// La recomendación de Prisma para muchos clientes de vida corta es acotar el
// pool por cliente; en test lo bajamos para que la suma quepa holgada. Prod
// mantiene el default (un solo cliente de larga vida).
const connectionLimit = process.env.NODE_ENV === 'test' ? 5 : undefined

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  allowPublicKeyRetrieval: true,
  ...(connectionLimit && { connectionLimit }),
})

export const prisma = new PrismaClient({ adapter })
