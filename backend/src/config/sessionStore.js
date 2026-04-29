import { Store } from 'express-session'

let _prisma = null
async function getPrisma() {
  if (!_prisma) {
    const mod = await import('./prisma.js')
    _prisma = mod.prisma
  }
  return _prisma
}

function getExpire(session) {
  return session.cookie?.expires instanceof Date
    ? session.cookie.expires
    : new Date(Date.now() + (session.cookie?.maxAge ?? 8 * 60 * 60 * 1000))
}

export class PrismaSessionStore extends Store {
  async get(sid, cb) {
    try {
      const prisma = await getPrisma()
      const row = await prisma.sessions.findUnique({ where: { sid } })
      if (!row || row.expire < new Date()) return cb(null, null)
      cb(null, JSON.parse(row.data))
    } catch (err) {
      cb(err)
    }
  }

  async set(sid, session, cb) {
    try {
      const prisma = await getPrisma()
      const expire = getExpire(session)
      await prisma.sessions.upsert({
        where: { sid },
        create: { sid, data: JSON.stringify(session), expire },
        update: { data: JSON.stringify(session), expire },
      })
      cb(null)
    } catch (err) {
      cb(err)
    }
  }

  async destroy(sid, cb) {
    try {
      const prisma = await getPrisma()
      await prisma.sessions.delete({ where: { sid } })
    } catch {
      // already gone
    }
    cb(null)
  }

  async touch(sid, session, cb) {
    try {
      const prisma = await getPrisma()
      await prisma.sessions.update({
        where: { sid },
        data: { expire: getExpire(session) },
      })
    } catch {
      // session may not exist
    }
    cb(null)
  }
}
