import { validateUserUpdate, validateUserCreate, validateSignup } from '@cais/shared/schemas/users'
import { ROLES } from '@cais/shared/constants/users'
import { UserModel } from '#models/UserModel.js'
import { InvitationModel } from '#models/InvitationModel.js'
import { prisma } from '#config/prisma.js'
import { parsePagination } from '#lib/paginate.js'
import { BCRYPT_ROUNDS } from '#lib/constants.js'
import bcrypt from 'bcryptjs'
import { formatZodErrors } from '#lib/formatErrors.js'

function randomAvatar() {
  const gender = Math.random() < 0.5 ? 'men' : 'women'
  const n = Math.floor(Math.random() * 99) + 1
  return `https://randomuser.me/api/portraits/${gender}/${n}.jpg`
}

function handlePrismaError(err, res) {
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Conflict', message: 'El correo ya está registrado' })
  }
  throw err
}

export class UserController {
  static async getAll(req, res) {
    const { status, rol, sortBy, search } = req.query
    const { page, limit } = parsePagination(req.query)

    if (req.session.role !== ROLES.ADMIN && !req.session.areaId) {
      return res.status(403).json({ message: 'Usuario sin área asignada' })
    }

    const areaId = req.session.role === ROLES.ADMIN ? null : req.session.areaId

    const users = await UserModel.getAll({
      status,
      rol,
      sortBy,
      search,
      page,
      limit,
      areaId,
    })
    res.json(users)
  }

  static async getById(req, res) {
    const user = await UserModel.getById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  }

  static async delete(req, res) {
    const success = await UserModel.delete(req.params.id)
    if (!success) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json({ message: 'Usuario borrado exitosamente' })
  }

  static async update(req, res) {
    const result = validateUserUpdate(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    const updatedUser = await UserModel.update(req.params.id, result.data)
    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(updatedUser)
  }

  static async create(req, res) {
    const result = validateUserCreate(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de usuario inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const area = req.session.role === ROLES.ADMIN ? result.data.area : req.session.area
      const password_hash = await bcrypt.hash(result.data.password, BCRYPT_ROUNDS)

      const createdUser = await prisma.$transaction((tx) =>
        UserModel.create({ ...result.data, area, foto: randomAvatar(), password_hash }, tx)
      )

      res.status(201).json({ message: 'Usuario creado exitosamente', usuario: createdUser })
    } catch (err) {
      handlePrismaError(err, res)
    }
  }

  static async registro(req, res) {
    const invitacion = await InvitationModel.findByToken(req.body.token)
    if (!invitacion) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'El token es inválido, ha expirado o ya fue utilizado',
      })
    }

    const result = validateSignup(req.body, invitacion.rol)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de registro inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    try {
      const password_hash = await bcrypt.hash(result.data.password, BCRYPT_ROUNDS)

      const createdUser = await prisma.$transaction(async (tx) => {
        const user = await UserModel.create(
          {
            ...result.data,
            correo: invitacion.correo,
            rol: invitacion.rol,
            area: invitacion.area ?? null,
            foto: randomAvatar(),
            password_hash,
          },
          tx
        )
        await InvitationModel.markAsUsed(req.body.token, tx)
        return user
      })

      res.status(201).json({
        message: 'Registro completado exitosamente',
        usuario: createdUser,
      })
    } catch (err) {
      handlePrismaError(err, res)
    }
  }
}
