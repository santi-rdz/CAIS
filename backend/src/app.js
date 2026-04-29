import { SESSION_MAX_AGE_MS } from '#lib/constants.js'
import { userRouter } from '#routes/users.js'
import { authRouter } from '#routes/auth.js'
import { invitationRouter } from '#routes/invitations.js'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { PrismaSessionStore } from '#config/sessionStore.js'
import { patientRouter } from '#routes/patient.js'
import { medicineRouter } from '#routes/medicine.js'
import { auditRouter } from '#routes/audit.js'
import { nutritionRouter } from '#routes/nutrition.js'

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

app.use('/usuarios', userRouter)
app.use('/auth', authRouter)
app.use('/audit', auditRouter)
app.use('/invitaciones', invitationRouter)
app.use('/pacientes', patientRouter)
app.use('/medicina', medicineRouter)
app.use('/nutricion', nutritionRouter)

export default app

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000')
})
