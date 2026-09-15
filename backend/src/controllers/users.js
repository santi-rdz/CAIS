import { validateSignup } from '@cais/shared/schemas/users'
import { ROLES, ESTADOS } from '@cais/shared/constants/users'
import { UserModel } from '#models/UserModel.js'
import { InvitationModel } from '#models/InvitationModel.js'
import { prisma } from '#config/prisma.js'
import { parsePagination } from '#lib/paginate.js'
import { BCRYPT_ROUNDS } from '#lib/constants.js'
import { canManageUserAccount } from '#lib/userAccess.js'
import { ForbiddenError, ValidationError } from '#lib/appError.js'
import bcrypt from 'bcryptjs'
import { formatZodErrors } from '#lib/formatErrors.js'

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
    res.json(user)
  }

  static async delete(req, res) {
    const target = await UserModel.getById(req.params.id)
    if (!canManageUserAccount(req.session, target)) {
      throw new ForbiddenError('No tienes permiso para eliminar esta cuenta')
    }
    await UserModel.delete(req.params.id)
    res.json({ message: 'Usuario borrado exitosamente' })
  }

  static async update(req, res) {
    // La desactivación sigue la jerarquía de roles; el resto del update ya está
    // acotado por rol (middleware) y área (model).
    if (req.body.estado === ESTADOS.INACTIVO) {
      const target = await UserModel.getById(req.params.id)
      if (!canManageUserAccount(req.session, target)) {
        throw new ForbiddenError('No tienes permiso para desactivar esta cuenta')
      }
    }

    const data = { ...req.body }
    if (data.area && req.session.role !== ROLES.ADMIN) delete data.area

    const updatedUser = await UserModel.update(req.params.id, data)
    res.json(updatedUser)
  }

  static async create(req, res) {
    const roleUp = (req.body.rol ?? '').toUpperCase()
    const isAdminCreator = req.session.role === ROLES.ADMIN

    // Autorización de área/rol (espejo de UserService.preRegister):
    // no-admin queda forzado a su área y no puede crear administradores; el
    // admin elige el área (null para rol ADMIN, requerida para el resto).
    let area
    if (!isAdminCreator) {
      if (roleUp === ROLES.ADMIN) {
        throw new ForbiddenError('No tienes permiso para crear administradores')
      }
      area = req.session.area
    } else if (roleUp === ROLES.ADMIN) {
      area = null
    } else {
      area = req.body.area
      if (!area) throw new ValidationError('El área es requerida para este rol')
    }

    const password_hash = await bcrypt.hash(req.body.password, BCRYPT_ROUNDS)

    const createdUser = await prisma.$transaction((tx) =>
      UserModel.create({ ...req.body, area, password_hash }, tx)
    )

    res.status(201).json({ message: 'Usuario creado exitosamente', usuario: createdUser })
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

    const password_hash = await bcrypt.hash(result.data.password, BCRYPT_ROUNDS)

    const createdUser = await prisma.$transaction(async (tx) => {
      const user = await UserModel.create(
        {
          ...result.data,
          correo: invitacion.correo,
          rol: invitacion.rol,
          area: invitacion.area ?? null,
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
  }
}
