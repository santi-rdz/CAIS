import { userRouter } from './routes/users.js'
import { authRouter } from './routes/auth.js'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)

app.use('/usuarios', userRouter)
app.use('/api/auth', authRouter)

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000')
})
