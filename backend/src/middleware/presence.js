import { AuthModel } from '#models/AuthModel.js'
import { PRESENCE_THROTTLE_MS } from '#lib/constants.js'

export function trackPresence(req, _res, next) {
  const { userId } = req.session ?? {}
  if (userId) {
    const now = Date.now()
    if (!req.session.lastSeenAt || now - req.session.lastSeenAt > PRESENCE_THROTTLE_MS) {
      req.session.lastSeenAt = now
      AuthModel.touchLastAccess(userId).catch(() => {})
    }
  }
  next()
}
