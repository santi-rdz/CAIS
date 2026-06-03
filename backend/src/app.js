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

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
)

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-prod',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
