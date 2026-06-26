import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { SESSION_MAX_AGE_MS } from '#lib/constants.js'
import { PrismaSessionStore } from '#config/sessionStore.js'
import { apiRateLimiter, corsOptions, securityHeaders } from '#lib/security.js'
import { serverConfig } from '#config/env.js'
import { userRouter } from '#routes/users.js'
import { authRouter } from '#routes/auth.js'
import { invitationRouter } from '#routes/invitations.js'
import { patientRouter } from '#routes/patient.js'
import { medicineRouter } from '#routes/medicine.js'
import { auditRouter } from '#routes/audit.js'
import { nutritionRouter } from '#routes/nutrition.js'
import { dashboardRouter } from '#routes/dashboard.js'

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

// Error middleware central. Express 5 reenvía aquí cualquier throw/rejection de
// los handlers async, así que los controllers no necesitan su propio try/catch:
// lanzan (o dejan propagar) y esto arma la respuesta.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)

  // Errores con status intencional (HttpError y subclases como EmailConflictError).
  if (typeof err?.status === 'number') {
    return res.status(err.status).json({
      error: err.error ?? 'Error',
      message: err.message,
      ...err.meta,
    })
  }

  // Violación de restricción única de Prisma no traducida en el origen.
  if (err?.code === 'P2002') {
    return res.status(409).json({ error: 'Conflict', message: 'El registro ya existe' })
  }

  console.error(`${req.method} ${req.originalUrl} →`, err)
  res.status(500).json({ error: 'InternalError', message: 'Error inesperado' })
})

export default app
