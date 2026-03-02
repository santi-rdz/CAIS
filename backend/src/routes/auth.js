import express from 'express'
import { AuthController } from '../controllers/auth.js'

export const authRouter = express.Router()

authRouter.post('/login', AuthController.login)
