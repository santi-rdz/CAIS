import { sendEmail } from './mailer.js'
sendEmail({
  to: 'raul.rodriguez39@uabc.edu.mx',
  subject: 'Prueba',
  html: '<h1>Funciona!<h1>',
})
  .then(() => console.log('Correo enviado!'))
  .catch((err) => console.log(err))
