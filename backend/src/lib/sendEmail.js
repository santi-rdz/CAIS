import { transporter } from '../config/mailer.js'

export async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `CAIS ${process.env.EMAIL_USER}`,
    to,
    subject,
    html,
  })
}
