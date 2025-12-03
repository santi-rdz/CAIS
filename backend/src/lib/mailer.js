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

export async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `CAIS ${process.env.EMAIL_USER}`,
    to,
    subject,
    html,
  })
}
