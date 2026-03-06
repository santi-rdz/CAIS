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
