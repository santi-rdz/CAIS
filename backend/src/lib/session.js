/**
 * `express-session` expone `regenerate`/`destroy` con callbacks estilo Node, no
 * promesas. Un error dentro de esos callbacks NO se propaga al error middleware
 * porque el handler async ya resolvió su promesa cuando el callback se dispara.
 * Los envolvemos en promesas para poder `await`-earlos e integrarlos al flujo
 * async normal, donde el rechazo sí llega al middleware.
 */
export const regenerateSession = (session) =>
  new Promise((resolve, reject) => session.regenerate((err) => (err ? reject(err) : resolve())))

export const destroySession = (session) =>
  new Promise((resolve, reject) => session.destroy((err) => (err ? reject(err) : resolve())))
