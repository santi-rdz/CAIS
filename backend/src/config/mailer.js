import { createTransport } from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
