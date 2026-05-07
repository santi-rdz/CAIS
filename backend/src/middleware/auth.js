import { ROLES } from '@cais/shared/constants/users'

export function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'No autenticado' })
  }
  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.session?.role)) {
      return res.status(403).json({ error: 'Sin permiso' })
    }
    next()
  }
}

export function requireArea(...areas) {
  return (req, res, next) => {
    if (req.session?.role === ROLES.ADMIN) return next()
    if (!areas.includes(req.session?.area)) {
      return res.status(403).json({ error: 'Sin permiso para esta área' })
    }
    next()
  }
}
