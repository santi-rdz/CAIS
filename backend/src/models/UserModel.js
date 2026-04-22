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

export class UserModel {
  static async getAll({ status, rol, sortBy, search, page, limit }) {
    const where = {}

    if (status) {
      const statuses = status.split(',').map((s) => s.trim().toUpperCase())
      where.estados = { codigo: { in: statuses } }
    }

    if (rol) {
      const roles = rol.split(',').map((r) => r.trim().toUpperCase())
      where.roles = { codigo: { in: roles } }
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { apellido: { contains: search } },
        { correo: { contains: search } },
      ]
    }

    const orderBy =
      sortBy && SORT_OPTIONS[sortBy]
        ? SORT_OPTIONS[sortBy]
        : { creado_at: 'desc' }

    const offset = (page - 1) * limit

    const [users, total] = await prisma.$transaction([
      prisma.usuarios.findMany({
        where,
        include: includeRelations,
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.usuarios.count({ where }),
    ])

    return { users: users.map(formatUser), count: total }
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
      apellido: 'apellido',
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
        apellido: userData.apellido ?? null,
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
