# 05 · API del backend

## Anatomía de un endpoint

Cada recurso se implementa en cuatro capas finas. No mezcles responsabilidades.

```
routes/       cablea path + middleware. Archivo flaco, sin lógica.
   │
controllers/  clase static. Arma la transacción + auditoría. NO valida, NO usa try/catch.
   │
models/       clase static. Habla con Prisma, convierte UUIDs, aplana con formatX().
   │
lib/          utilidades puras (uuid, dates, appError, paginate, queryFeatures).
```

### Route

```js
router.use(requireAuth)
router.route('/').get(C.getAll).post(validate(validateX), C.create)
router
  .route('/:id')
  .all(validateUuidParam())
  .get(C.getById)
  .patch(validate(validatePartialX), C.update)
  .delete(C.delete)
```

### Controller

```js
export class XController {
  static async create(req, res) {
    const created = await prisma.$transaction(async (tx) => {
      const item = await XModel.create(req.body, tx)
      await AuditModel.create(
        {
          usuario_id: req.session.userId,
          accion: ACCIONES.CREAR,
          entidad: ENTIDADES.X,
          objetivo_id: item.id,
          paciente_id: item.paciente_id,
        },
        tx
      )
      return item
    })
    res.status(201).json({ message: 'X creada', x: created })
  }

  static async getById(req, res) {
    res.json(await XModel.getById(req.params.id)) // el model lanza NotFoundError si no existe
  }
}
```

Reglas del controller:

- **Sin `try/catch` y sin validar el body** (Express 5 propaga los async errors;
  la validación es middleware). `req.body` ya llega parseado por Zod.
- **No chequea "no encontrado"** — el guard del model lanza `NotFoundError`.
- **No arma `res.status` de error a mano** — lanza `AppError`.
- Mutación + auditoría en **un solo `$transaction`**.
- Datos **derivables** (ej. `paciente_id`) se toman del resultado del model, no del body.

### Model y `formatX`

El model es capa fina sobre Prisma: convierte UUID↔Buffer, arma `include/select`,
y expone `formatX(row)` que aplana relaciones al shape que espera el frontend.

```js
function formatUser(u) {
  if (!u) return null
  const { estados, roles, ...rest } = u
  return { ...rest, id: bufferToUUID(u.id), estado: estados?.codigo, rol: roles?.codigo }
}

static async getById(id, tx = prisma) {
  const user = await tx.usuarios.findFirst({
    where: { id: uuidToBuffer(id), deleted_at: null },
    include: includeRelations,
  })
  if (!user) throw new NotFoundError('el usuario')   // única fuente del 404
  return formatUser(user)
}
```

- El model es la **única fuente del 404**: `getById/update/delete` hacen el guard.
- Conflictos de unicidad: pre-chequea y lanza `ConflictError`.
- Si cambias `include/select`, actualiza `formatX` y revisa el frontend.

## Formato de respuesta (wire format)

- **Un recurso** se devuelve como objeto plano, con `id` en UUID string y las
  relaciones aplanadas por `formatX`.
- **Fechas**: `@db.Date` como `'YYYY-MM-DD'`; `@db.DateTime` como ISO completo
  (ver [03 · Base de datos](./03-base-de-datos-y-prisma.md)).
- **Creación**: `201 { message, <recurso>: {...} }`.
- **Actualización**: `200 { ... }` con el recurso actualizado (o `{ message }`).
- **Borrado**: `200 { message }`.
- **Listado paginado**: `{ <recurso>: [...], count }` — el cliente calcula las páginas.

```jsonc
// GET /usuarios?page=1
{ "users": [{ "id": "…", "nombre": "…", "rol": "PASANTE" }], "count": 42 }
```

## Errores

Nadie atrapa nada. Se lanza un `AppError` (o se deja propagar) y el middleware
central de `app.js` arma el body. Subclases en `#lib/appError.js`:

| Clase                          | Status | `error` en el body |
| ------------------------------ | ------ | ------------------ |
| `BadRequestError`              | 400    | `BadRequest`       |
| `UnauthorizedError`            | 401    | `Unauthorized`     |
| `ForbiddenError`               | 403    | `Forbidden`        |
| `NotFoundError('el paciente')` | 404    | `NotFound`         |
| `ConflictError`                | 409    | `Conflict`         |
| `ValidationError`              | 422    | `ValidationError`  |
| `BadGatewayError`              | 502    | `BadGateway`       |

