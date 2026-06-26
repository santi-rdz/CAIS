# Rutas encadenadas + middlewares

Cambió cómo escribimos routers y dónde validamos.

- Routers: se agrupan por path con `router.route(...)`.
- Validación: es middleware en la ruta. El controller ya no valida.

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
