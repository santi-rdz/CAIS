import { SESSION_MAX_AGE_MS } from '#lib/constants.js'
import { prisma } from '#config/prisma.js'
import { userRouter } from '#routes/users.js'
import { authRouter } from '#routes/auth.js'
import { invitationRouter } from '#routes/invitations.js'
import cors from 'cors'
import session from 'express-session'
import { PrismaSessionStore } from '#config/sessionStore.js'
import { patientRouter } from '#routes/patient.js'
import { medicineRouter } from '#routes/medicine.js'
import { auditRouter } from '#routes/audit.js'
import { nutritionRouter } from '#routes/nutrition.js'
import { dashboardRouter } from '#routes/dashboard.js'
import express from 'express'
import { apiRateLimiter, corsOptions, securityHeaders } from '#lib/security.js'

const isProd = process.env.NODE_ENV === 'production'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret && isProd) {
  throw new Error('SESSION_SECRET es requerido en producción')
}

const app = express()

// Sin trust proxy el rate limiter ve la IP del proxy, no del cliente.
if (isProd) app.set('trust proxy', 1)

app.disable('x-powered-by')
app.use(securityHeaders)
app.use(cors(corsOptions))
app.use(apiRateLimiter)
app.use(express.json({ limit: '100kb' }))

app.use(
  session({
    secret: sessionSecret || 'dev-secret-change-in-prod',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: isProd,
      maxAge: SESSION_MAX_AGE_MS,
      sameSite: 'lax',
    },
    store: new PrismaSessionStore(),
  })
)

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/usuarios', userRouter)
app.use('/auth', authRouter)
app.use('/audit', auditRouter)
app.use('/invitaciones', invitationRouter)
app.use('/pacientes', patientRouter)
app.use('/medicina', medicineRouter)
app.use('/nutricion', nutritionRouter)
app.use('/dashboard', dashboardRouter)

// Sin esto, un throw no manejado responde HTML con stack trace en lugar de JSON.
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  if (res.headersSent) return
  res.status(500).json({ error: 'InternalError', message: 'Error inesperado' })
})

export default app

// No levantar el server durante tests (jest setea NODE_ENV='test' por
// default) — supertest llama al app directamente sin necesidad de listen.
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000')
  })

  // Graceful shutdown: cerrar Prisma para que MySQL libere las conexiones.
  // Sin esto, cada restart de node --watch deja conexiones zombies que
  // eventualmente saturan max_connections.
  async function gracefulShutdown(signal) {
    console.log(`Received ${signal}, shutting down gracefully...`)
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
    // Failsafe: si server.close() tarda, fuerza exit a los 5s.
    setTimeout(() => {
      console.warn('Forced exit after timeout')
      process.exit(1)
    }, 5000).unref()
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))
}
