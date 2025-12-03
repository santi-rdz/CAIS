import { validatePartialUser, validateUser } from '../schemas/usuario.js'
import { validatePreUser } from '../schemas/createPreUser.js'
import { randomUUID } from 'node:crypto'
import { UserModel } from '../models/user.js'
import { UserService } from '../services/users.js'

export class UserController {
  static async getAll(req, res) {
    const { status, sortBy, search } = req.query
    const page = +req.query.page
    const limit = +req.query.limit
    const users = await UserModel.getAll({ status, sortBy, search, page, limit })
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
    if (!success) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json({ message: 'Usuario borrado exitosamente' })
  }

  static async update(req, res) {
    const result = validatePartialUser(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const { id } = req.params
    const updatedUser = await UserModel.update(id, result.data)
    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' })

    res.json(updatedUser)
  }

  static async preRegister(req, res) {
    const result = validatePreUser(req.body)
    if (result.error) return res.status(400).json({ message: JSON.parse(result.error.message) })

    const users = await UserService.preRegister(result.data)
    res.status(201).json(users)
  }

  static async fullRegister(req, res) {
    const result = validateUser(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const newUser = { id: randomUUID(), ...result.data }
    const createdUser = await UserModel.fullRegister(newUser)
    res.status(201).json(createdUser)
  }
}
