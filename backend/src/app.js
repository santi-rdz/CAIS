import express from 'express'
import cors from 'cors'
import { writeFile } from 'node:fs/promises'
const app = express()
import { usuarios as usuariosJSON } from './usuarios.js'
import { validatePartialUser, validateUser } from './schemas/usuario.js'
import { validatePreUser } from './schemas/createPreUser.js'
import { randomUUID } from 'node:crypto'
let usuarios = usuariosJSON
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)
app.use(express.json())

app.get('/usuarios', (req, res) => {
  const { status } = req.query
  if (!status) res.json(usuarios)

  const filteredusuarios = usuarios.filter((paciente) => paciente.status === status)
  return res.json(filteredusuarios)
})
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params
  const paciente = usuarios.find((p) => p.id === id)
  if (!paciente) res.status(404).json({ message: 'Paciente no encontrado' })
  res.json(paciente)
})
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params
  const pacienteIndex = usuarios.findIndex((p) => p.id === id)
  if (pacienteIndex === -1) res.status(404).json({ message: 'Paciente no encontrado' })
  usuarios.splice(pacienteIndex, 1)
  writeUsuarios()
  res.json({ meesage: 'Paciente borrado exitosamente' })
})
app.patch('/usuarios/:id', (req, res) => {
  const result = validatePartialUser(req.body)
  if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

  const { id } = req.params
  const userIndex = usuarios.findIndex((u) => u.id === id)
  const updatedUser = {
    ...usuarios[userIndex],
    ...result.data,
  }
  usuarios[userIndex] = updatedUser
  writeUsuarios()
  res.json(updatedUser)
})
app.post('/usuarios/pre', (req, res) => {
  const result = validatePreUser(req.body)
  if (result.error) return res.status(400).json({ message: JSON.parse(result.error.message) })

  const newUsers = result.data.map((user) => ({
    id: randomUUID(),
    ...user,
  }))

  usuarios.unshift(...newUsers)
  writeUsuarios()
  res.status(201).json(newUsers)
})
app.post('/usuarios/complete', (req, res) => {
  const result = validateUser(req.body)
  if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
  const newUser = {
    id: randomUUID(),
    ...result.data,
  }
  // Push user
  writeUsuarios()
  res.status(201).json(newUser)
})

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000')
})

async function writeUsuarios() {
  await writeFile('./src/usuarios.json', JSON.stringify(usuarios, null, 2))
}
