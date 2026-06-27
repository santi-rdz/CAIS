import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { USER_SORT_DEFS, ESTADOS } from '@cais/shared/constants/users'
import { formatDefs } from '#lib/formatDef.js'
import { HttpError } from '#lib/httpError.js'

const SORT_OPTIONS = formatDefs(USER_SORT_DEFS)

const includeRelations = {
  estados: true,
  roles: true,
  areas: true,
}

function formatUser(u) {
  if (!u) return null
  const { estados, roles, areas, ...rest } = u
  return {
    ...rest,
    id: bufferToUUID(u.id),
    estado: estados?.codigo ?? null,
    rol: roles?.codigo ?? null,
    area: areas?.nombre ?? null,
  }
}

function formatPendingInvitation(inv) {
  return {
    id: inv.correo,
    nombre: null,
    apellidos: null,
    correo: inv.correo,
    foto: null,
    ultimo_acceso: null,
    estado: ESTADOS.PENDIENTE,
    rol: inv.roles?.codigo ?? null,
    area: null,
  }
}

function buildPendingWhere({ rol, search, areaId }) {
  const where = { usado: false, expira_at: { gt: new Date() } }
  if (rol) {
    where.roles = {
      codigo: { in: rol.split(',').map((r) => r.trim().toUpperCase()) },
    }
  }
  if (search) {
    where.correo = { contains: search }
  }
  if (areaId != null) {
    where.usuarios = { is: { area_id: areaId } }
  }
  return where
}

function buildUserWhere({ statuses, rol, search, areaId }) {
  const where = {}
  if (statuses?.length) {
    where.estados = { codigo: { in: statuses } }
  }
  if (rol) {
    where.roles = {
      codigo: { in: rol.split(',').map((r) => r.trim().toUpperCase()) },
    }
  }
  if (search) {
    const tokens = search.trim().split(/\s+/).filter(Boolean)
    where.AND = tokens.map((token) => ({
      OR: [
        { nombre: { contains: token } },
        { apellidos: { contains: token } },
        { correo: { contains: token } },
      ],
    }))
  }
  if (areaId != null) {
    where.area_id = areaId
  }
  return where
}

async function queryPending({ where, skip, take }) {
  if (take <= 0) return { items: [], count: 0 }
  const [items, count] = await prisma.$transaction([
    prisma.invitaciones_registro.findMany({
      where,
      include: { roles: true },
      orderBy: { creado_at: 'desc' },
      skip,
      take,
    }),
    prisma.invitaciones_registro.count({ where }),
  ])
  return { items, count }
}

async function queryUsers({ where, orderBy, skip, take }) {
  if (take <= 0) return { items: [], count: 0 }
  const [items, count] = await prisma.$transaction([
    prisma.usuarios.findMany({
      where,
      include: includeRelations,
      orderBy,
      skip,
      take,
    }),
    prisma.usuarios.count({ where }),
  ])
  return { items, count }
}

function buildServicio(anio, periodo) {
  return anio && periodo ? `${anio}-${periodo}` : null
}

export class UserModel {
  static async getAll({ status, rol, sortBy, search, page, limit, areaId }) {
    const statuses = status ? status.split(',').map((s) => s.trim().toUpperCase()) : null

    const includePending = !statuses || statuses.includes(ESTADOS.PENDIENTE)
    const onlyPending = statuses?.length === 1 && statuses[0] === ESTADOS.PENDIENTE
    const userStatuses = statuses?.filter((s) => s !== ESTADOS.PENDIENTE) ?? null

    const pendingWhere = buildPendingWhere({ rol, search, areaId })
    const userWhere = buildUserWhere({
      statuses: userStatuses,
      rol,
      search,
      areaId,
    })
    const orderBy = SORT_OPTIONS[sortBy] ?? { creado_at: 'desc' }
    const globalOffset = (page - 1) * limit

    if (!includePending) {
      const { items, count } = await queryUsers({
        where: userWhere,
        orderBy,
        skip: globalOffset,
        take: limit,
      })
      return { users: items.map(formatUser), count }
    }

    const [pendingCount, userCount] = await Promise.all([
      prisma.invitaciones_registro.count({ where: pendingWhere }),
      onlyPending ? Promise.resolve(0) : prisma.usuarios.count({ where: userWhere }),
    ])

    const pendingSkip = Math.min(globalOffset, pendingCount)
    const pendingTake = Math.min(pendingCount - pendingSkip, limit)
    const userSkip = Math.max(0, globalOffset - pendingCount)
    const userTake = limit - pendingTake

    const [{ items: pendingItems }, { items: userItems }] = await Promise.all([
      queryPending({
        where: pendingWhere,
        skip: pendingSkip,
        take: pendingTake,
      }),
      onlyPending
        ? Promise.resolve({ items: [] })
        : queryUsers({
            where: userWhere,
            orderBy,
            skip: userSkip,
            take: userTake,
          }),
    ])

    return {
      users: [...pendingItems.map(formatPendingInvitation), ...userItems.map(formatUser)],
      count: pendingCount + userCount,
    }
  }

  static async getById(id, tx = prisma) {
    const user = await tx.usuarios.findUnique({
      where: { id: uuidToBuffer(id) },
      include: includeRelations,
    })
    return formatUser(user)
  }

  static async delete(id) {
    try {
      await prisma.usuarios.delete({ where: { id: uuidToBuffer(id) } })
      return true
    } catch (err) {
      if (err.code === 'P2025') return false
      throw err
    }
  }

  static async update(id, data) {
    const {
      servicio_inicio_anio,
      servicio_inicio_periodo,
      servicio_fin_anio,
      servicio_fin_periodo,
      estado,
      ...rest
    } = data

    const prismaData = {
      ...rest,
      ...(servicio_inicio_anio &&
        servicio_inicio_periodo && {
          inicio_servicio: buildServicio(servicio_inicio_anio, servicio_inicio_periodo),
        }),
      ...(servicio_fin_anio &&
        servicio_fin_periodo && {
          fin_servicio: buildServicio(servicio_fin_anio, servicio_fin_periodo),
        }),
      ...(estado && { estados: { connect: { codigo: estado } } }),
    }

    try {
      await prisma.usuarios.update({
        where: { id: uuidToBuffer(id) },
        data: prismaData,
      })
      return await this.getById(id)
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async create(userData, tx = prisma) {
    const userId = randomUUID()

    try {
      await tx.usuarios.create({
        data: {
          id: uuidToBuffer(userId),
          nombre: userData.nombre,
          apellidos: userData.apellidos ?? null,
          correo: userData.correo,
          fecha_nacimiento: userData.fecha_nacimiento,
          telefono: userData.telefono,
          password_hash: userData.password_hash,
          estados: { connect: { codigo: ESTADOS.ACTIVO } },
          roles: { connect: { codigo: userData.rol } },
          ...(userData.area ? { areas: { connect: { nombre: userData.area } } } : {}),
          foto: userData.foto ?? null,
          matricula: userData.matricula ?? null,
          cedula: userData.cedula ?? null,
          inicio_servicio:
            buildServicio(userData.servicio_inicio_anio, userData.servicio_inicio_periodo) ?? null,
          fin_servicio:
            buildServicio(userData.servicio_fin_anio, userData.servicio_fin_periodo) ?? null,
        },
      })
    } catch (err) {
      if (err.code === 'P2002') {
        throw new HttpError(409, 'El correo ya está registrado', { error: 'Conflict' })
      }
      throw err
    }

    return await this.getById(userId, tx)
  }
}
