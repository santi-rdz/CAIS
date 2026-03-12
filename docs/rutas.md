# Cómo crear rutas en el backend

Cada feature tiene cuatro archivos:

```
src/routes/      reportes.js      ← endpoints y middlewares
src/controllers/ reportes.js      ← valida el body, llama al modelo
src/models/      ReporteModel.js  ← queries a Prisma
src/schemas/     reporte.js       ← schemas Zod
```

---

## Schema

```js
// src/schemas/reporte.js
import z from 'zod'

const reporteSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  tipo: z.enum(['medico', 'nutricion'], {
    errorMap: () => ({ message: 'Tipo inválido' }),
  }),
})

export const validateReporte = (input) => reporteSchema.safeParse(input)
export const validatePartialReporte = (input) => reporteSchema.partial().safeParse(input)
```

Ver `docs/zod.md` para la referencia completa de validaciones.

## Model

```js
// src/models/ReporteModel.js
import { prisma } from '../config/prisma.js'
import { uuidToBuffer, bufferToUUID } from '../lib/uuid.js'

export class ReporteModel {
  static async getAll() {
    const data = await prisma.reportes.findMany()
    return data.map(format)
  }

  static async getById(id, tx = prisma) {
    const r = await tx.reportes.findUnique({ where: { id: uuidToBuffer(id) } })
    return r ? format(r) : null
  }

  static async create(data, tx = prisma) {
    return format(await tx.reportes.create({ data }))
  }

  static async update(id, data, tx = prisma) {
    try {
      return format(await tx.reportes.update({ where: { id: uuidToBuffer(id) }, data }))
    } catch (err) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  static async delete(id) {
    try {
      await prisma.reportes.delete({ where: { id: uuidToBuffer(id) } })
      return true
    } catch (err) {
      if (err.code === 'P2025') return false
      throw err
    }
  }
}

// Siempre formatear antes de retornar — Prisma devuelve los UUIDs como Uint8Array
function format(r) {
  return { id: bufferToUUID(r.id), titulo: r.titulo, tipo: r.tipo }
}
```

El parámetro `tx = prisma` permite usar el método dentro de una transacción. Ver `docs/prisma.md`.

## Controller

```js
// src/controllers/reportes.js
import { validateReporte, validatePartialReporte } from '../schemas/reporte.js'
import { ReporteModel } from '../models/ReporteModel.js'
import { formatZodErrors } from '../lib/formatErrors.js'

export class ReporteController {
  static async getAll(req, res) {
    res.json(await ReporteModel.getAll())
  }

  static async getById(req, res) {
    const r = await ReporteModel.getById(req.params.id)
    if (!r) return res.status(404).json({ message: 'No encontrado' })
    res.json(r)
  }

  static async create(req, res) {
    const result = validateReporte(req.body)
    if (!result.success)
      return res.status(422).json({ error: 'ValidationError', fields: formatZodErrors(result.error) })

    try {
      res.status(201).json(await ReporteModel.create(result.data))
    } catch (err) {
      if (err.code === 'P2002') return res.status(409).json({ error: 'Conflict' })
      res.status(500).json({ error: 'InternalError' })
    }
  }

  static async update(req, res) {
    const result = validatePartialReporte(req.body)
    if (!result.success)
      return res.status(422).json({ error: 'ValidationError', fields: formatZodErrors(result.error) })

    const r = await ReporteModel.update(req.params.id, result.data)
    if (!r) return res.status(404).json({ message: 'No encontrado' })
    res.json(r)
  }

  static async delete(req, res) {
    const ok = await ReporteModel.delete(req.params.id)
    if (!ok) return res.status(404).json({ message: 'No encontrado' })
    res.json({ message: 'Eliminado' })
  }
}
```

Códigos HTTP: `200` ok · `201` creado · `401` sin sesión · `403` sin permiso · `404` no encontrado · `409` duplicado · `422` validación · `500` error interno.

## Router

```js
// src/routes/reportes.js
import { Router } from 'express'
import { ReporteController } from '../controllers/reportes.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const privileged = requireRole('COORDINADOR', 'ADMIN')

export const reporteRouter = new Router()

reporteRouter.use(requireAuth)                              // aplica a todo lo que sigue

reporteRouter.get('/',     ReporteController.getAll)
reporteRouter.get('/:id',  ReporteController.getById)
reporteRouter.post('/',    privileged, ReporteController.create)
reporteRouter.patch('/:id', privileged, ReporteController.update)
reporteRouter.delete('/:id', privileged, ReporteController.delete)
```

Las rutas públicas (sin sesión) van **antes** del `router.use(requireAuth)`.

## Registrar en app.js

```js
import { reporteRouter } from './routes/reportes.js'
app.use('/reportes', reporteRouter)
```

## Test

```js
// src/__tests__/reportes.test.js
import request from 'supertest'
import app from '../app.js'

describe('GET /reportes', () => {
  it('retorna 401 sin sesión', async () => {
    const res = await request(app).get('/reportes')
    expect(res.status).toBe(401)
  })
})
```

```bash
npm run file reportes   # correr solo este archivo
```

---

**Checklist:**
- [ ] `src/schemas/` — schema Zod con `validate` y `validatePartial`
- [ ] `src/models/` — modelo con función `format()` que convierte UUIDs
- [ ] `src/controllers/` — valida antes de llamar al modelo
- [ ] `src/routes/` — middlewares de auth correctos
- [ ] `src/app.js` — registrar el router
- [ ] `src/__tests__/` — al menos el caso 401
