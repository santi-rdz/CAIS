import { validatePartialUser, validateUser } from '../schemas/usuario.js'
import { validateRegistro } from '../schemas/registro.js'
import { randomUUID } from 'node:crypto'
import { UserModel } from '../models/UserModel.js'
import { InvitacionModel } from '../models/TokenModel.js'
import { pool } from '../config/db.js'
import bcrypt from 'bcryptjs'

export class UserController {
  /**
   * GET /usuarios
   * Obtiene una lista paginada de todos los usuarios, con opciones de filtrado y ordenamiento.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async getAll(req, res) {
    const { status, sortBy, search } = req.query
    const page = +req.query.page || 1
    const limit = +req.query.limit || 10
    const users = await UserModel.getAll({ status, sortBy, search, page, limit })
    res.json(users)
  }

  /**
   * GET /usuarios/:id
   * Obtiene los detalles de un usuario específico mediante su ID.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async getById(req, res) {
    const { id } = req.params
    const user = await UserModel.getById(id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  }

  /**
   * DELETE /usuarios/:id
   * Elimina un usuario del sistema mediante su ID.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async delete(req, res) {
    const { id } = req.params
    const success = await UserModel.delete(id)
    if (!success) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json({ message: 'Usuario borrado exitosamente' })
  }

  /**
   * PATCH /usuarios/:id
   * Actualiza parcialmente la información de un usuario existente.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async update(req, res) {
    const result = validatePartialUser(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const { id } = req.params
    const updatedUser = await UserModel.update(id, result.data)
    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' })

    res.json(updatedUser)
  }

  /**
   * POST /usuarios
   * Crea un usuario directamente en el sistema (flujo para coordinador/admin).
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async create(req, res) {
    const result = validateUser(req.body)
    if (result.error) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'Datos de usuario inválidos',
        details: JSON.parse(result.error.message),
      })
    }

    const data = result.data

    try {
      const passwordHash = await bcrypt.hash(data.password, 12)
      const nombre = `${data.nombre} ${data.apellido}`
      const foto = `https://randomuser.me/api/portraits/${Math.random() < 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99) + 1}.jpg`

      const inicioServicio =
        data.servicioInicioAnio && data.servicioInicioPeriodo
          ? `${data.servicioInicioAnio}-${data.servicioInicioPeriodo}`
          : null
      const finServicio =
        data.servicioFinAnio && data.servicioFinPeriodo
          ? `${data.servicioFinAnio}-${data.servicioFinPeriodo}`
          : null

      const conn = await pool.getConnection()
      try {
        await conn.beginTransaction()

        const createdUser = await UserModel.create(
          {
            nombre,
            correo: data.correo,
            fechaNacimiento: data.fechaNacimiento,
            telefono: data.telefono,
            passwordHash,
            rol: data.rol,
            foto,
            matricula: data.matricula || null,
            cedula: data.cedula || null,
            inicioServicio,
            finServicio,
          },
          conn,
        )

        await conn.commit()
        res.status(201).json({
          message: 'Usuario creado exitosamente',
          usuario: createdUser,
        })
      } catch (err) {
        await conn.rollback()
        throw err
      } finally {
        conn.release()
      }
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'El correo ya está registrado',
        })
      }
      console.error('Error al crear usuario:', err)
      res.status(500).json({ error: 'InternalError', message: 'Error al crear usuario' })
    }
  }

  /**
   * POST /usuarios/registro
   * Completa el registro de un nuevo usuario utilizando un token de invitación válido.
   *
   * @param {Object} req - Objeto de petición de Express.
   * @param {Object} res - Objeto de respuesta de Express.
   */
  static async registro(req, res) {
    const { token } = req.body

    try {
      // 1. Validar que el token existe y es válido
      const invitacion = await InvitacionModel.findByToken(token)
      if (!invitacion) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'El token es inválido, ha expirado o ya fue utilizado',
        })
      }

      // 2. Validar datos según el rol
      const result = validateRegistro(req.body, invitacion.rol)
      if (result.error) {
        return res.status(422).json({
          error: 'ValidationError',
          message: 'Datos de registro inválidos',
          details: JSON.parse(result.error.message),
        })
      }

      const data = result.data

      // 3. Hashear contraseña
      const passwordHash = await bcrypt.hash(data.password, 12)

      // 4. Crear usuario en transacción
      const conn = await pool.getConnection()
      try {
        await conn.beginTransaction()

        const userId = randomUUID()

        const [[estadoRow]] = await conn.query('SELECT id FROM estados WHERE codigo = ?', [
          'ACTIVO',
        ])
        const [[rolRow]] = await conn.query('SELECT id FROM roles WHERE LOWER(codigo) = ?', [
          invitacion.rol.toLowerCase(),
        ])

        const nombre = `${data.nombre} ${data.apellido}`
        const foto = `https://randomuser.me/api/portraits/${Math.random() < 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99) + 1}.jpg`

        // Campos específicos por rol
        const matricula = data.matricula || null
        const inicioServicio =
          data.servicioInicioAnio && data.servicioInicioPeriodo
            ? `${data.servicioInicioAnio}-${data.servicioInicioPeriodo}`
            : null
        const finServicio =
          data.servicioFinAnio && data.servicioFinPeriodo
            ? `${data.servicioFinAnio}-${data.servicioFinPeriodo}`
            : null

        await conn.query(
          `INSERT INTO usuarios
            (id, nombre, correo, fecha_nacimiento, telefono, password_hash, estado_id, rol_id, foto, matricula, inicio_servicio, fin_servicio)
           VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            nombre,
            invitacion.correo,
            new Date(data.fechaNacimiento).toISOString().split('T')[0],
            data.telefono,
            passwordHash,
            estadoRow.id,
            rolRow.id,
            foto,
            matricula,
            inicioServicio,
            finServicio,
          ],
        )

        // Marcar invitación como usada
        await InvitacionModel.markAsUsed(token, conn)

        await conn.commit()

        const createdUser = await UserModel.getById(userId)
        res.status(201).json({
          message: 'Registro completado exitosamente',
          usuario: createdUser,
        })
      } catch (err) {
        await conn.rollback()
        throw err
      } finally {
        conn.release()
      }
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'El correo ya está registrado',
        })
      }
      console.error('Error en registro:', err)
      res.status(500).json({ error: 'InternalError', message: 'Error al completar registro' })
    }
  }
}
