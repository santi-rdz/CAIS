import { userRouter } from './routes/users.js'
import { authRouter } from './routes/auth.js'
import { invitationRouter } from './routes/invitations.js'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { PrismaSessionStore } from './config/sessionStore.js'

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
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
    store: new PrismaSessionStore(),
  })
)

app.use('/usuarios', userRouter)
app.use('/auth', authRouter)
app.use('/invitaciones', invitationRouter)

export default app

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000')
})
