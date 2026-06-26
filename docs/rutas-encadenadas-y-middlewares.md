# Rutas encadenadas + middlewares

Cambió cómo escribimos routers y dónde validamos.

- Routers: se agrupan por path con `router.route(...)`.
- Validación: es middleware en la ruta. El controller ya no valida.
- Errores: el controller ya no usa `try/catch`. Lanza (o deja propagar) y el
  error middleware de `app.js` responde.

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

## 4. Errores: sin `try/catch`

Express 5 reenvía solo cualquier throw/rejection de un handler async al error
middleware de `app.js`. Así que el controller no atrapa nada: hace lo suyo y, si
algo falla, deja que suba.

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

- **404/403** siguen igual: son flujo normal (`if (!x) return res.status(404)...`), no errores.
- **Status específico** (409, etc.): se **lanza** un `HttpError` desde el model/service
  y el middleware lo traduce. No armes el `res.status(...)` en un `catch`.

  ```js
  throw new HttpError(409, 'El correo ya está registrado', { error: 'Conflict' })
  ```

- La **atomicidad no depende del `try/catch`**: `prisma.$transaction` hace rollback solo
  cuando el callback lanza, y re-lanza el error hacia el middleware.
- Excepción: `auth.js` sí usa `try/catch` (APIs de sesión por callback + anti-enumeración).

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

- `POST /auth/login` (validación manual).
- `POST /usuarios/registro` (el schema depende del rol de la invitación, runtime).
- Checks de un campo sin schema (`if (!correo)`).
- Reglas extra de negocio post-`validate` (ej. `nutritionalEval` rechaza un PATCH
  con body vacío con 422).
