import { createTransport } from 'nodemailer'

export const transporter =
  process.env.NODE_ENV === 'test'
    ? { sendMail: async () => ({ messageId: 'test-noop' }) }
    : createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
