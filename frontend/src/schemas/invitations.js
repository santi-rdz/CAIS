import { z } from 'zod'

// El form de invitaciones recibe `correoField` desde useEmailDomain, que cambia
// entre "solo username UABC" y "email completo". Por eso es una factory.
export function buildInviteSchema(correoField) {
  return z.object({ email: correoField })
}
