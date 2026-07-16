import { defineConfig, env } from 'prisma/config'

// En dev local carga ../.env; en CI/Docker las vars ya están en el entorno.
try {
  process.loadEnvFile('../.env')
} catch {
  // archivo opcional — ignorar si no existe
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