Body de error estándar:

```jsonc
{ "error": "Conflict", "message": "El correo ya está registrado" }
```

Casos especiales:

- **Validación (422)** la produce el middleware `validate`, con la lista de campos:
  ```jsonc
  {
    "error": "ValidationError",
    "message": "Datos inválidos",
    "fields": [{ "field": "correo", "message": "Correo inválido" }],
  }
  ```
- **`meta`** se mergea al body: `throw new ConflictError('...', { emails })`.
- **Errores de Prisma** que se escapan de un guard los traduce
  `#lib/prismaError.js` (`P2002→409`, `P2025→404`, `P2003→409`).
- Todo lo demás cae al **500** genérico (única rama que loguea).

## Validación de entrada (middleware)

En `#middleware/validate.js`:

| Helper                         | Valida                                           | Deja el resultado en                                   |
| ------------------------------ | ------------------------------------------------ | ------------------------------------------------------ |
| `validate(fn)`                 | `req.body`                                       | `req.body` (reemplazado por el dato parseado)          |
| `validateQuery(fn)`            | `req.query`                                      | `req.validatedQuery` (query es read-only en Express 5) |
| `validateUuidParam(name='id')` | `req.params[name]` es UUID                       | —                                                      |
| `validateUuidQuery(name)`      | query param UUID obligatorio (scope de listados) | —                                                      |

Las funciones `validateX` (y `validatePartialX` para updates parciales) las
exporta cada schema de `@cais/shared/schemas/*` como wrapper de `safeParse`. El
frontend reutiliza esos mismos schemas (ver [07 · Frontend](./07-frontend.md)).

## Paginación, búsqueda y orden

- `parsePagination(req.query)` (`#lib/paginate.js`) → `{ page, limit }` con
  `limit` clampeado a `MAX_PAGE_SIZE` (20). Default `PAGE_SIZE` = 10.
- Helpers reutilizables en `#lib/queryFeatures.js`:
  - `buildListArgs({ page, limit, orderBy, select })` → `{ skip, take, orderBy, select }`.
  - `buildSearchWhere(search, fields)` → filtro tokenizado (cada palabra debe
    aparecer en algún campo): `{ AND: tokens.map(t => ({ OR: fields.map(f => ({ [f]: { contains: t } })) })) }`.
- Campos de búsqueda por dominio en `#lib/searchFields.js`.
- Orden: definiciones en `shared/constants/*` (`[{ key, field, dir }]`) →
  `formatDefs()` → `SORT_OPTIONS[sortBy] ?? default`.

```js
static async getAll({ search, page, limit, areaId }) {
  const where = {
    deleted_at: null,
    ...(areaId != null && { pacientes_areas: { some: { area_id: areaId } } }),
    ...buildSearchWhere(search, PATIENT_SEARCH_FIELDS),
  }
  const [rows, count] = await prisma.$transaction([
    prisma.pacientes.findMany({ where, include, ...buildListArgs({ page, limit, orderBy }) }),
    prisma.pacientes.count({ where }),
  ])
  return { patients: rows.map(formatPatient), count }
}
```

## Auditoría

Cada `CREAR` / `ACTUALIZAR` / `ELIMINAR` de una entidad de dominio (y el
`INICIAR_SESION`) se registra con `AuditModel.create({ usuario_id, accion,
entidad, objetivo_id, paciente_id? }, tx)` **dentro del mismo `$transaction`**
que la mutación. Las claves están en `shared/constants/users.js`
(`ACCIONES`, `ENTIDADES`).

## Anti-patterns

- `try/catch` en controller/model — lanza `AppError`, responde el middleware.
- `if (!x) return res.status(404)` en el controller — ya lo lanza el model.
- Validar el body en el controller — usa `validate(validateX)` en la ruta.
- `findUnique({ where: { id } })` sin `uuidToBuffer(id)`, o devolver un Buffer al cliente.
- Mutación + audit en `await` separados — un solo `$transaction`.
- Definir o importar Zod en el backend — los schemas viven en `shared/`.
