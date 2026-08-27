# 03 · Base de datos y Prisma

MySQL 8 con Prisma 7 (adapter `@prisma/adapter-mariadb`). El archivo
`backend/prisma/schema.prisma` es la **fuente de verdad**: se edita a mano y los
cambios se aplican con migraciones.

## Convenciones que debes conocer antes de tocar nada

### 1. IDs como `BINARY(16)` (UUID)

Las tablas usan `BINARY(16)` para los ids, no strings. El conversor vive en
`backend/src/lib/uuid.js`:

```js
uuidToBuffer(str) // 'a1b2...' → Buffer para el WHERE de Prisma
bufferToUUID(buf) // Buffer → 'a1b2...' canónico para el cliente
```

Reglas:

- Todo `where: { id }` necesita `uuidToBuffer(id)`.
- Todo `id` que regresa al cliente necesita `bufferToUUID` (lo hace `formatX`).
- **El frontend solo ve strings UUID canónicos.** Nunca un Buffer.

```js
// en un model
const user = await tx.usuarios.findUnique({ where: { id: uuidToBuffer(id) } })
return { ...user, id: bufferToUUID(user.id) }
```

### 2. Soft-delete

Las **entidades raíz** (usuarios, pacientes, historias médicas, historias de
nutrición, notas de evolución, bitácora de emergencias) no se borran físicamente:
tienen una columna `deleted_at` que se setea al eliminar.

```js
// delete = marcar, no borrar
await tx.pacientes.update({ where: { id: uuidToBuffer(id) }, data: { deleted_at: new Date() } })
```

Implicaciones al leer:

- Todo query de lectura filtra `deleted_at: null`.
- Al agregar ese filtro, `findUnique` deja de servir (solo acepta campos únicos):
  se usa **`findFirst`** con `{ id: uuidToBuffer(id), deleted_at: null }`.
- Para ocultar los hijos de un padre borrado se usa un **relation filter**:
  `historias_pacientes_nutricion: { deleted_at: null }`.

Los **tokens e invitaciones** (efímeros) sí se borran físicamente (hard delete).

### 3. Timestamps de auditoría (en inglés)

Cada entidad raíz lleva tres columnas estándar en inglés:

| Columna      | Tipo                       | Comportamiento                                    |
| ------------ | -------------------------- | ------------------------------------------------- |
| `created_at` | `DateTime @default(now())` | Se setea al crear                                 |
| `updated_at` | `DateTime @updatedAt`      | Prisma lo actualiza solo; **no se asigna a mano** |
| `deleted_at` | `DateTime?`                | Soft-delete                                       |

Como `updated_at` es `@updatedAt`, para "tocar" un registro cuando cambia un hijo
se hace un `updateMany` vacío que respeta el soft-delete:

```js
await tx.pacientes.updateMany({ where: { id: uuidToBuffer(id), deleted_at: null }, data: {} })
```

Los campos de fecha **del dominio** (no del sistema) llevan nombre propio, ej.
`expedida_en` en una historia, `fecha_ingreso`, `fecha_eval`.

### 4. Contrato de fechas (evita el bug del día corrido)

Una columna `@db.Date` representa un **día del calendario**, sin hora. Prisma la
entrega como `Date` de JS en medianoche **UTC**; si se serializa tal cual, el
navegador (en zona horaria negativa) la reinterpreta y **retrocede un día**.

Regla del sistema:

- **Fecha sin hora (`@db.Date`)** viaja como `'YYYY-MM-DD'`. El backend la emite
  con `toDateOnly()` de `#lib/dates.js` en cada `formatX`.
- **Fecha con hora (`@db.DateTime`)** viaja como ISO-8601 completo (un instante
  real, ej. `created_at`, `fecha_hora`).

```js
// backend/src/lib/dates.js
import { toDateOnly, withDateOnly } from '#lib/dates.js'

toDateOnly(row.fecha_nacimiento) // Date → '2000-05-30'
withDateOnly(obj, ['fecha_eval']) // convierte varias claves de golpe
```

El frontend consume estas fechas con `parseDate` / `parseDateTime` de
`@lib/dateHelpers` (ver [07 · Frontend](./07-frontend.md)).

## Creación anidada de relaciones

Si un recurso tiene sub-tablas 1:1 o 1:N propias, deja que Prisma las escriba en
**una sola llamada**. No pre-crees hijos ni cablees FKs a mano. Helpers en
`#lib/prismaHelpers.js` (`nestedCreate`, `nestedUpsert`, `manyCreate`,
`manyReplace`, `buildNestedRelations`, `toUUID`).

- **La hija siempre guarda el id del padre** (`padre_id` en la hija), nunca al revés.
- **Delete = delete plano del padre**; las hijas caen por `ON DELETE CASCADE`.
- **No dupliques referencias derivables.** En nutrición todo cuelga de la
  historia (`historia_paciente_id`); el `paciente_id` se resuelve desde la
  historia dentro de `formatX`, no se guarda ni se recibe en el body.

## Flujo de migraciones

El schema es la fuente de verdad. Tras editarlo:

```bash
pnpm run prisma:migrate      # migrate dev — genera el SQL, lo aplica y regenera el cliente
```

Commitea **`schema.prisma` + el archivo generado** en `prisma/migrations/`.

| Comando                            | Cuándo                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `prisma:migrate` (`migrate dev`)   | Al **crear** una migración tras editar el schema (dev)                       |
| `prisma:deploy` (`migrate deploy`) | Al **aplicar** migraciones pendientes sin borrar datos (ej. tras `git pull`) |
| `db:fresh`                         | Reset total de la DB de dev (borra datos, recrea, migra, siembra)            |

> `migrate reset` está bloqueado por un guard que exige consentimiento explícito.
> Para actualizar tu DB conservando datos, usa `prisma:deploy` (o simplemente
> `pnpm run dev`, que lo corre al arrancar).

## DTOs vs Prisma vs wire format

No hay capa explícita de DTOs. El "wire format" (lo que ve el cliente) se
construye en los models con funciones `formatX(row)` que aplanan relaciones y
convierten los `Bytes` UUID a string.

> Si cambias un `select`/`include`, **actualiza el `formatX` del mismo model y
> revisa el frontend que consume ese endpoint** — no hay tipos que avisen del
> rompimiento.
