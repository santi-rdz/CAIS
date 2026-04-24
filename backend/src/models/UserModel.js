import { randomUUID } from 'node:crypto'
import { prisma } from '#config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '#lib/uuid.js'
import { USER_SORT_DEFS } from '@cais/shared/constants/users'
import { formatDefs } from '#lib/formatDef.js'

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
    estado: 'PENDIENTE',
    rol: inv.roles?.codigo ?? null,
    area: null,
  }
}

function buildPendingWhere({ rol, search }) {
  const where = { usado: false, expira_at: { gt: new Date() } }
  if (rol) {
    where.roles = {
      codigo: { in: rol.split(',').map((r) => r.trim().toUpperCase()) },
    }
  }
  if (search) {
    where.correo = { contains: search }
  }
  return where
}

function buildUserWhere({ statuses, rol, search }) {
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
    where.OR = [
      { nombre: { contains: search } },
      { apellidos: { contains: search } },
      { correo: { contains: search } },
    ]
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

export class UserModel {
  static async getAll({ status, rol, sortBy, search, page, limit }) {
    const statuses = status
      ? status.split(',').map((s) => s.trim().toUpperCase())
      : null

    const includePending = !statuses || statuses.includes('PENDIENTE')
    const onlyPending = statuses?.length === 1 && statuses[0] === 'PENDIENTE'
    const userStatuses = statuses?.filter((s) => s !== 'PENDIENTE') ?? null

    const pendingWhere = buildPendingWhere({ rol, search })
    const userWhere = buildUserWhere({ statuses: userStatuses, rol, search })
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

    // Pendientes primero — contar ambas fuentes en paralelo
    const [pendingCount, userCount] = await Promise.all([
      prisma.invitaciones_registro.count({ where: pendingWhere }),
      onlyPending
        ? Promise.resolve(0)
        : prisma.usuarios.count({ where: userWhere }),
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
      users: [
        ...pendingItems.map(formatPendingInvitation),
        ...userItems.map(formatUser),
      ],
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
      console.error('Error en UserModel.delete:', err)
      throw err
    }
  }

  static async update(id, data) {
    const fieldMap = {
      nombre: 'nombre',
      apellidos: 'apellidos',
      correo: 'correo',
      fechaNacimiento: 'fecha_nacimiento',
      telefono: 'telefono',
      matricula: 'matricula',
      cedula: 'cedula',
      inicioServicio: 'inicio_servicio',
      finServicio: 'fin_servicio',
    }

    const prismaData = Object.fromEntries(
      Object.entries(data)
        .filter(([k]) => fieldMap[k])
        .map(([k, v]) => [fieldMap[k], v])
    )

    if (data.estado) {
      const estadoRow = await prisma.estados.findFirst({
        where: { codigo: data.estado.toUpperCase() },
      })
      if (estadoRow) prismaData.estado_id = estadoRow.id
    }

    try {
      await prisma.usuarios.update({
        where: { id: uuidToBuffer(id) },
        data: prismaData,
      })
      return await this.getById(id)
    } catch (err) {
      if (err.code === 'P2025') return null
      console.error('Error en UserModel.update:', err)
      throw err
    }
  }

  static async create(userData, tx = prisma) {
    const userId = randomUUID()

    const activeStatus = await tx.estados.findFirst({
      where: { codigo: 'ACTIVO' },
    })
    const roleRow = await tx.roles.findFirst({
      where: { codigo: userData.rol.toUpperCase() },
    })

    if (!activeStatus || !roleRow) throw new Error('Estado o rol inválido')

    await tx.usuarios.create({
      data: {
        id: uuidToBuffer(userId),
        nombre: userData.nombre,
        apellidos: userData.apellidos ?? null,
        correo: userData.correo,
        fecha_nacimiento: userData.fechaNacimiento,
        telefono: userData.telefono,
        password_hash: userData.passwordHash,
        estado_id: activeStatus.id,
        rol_id: roleRow.id,
        area_id: userData.areaId ?? null,
        foto: userData.foto ?? null,
        matricula: userData.matricula ?? null,
        cedula: userData.cedula ?? null,
        inicio_servicio: userData.inicioServicio ?? null,
        fin_servicio: userData.finServicio ?? null,
      },
    })

    return await this.getById(userId, tx)
  }
}
