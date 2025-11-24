import express from 'express'
import { login } from '../controllers/login.js'

export const authRouter = express.Router()

authRouter.post('/login', login)
