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
import { isProduction, serverConfig } from '#config/env.js'

const app = express()

// Sin esto el rate limiter ve la IP del proxy, no la del cliente.
if (serverConfig.trustProxy) app.set('trust proxy', 1)

app.disable('x-powered-by')
app.use(securityHeaders)
app.use(cors(corsOptions))
app.use(apiRateLimiter)
app.use(express.json({ limit: serverConfig.jsonBodyLimit }))

app.use(
  session({
    secret: serverConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: serverConfig.sessionCookieSecure,
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

// Sin esto un throw async responde HTML con stack trace en vez de JSON.
app.use((err, _req, res, next) => {
  console.error('Unhandled error:', err)
  if (res.headersSent) return next(err)
  res.status(500).json({ error: 'InternalError', message: 'Error inesperado' })
})

export default app

// En tests supertest llama al app sin abrir el puerto.
if (!serverConfig.isTest) {
  const server = app.listen(serverConfig.port, () => {
    console.log(`Server is running on http://localhost:${serverConfig.port}`)
  })

  // Sin $disconnect, cada restart deja conexiones zombies hasta saturar MySQL.
  async function gracefulShutdown(signal) {
    console.log(`Received ${signal}, shutting down gracefully...`)
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
    setTimeout(() => {
      console.warn('Forced exit after timeout')
      process.exit(1)
    }, 5000).unref()
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))
}
