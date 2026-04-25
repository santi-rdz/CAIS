export function passwordResetEmail(name, url) {
  const year = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Restablecer contraseña — CAIS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');</style>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color: #F3F4F6; padding: 48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width: 560px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E5E7EB;">

          <!-- Brand mark -->
          <tr>
            <td style="padding: 36px 48px 0 48px;">
              <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #166534;">CAIS</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 20px 48px 0 48px;">
              <div style="height: 1px; background-color: #E5E7EB;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 48px 0 48px;">

              <h1 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827; letter-spacing: -0.025em; line-height: 1.35;">
                Restablecer contraseña
              </h1>

              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.75; color: #374151;">
                Hola <span style="font-weight: 600; color: #111827;">${name || 'Usuario'}</span>,
              </p>

              <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.75; color: #374151;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Usa el siguiente enlace para crear una nueva contraseña.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 36px;">
                <tr>
                  <td style="background-color: #166534; border-radius: 5px;">
                    <a href="${url}" style="display: block; padding: 13px 26px; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap;">
                      Restablecer contraseña &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info note -->
              <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 4px; width: 100%;">
                <tr>
                  <td style="border-left: 3px solid #166534; padding: 11px 16px; background-color: #F9FAFB; border-radius: 0 4px 4px 0;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6B7280;">
                      Este enlace es válido por <span style="font-weight: 500; color: #374151;">1 hora</span>. Si no solicitaste este cambio, puedes ignorar este correo.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer divider -->
          <tr>
            <td style="padding: 36px 48px 0 48px;">
              <div style="height: 1px; background-color: #E5E7EB;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 48px 32px 48px;">
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #9CA3AF;">
                &copy; ${year} Centro de Atención Integral de Salud
              </p>
            </td>
          </tr>

        </table>
        <!-- / Card -->

      </td>
    </tr>
  </table>

</body>
</html>`
}
