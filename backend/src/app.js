import { userRouter } from './routes/users.js'
import { authRouter } from './routes/auth.js'
import { invitationRouter } from './routes/invitations.js'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
)

app.use('/usuarios', userRouter)
app.use('/auth', authRouter)
app.use('/invitaciones', invitationRouter)

export default app

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000')
})
