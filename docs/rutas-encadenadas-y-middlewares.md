# Rutas encadenadas + middlewares

Cambió cómo escribimos routers y dónde validamos.

- Routers: se agrupan por path con `router.route(...)`.
- Validación: es middleware en la ruta. El controller ya no valida.
- Errores: controllers **y models** ya no usan `try/catch`. Se lanza un
  `AppError` (o se deja propagar) y el error middleware de `app.js` responde.

---

## 1. Encadenar por path

```js
// ❌ antes
router.get('/', C.getAll)
router.post('/', C.create)
router.get('/:id', C.getById)
router.patch('/:id', C.update)
router.delete('/:id', C.delete)

// ✅ ahora
router.route('/').get(C.getAll).post(C.create)
router.route('/:id').get(C.getById).patch(C.update).delete(C.delete)
```

## 2. `validate(schema)` — body (POST y PATCH)

Valida el body; si falla responde `422`, si pasa deja `req.body` ya parseado.

```js
import { validate } from '#middleware/validate.js'

router.route('/').post(validate(validateEmergency), C.create)
router.route('/:id').patch(validate(validatePartialEmergency), C.update)
```

`validateX` para crear · `validatePartialX` para actualizar.

El controller usa `req.body` directo, sin revalidar:

```js
// ❌ antes: bloque validateX + if (result.error) { 422 } ... result.data
// ✅ ahora:
static async create(req, res) {
  await EmergencyModel.create(req.body, ...)
}
```

## 3. `validate...Param()` — el `:id`

`.all(...)` lo cubre para GET, PATCH y DELETE.

```js
import { validateUuidParam, validateIntParam } from '#middleware/validate.js'

router.route('/:id').all(validateUuidParam()) // id UUID
router.route('/:id').all(validateIntParam()) //  id entero
```

¿Cuál? El `where` del modelo: `uuidToBuffer(id)` → UUID · `Number(id)` → entero.
El controller ya no valida el id.

## 4. Errores: sin `try/catch`, con `AppError`

Express 5 reenvía solo cualquier throw/rejection de un handler async al error
middleware de `app.js`. Así que ni el controller ni el model atrapan nada: hacen
lo suyo y, si algo falla, lanzan un `AppError` que el middleware traduce.

```js
// ❌ antes
static async create(req, res) {
  try {
    const x = await Model.create(req.body)
    res.status(201).json(x)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'InternalError' })
  }
}

// ✅ ahora
static async create(req, res) {
  const x = await Model.create(req.body)
  res.status(201).json(x)
}
```

### El model es la única fuente del 404

Ya no hay `if (!x) return res.status(404)` en el controller ni
`catch (P2025) → return null` en el model. El model hace un guard y lanza:

```js
// model
static async update(id, data, tx = prisma) {
  const existing = await tx.pacientes.findUnique({ where: { id: uuidToBuffer(id) } })
  if (!existing) throw new NotFoundError('el paciente') // → 404 "No se encontró el paciente"
  await tx.pacientes.update({ where: { id: uuidToBuffer(id) }, data })
  return this.getById(id, tx)
}

// controller: asume que existe
static async update(req, res) {
  res.json(await PatientModel.update(req.params.id, req.body))
}
```

### `AppError` (`#lib/appError.js`)

Subclases operacionales con su status: `BadRequestError` (400),
`UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404),
`ConflictError` (409), `ValidationError` (422). El `NotFoundError` recibe el
recurso **con artículo** (`'la emergencia'`) para que el género quede bien.

```js
throw new ConflictError('El correo ya está registrado') // → 409
throw new ConflictError('...', { emails }) // meta se mergea al body
```

- **Códigos Prisma** que se escapan de un guard (carreras) los traduce
  `#lib/prismaError.js` como red de seguridad (`P2002→409`, `P2025→404`,
  `P2003→409`). No armes el `res.status(...)` a mano.
- La **atomicidad no depende del `try/catch`**: `prisma.$transaction` hace rollback
  solo cuando el callback lanza, y re-lanza el error hacia el middleware.
- **`express-session`** usa callbacks; sus errores no se propagan solos. `auth.js`
  usa `regenerateSession`/`destroySession` de `#lib/session.js` (promisificados y
  `await`-eados) — sin `try/catch`.

---

## Router completo

```js
emergencyRouter.use(requireAuth)

emergencyRouter.route('/').get(C.getAll).post(validate(validateEmergency), C.create)

emergencyRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(C.getById)
  .patch(validate(validatePartialEmergency), C.update)
  .delete(C.delete)
```

Orden: `permiso → validate → controller`.

## Excepciones (validan en el controller)

- `POST /usuarios/registro` (el schema depende del rol de la invitación, runtime).
- Validación de query params sin schema (ej. `fields` en los listados de nutrición).
- Reglas extra de negocio post-`validate` (ej. `nutritionalEval` rechaza un PATCH
  con body vacío con 422).

`POST /auth/login` **ya no** es excepción: valida con `validate(validateLogin)`
(`shared/schemas/auth.js`) como el resto.
