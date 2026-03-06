# Prisma — Guía para el equipo

Prisma es un ORM para Node.js. En lugar de escribir SQL a mano, se interactúa con la base de datos a través de un cliente JavaScript generado automáticamente a partir del schema. El cliente expone métodos tipados por tabla (`prisma.usuarios`, `prisma.roles`, etc.), y cada método acepta un objeto de opciones en vez de un string SQL.

---

## Configuración mínima

El cliente vive en un singleton. Siempre importa de ahí:

```js
import { prisma } from '../config/prisma.js'
```

Nunca instancies `new PrismaClient()` directamente — genera conexiones extra y
warnings de múltiples instancias.

El schema en `prisma/schema.prisma` describe el datasource y el generator. Prisma lo
lee para generar el cliente (`npx prisma generate`). Cuando la DB cambia, se
resincroniza con `npm run prisma:pull` (introspección).

---

## Queries

Cada tabla del schema se convierte en una propiedad del cliente. Las operaciones
más comunes:

```js
// Buscar un registro por clave única
const user = await prisma.usuarios.findUnique({ where: { correo: email } })

// Buscar el primero que cumpla una condición (no requiere campo único)
const user = await prisma.usuarios.findFirst({ where: { nombre: 'Ana' } })

// Buscar varios
const users = await prisma.usuarios.findMany({ where: { activo: true } })

// Crear
const user = await prisma.usuarios.create({
  data: { nombre: 'Ana', correo: 'a@b.com' },
})

// Actualizar
await prisma.usuarios.update({
  where: { id: buffer },
  data: { nombre: 'Nuevo' },
})

// Borrar
await prisma.usuarios.delete({ where: { id: buffer } })

// Contar
const total = await prisma.usuarios.count({ where: { activo: true } })
```

### Por qué `findUnique` vs `findFirst`

`findUnique` solo acepta campos marcados como `@unique` o `@id` en el schema.
A cambio, Prisma garantiza que el query usa el índice único y retorna exactamente
uno o `null`. Usar `findFirst` en un campo no único funciona pero no da esa garantía
de unicidad — úsalo cuando el campo realmente no es único.

---

## Filtros (`where`)

`where` acepta los campos del modelo y operadores anidados:

```js
// Igualdad directa
where: { activo: true }

// Operadores de comparación
where: { creado_at: { gte: new Date('2024-01-01') } }

// Múltiples condiciones (AND implícito)
where: { activo: true, rol_id: buffer }

// OR explícito
where: {
  OR: [{ nombre: { contains: 'ana' } }, { correo: { contains: 'ana' } }],
}

// Relación — filtra por un campo del modelo relacionado
where: { estados: { codigo: 'ACTIVO' } }
```

### Por qué los filtros de relación se escriben así

Prisma resuelve el JOIN internamente. `where: { estados: { codigo: 'ACTIVO' } }`
equivale a `JOIN estados ON ... WHERE estados.codigo = 'ACTIVO'`. No se necesita
especificar la tabla ni las claves foráneas porque el schema ya las define.

---

## Paginación y orden

```js
const users = await prisma.usuarios.findMany({
  orderBy: { creado_at: 'desc' },
  skip: (page - 1) * limit, // offset
  take: limit, // LIMIT
})
```

`skip` y `take` corresponden directamente a `OFFSET` y `LIMIT` en SQL.

---

## Relaciones — `include` vs `select`

Por defecto Prisma solo retorna los campos escalares de la tabla. Para traer
registros de tablas relacionadas hay dos mecanismos:

**`include`** — agrega la relación completa al resultado:

```js
const user = await prisma.usuarios.findUnique({
  where: { id: buffer },
  include: { roles: true, areas: true },
})
// user.roles → array de objetos del modelo roles
```

**`select`** — especifica exactamente qué campos retornar, incluyendo relaciones:

```js
const user = await prisma.usuarios.findUnique({
  where: { id: buffer },
  select: {
    nombre: true,
    correo: true,
    roles: { select: { nombre: true } }, // solo el nombre del rol
  },
})
```

