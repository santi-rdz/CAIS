import { validatePartialUser, validateUser } from '../schemas/user.js'
import { validateRegistration } from '../schemas/register.js'
import { randomUUID } from 'node:crypto'
import { UserModel } from '../models/UserModel.js'
import { InvitationModel } from '../models/InvitationModel.js'
import { prisma } from '../config/prisma.js'
import { uuidToBuffer } from '../lib/uuid.js'
import bcrypt from 'bcryptjs'
import { formatZodErrors } from '../lib/formatErrors.js'

async function getAreaIdFromCreator(creatorId) {
  if (!creatorId) return null
  try {
    const creator = await prisma.usuarios.findUnique({
      where: { id: uuidToBuffer(creatorId) },
      select: { area_id: true },
    })
    return creator?.area_id ?? null
  } catch {
    return null
  }
}

export class UserController {
  static async getAll(req, res) {
    const { status, rol, sortBy, search } = req.query

    const page = +req.query.page || 1
    const limit = +req.query.limit || 10
    const users = await UserModel.getAll({
      status,
      rol,
      sortBy,
      search,
      page,
      limit,
    })
    res.json(users)
  }

  static async getById(req, res) {
    const { id } = req.params
    const user = await UserModel.getById(id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  }

  static async delete(req, res) {
    const { id } = req.params
    const success = await UserModel.delete(id)
    if (!success)
      return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json({ message: 'Usuario borrado exitosamente' })
  }

  static async update(req, res) {
    const result = validatePartialUser(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        fields: formatZodErrors(result.error),
      })
    }

    const { id } = req.params
    try {
      const updatedUser = await UserModel.update(id, result.data)
      if (!updatedUser)
        return res.status(404).json({ message: 'Usuario no encontrado' })
      res.json(updatedUser)
    } catch (err) {
      console.error('Error al actualizar usuario:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al actualizar usuario',
      })
    }
  }

  static async create(req, res) {
    const result = validateUser(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de usuario inválidos',
        fields: formatZodErrors(result.error),
      })
    }

    const data = result.data

    try {
      const passwordHash = await bcrypt.hash(data.password, 12)
      const fullName = `${data.nombre} ${data.apellido}`
      const foto = `https://randomuser.me/api/portraits/${Math.random() < 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99) + 1}.jpg`

      const inicioServicio =
        data.servicioInicioAnio && data.servicioInicioPeriodo
          ? `${data.servicioInicioAnio}-${data.servicioInicioPeriodo}`
          : null
      const finServicio =
        data.servicioFinAnio && data.servicioFinPeriodo
          ? `${data.servicioFinAnio}-${data.servicioFinPeriodo}`
          : null

      const areaId = await getAreaIdFromCreator(req.headers['x-user-id'])

      const createdUser = await prisma.$transaction(async (tx) => {
        return await UserModel.create(
          {
            nombre: fullName,
            correo: data.correo,
            fechaNacimiento: data.fechaNacimiento,
            telefono: data.telefono,
            passwordHash,
            rol: data.rol,
            areaId,
            foto,
            matricula: data.matricula || null,
            cedula: data.cedula || null,
            inicioServicio,
            finServicio,
          },
          tx
        )
      })

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        usuario: createdUser,
      })
    } catch (err) {
      if (err.code === 'P2002') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'El correo ya está registrado',
        })
      }
      console.error('Error al crear usuario:', err)
      res
        .status(500)
        .json({ error: 'InternalError', message: 'Error al crear usuario' })
    }
  }

  static async registro(req, res) {
    const { token } = req.body

    try {
      const invitacion = await InvitationModel.findByToken(token)
      if (!invitacion) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'El token es inválido, ha expirado o ya fue utilizado',
        })
      }

      const result = validateRegistration(req.body, invitacion.rol)
      if (result.error) {
        return res.status(422).json({
          error: 'ValidationError',
          message: 'Datos de registro inválidos',
          fields: formatZodErrors(result.error),
        })
      }

      const data = result.data
      const passwordHash = await bcrypt.hash(data.password, 12)

      const fullName = `${data.nombre} ${data.apellido}`
      const foto = `https://randomuser.me/api/portraits/${Math.random() < 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99) + 1}.jpg`
      const matricula = data.matricula || null
      const cedula = data.cedula || null
      const inicioServicio =
        data.servicioInicioAnio && data.servicioInicioPeriodo
          ? `${data.servicioInicioAnio}-${data.servicioInicioPeriodo}`
          : null
      const finServicio =
        data.servicioFinAnio && data.servicioFinPeriodo
          ? `${data.servicioFinAnio}-${data.servicioFinPeriodo}`
          : null

      const userId = randomUUID()

      const createdUser = await prisma.$transaction(async (tx) => {
        const activeStatus = await tx.estados.findFirst({
          where: { codigo: 'ACTIVO' },
        })
        const roleRow = await tx.roles.findFirst({
          where: { codigo: invitacion.rol.toUpperCase() },
        })

        if (!activeStatus || !roleRow) throw new Error('Estado o rol inválido')

        await tx.usuarios.create({
          data: {
            id: uuidToBuffer(userId),
            nombre: fullName,
            correo: invitacion.correo,
            fecha_nacimiento: new Date(data.fechaNacimiento),
            telefono: data.telefono,
            password_hash: passwordHash,
            estado_id: activeStatus.id,
            rol_id: roleRow.id,
            area_id: invitacion.area_id ?? null,
            foto,
            matricula,
            cedula,
            inicio_servicio: inicioServicio,
            fin_servicio: finServicio,
          },
        })

        await InvitationModel.markAsUsed(token, tx)

        return await UserModel.getById(userId, tx)
      })

      res.status(201).json({
        message: 'Registro completado exitosamente',
        usuario: createdUser,
      })
    } catch (err) {
      if (err.code === 'P2002') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'El correo ya está registrado',
        })
      }
      console.error('Error en registro:', err)
      res.status(500).json({
        error: 'InternalError',
        message: 'Error al completar registro',
      })
    }
  }
}