### Por qué no se puede usar `include` y `select` al mismo tiempo

Ambos controlan la forma del resultado. Mezclarlos sería ambiguo. Si necesitas
filtrar campos y traer relaciones, usa `select` (puede incluir relaciones anidadas).

---

## UUIDs con BINARY(16)

La DB guarda UUIDs como `BINARY(16)` para eficiencia de índices. Prisma retorna esos
campos como `Uint8Array` — no como string. Por eso existen dos helpers:

```js
import { uuidToBuffer, bufferToUUID } from '../lib/uuid.js'
```

| Helper               | Cuándo usarlo                               |
| -------------------- | ------------------------------------------- |
| `uuidToBuffer(uuid)` | Antes de pasar un UUID a `where` o `data`   |
| `bufferToUUID(buf)`  | Al construir la respuesta JSON del endpoint |

```js
// ✅
const user = await prisma.usuarios.findUnique({
  where: { id: uuidToBuffer(req.params.id) },
})
return res.json({ id: bufferToUUID(user.id), nombre: user.nombre })

// ❌ — el id en JSON sale como "0,252,80,..." (bytes del Uint8Array)
return res.json(user)
```

### Por qué `Uint8Array` y no `Buffer`

`Buffer` es una subclase de `Uint8Array` específica de Node.js. Prisma usa
`Uint8Array` para ser agnóstico del entorno. El helper `bufferToUUID` hace
`Buffer.from(buf)` para poder llamar `.toString('hex')`, que `Uint8Array` por sí solo
no soporta de esa forma.

---

## Transacciones

`prisma.$transaction()` garantiza que todas las operaciones dentro del callback se
ejecutan atómicamente — si una falla, todas se revierten:

```js
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.usuarios.create({ data: { ... } })
  await tx.invitaciones_registro.update({
    where: { token: uuidToBuffer(token) },
    data: { usado: true },
  })
  return user
})
```

El parámetro `tx` es un cliente Prisma acotado a esa transacción. Para que los
métodos de los modelos también participen en la transacción, recíbelo como argumento:

```js
// En el modelo:
static async getById(id, tx = prisma) {
  return tx.usuarios.findUnique({ where: { id: uuidToBuffer(id) } })
}

// En el controlador:
await prisma.$transaction(async (tx) => {
  await tx.usuarios.create({ ... })
  return UserModel.getById(userId, tx)  // usa la misma transacción
})
```

---

## Manejo de errores

Prisma lanza errores tipados que se pueden inspeccionar sin parsear mensajes de texto:

```js
import { Prisma } from '@prisma/client'

try {
  await prisma.usuarios.create({ data })
} catch (err) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'El correo ya está registrado' })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
  }
  throw err // re-lanza errores inesperados
}
```

Códigos más comunes:

| Código  | Causa                                   | HTTP sugerido |
| ------- | --------------------------------------- | ------------- |
| `P2002` | Unique constraint (campo duplicado)     | 409           |
| `P2025` | Registro no encontrado en update/delete | 404           |
| `P2003` | Foreign key constraint                  | 400           |

### Por qué `PrismaClientKnownRequestError`

Prisma distingue entre errores que provienen de la DB (conocidos, con código `P20xx`)
y errores de configuración o red (`PrismaClientInitializationError`,
`PrismaClientRustPanicError`, etc.). Solo los errores conocidos tienen `.code`.
El `instanceof` evita tratar un error de conexión como un 409.

Evita bloques `catch {}` vacíos — ocultan errores reales. Como mínimo loguea:

```js
} catch (err) {
  console.error('Error en [operación]:', err)
  return null
}
```

---

## Comandos del CLI

Ejecutar desde `backend/`:

```bash
npx prisma generate    # Regenera el cliente tras cambiar el schema
npm run prisma:pull    # Sincroniza el schema con la DB actual (introspección)
npm run prisma:studio  # Abre UI visual de la DB en el navegador
```
