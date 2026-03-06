# Prisma en CAIS — Guía para el equipo

## Stack actual

| Componente                | Versión | Descripción                              |
| ------------------------- | ------- | ---------------------------------------- |
| `prisma` (CLI)            | 7.4.2   | Generador del cliente y migraciones      |
| `@prisma/client`          | 7.4.2   | Cliente generado, importado en el código |
| `@prisma/adapter-mariadb` | 7.4.2   | Adapter de conexión para MySQL 8.0       |
| `mariadb` (driver)        | 3.x     | Driver Node.js subyacente                |

Prisma v7 eliminó el engine binario nativo (que causaba problemas de OpenSSL en Alpine ARM64).
Ahora usa un engine JavaScript puro via driver adapters, sin binarios por plataforma.

---

## Arquitectura de conexión

```
app.js
  └── src/config/prisma.js   ← singleton del PrismaClient
        └── PrismaMariaDb (adapter)
              └── mariadb pool → MySQL 8.0 (container db:3306)
```

### `src/config/prisma.js`

```js
import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const url = new URL(process.env.DATABASE_URL)
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  allowPublicKeyRetrieval: true, // requerido para MySQL 8 (caching_sha2_password)
})

export const prisma = new PrismaClient({ adapter })
```

**Importante:** `PrismaMariaDb` recibe un `PoolConfig`, no un pool ya creado.
Internamente crea el pool en `connect()`.

### `prisma.config.js` (solo para CLI)

Este archivo solo lo usa la Prisma CLI (`prisma db pull`, `prisma migrate`, etc.).
El backend en runtime **no lo importa**. Configura el adapter para que el CLI
pueda conectarse sin depender de un `url` en el schema.

---

## Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  // Sin url — la conexión viene del adapter en prisma.config.js (CLI)
  //           y de src/config/prisma.js (runtime)
}
```

**Por qué no hay `url` en el datasource:** Prisma v7 eliminó soporte para `url`
directamente en el schema. La URL se configura en `prisma.config.js` para el CLI
y en el singleton para el runtime.

---

## Cómo usar el cliente en el código

Siempre importa el singleton:

```js
import { prisma } from '../config/prisma.js'
```

Nunca instancies `new PrismaClient()` directamente — genera conexiones extra y
warnings de múltiples instancias.

### Queries básicas

```js
// Buscar uno
const user = await prisma.usuarios.findUnique({ where: { correo: email } })

// Buscar varios con filtros
const users = await prisma.usuarios.findMany({
  where: { estados: { codigo: 'ACTIVO' } },
  include: { roles: true, areas: true },
  orderBy: { creado_at: 'desc' },
  skip: 0,
  take: 10,
})

// Crear
await prisma.usuarios.create({ data: { ... } })

// Actualizar
await prisma.usuarios.update({ where: { id: buffer }, data: { nombre: 'Nuevo' } })

// Borrar
await prisma.usuarios.delete({ where: { id: buffer } })

// Contar
const total = await prisma.usuarios.count({ where })
```

---

## UUIDs con BINARY(16) — convención obligatoria

La DB guarda los UUIDs como `BINARY(16)` para eficiencia. Prisma v7 con el adapter
mariadb devuelve estos campos como `Uint8Array` (no `Buffer`).

### Helpers en `src/lib/uuid.js`

```js
import { uuidToBuffer, bufferToUUID } from '../lib/uuid.js'
```

| Helper               | Uso                                             | Ejemplo                           |
| -------------------- | ----------------------------------------------- | --------------------------------- |
| `uuidToBuffer(uuid)` | String UUID → Buffer para queries Prisma        | `where: { id: uuidToBuffer(id) }` |
| `bufferToUUID(buf)`  | Uint8Array/Buffer → String UUID para respuestas | `id: bufferToUUID(user.id)`       |

### Regla de oro

- **Entrada** (where, data): siempre `uuidToBuffer()`
- **Salida** (respuesta JSON): siempre `bufferToUUID()`

```js
// ✅ Correcto
const user = await prisma.usuarios.findUnique({
  where: { id: uuidToBuffer(req.params.id) },
})
return res.json({ id: bufferToUUID(user.id), nombre: user.nombre })

// ❌ Incorrecto — el id en JSON saldrá como "0,252,80,..." (bytes)
return res.json(user)
```

### Por qué `bufferToUUID` usa `Buffer.from(buf)`

Prisma v7 retorna `Uint8Array`, no `Buffer`. `Uint8Array.toString()` produce
bytes separados por coma (`"0,252,80,..."`). `Buffer.from(buf)` acepta ambos tipos
y permite `.toString('hex')` correctamente.

---

## Transacciones

Usa `prisma.$transaction()` cuando necesites atomicidad entre varias operaciones:

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

**Patrón con `tx` como parámetro** (para reusar modelos dentro de transacciones):

```js
// En el modelo:
static async getById(id, tx = prisma) {
  return tx.usuarios.findUnique({ where: { id: uuidToBuffer(id) } })
}

// En el controlador:
const user = await prisma.$transaction(async (tx) => {
  await tx.usuarios.create({ ... })
  return UserModel.getById(userId, tx)  // misma transacción
})
```

---

## Manejo de errores de Prisma

Prisma lanza errores tipados. Los más comunes:

| Código  | Causa                                   | Respuesta sugerida |
| ------- | --------------------------------------- | ------------------ |
| `P2002` | Unique constraint (correo duplicado)    | 409 Conflict       |
| `P2025` | Registro no encontrado en update/delete | 404 Not Found      |
| `P2003` | Foreign key constraint                  | 400 Bad Request    |

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

**Evita bloques `catch {}` vacíos** — ocultan errores reales. Como mínimo loguea:

```js
} catch (err) {
  console.error('Error en [operación]:', err)
  return null
}
```

---

## Comandos del CLI de Prisma

Ejecutar desde `backend/`:

```bash
# Regenerar el cliente después de cambiar el schema
npx prisma generate

# Sincronizar el schema con la DB (introspección — sobreescribe el schema)
npm run prisma:pull

# Abrir Prisma Studio (UI visual de la DB)
npm run prisma:studio
```

En Docker, el `prisma generate` se ejecuta automáticamente al iniciar el container:

```
sh -c "npm install && npx prisma generate && npm run start"
```

---

## Errores conocidos y soluciones

### `allowPublicKeyRetrieval`

MySQL 8.0 usa `caching_sha2_password` por defecto. El driver mariadb necesita
`allowPublicKeyRetrieval: true` para obtener la clave RSA del servidor en el
primer handshake. Ya está configurado en el singleton.

### `The datasource property url is no longer supported`

Prisma v7 no admite `url` en `schema.prisma`. Si ves este error al hacer
`prisma generate`, verifica que el datasource no tenga la propiedad `url`.

### `output is required for prisma-client generator`

Solo aplica cuando el provider es `prisma-client` (el nuevo generator TypeScript).
Este proyecto usa `prisma-client-js` que genera JavaScript a `node_modules` sin
requerir `output`.

### Pool timeout / ECONNREFUSED

Si el backend no puede conectar a la DB:

1. Verifica que el container `db` esté corriendo: `npm run dc:logs`
2. Verifica que `DATABASE_URL` esté seteado: `echo $DATABASE_URL` dentro del container
3. El formato correcto es `mysql://user:user@db:3306/cais` (host `db`, no `localhost`)

---

## Issues resueltos

Los siguientes problemas fueron detectados en el audit y corregidos:

| Archivo                     | Problema                                                 | Estado       |
| --------------------------- | -------------------------------------------------------- | ------------ |
| `controllers/users.js`      | `registro()` no persistía `cedula` para coordinadores    | ✅ Corregido |
| `controllers/users.js`      | Import roto `TokenModel.js` → ahora `InvitacionModel.js` | ✅ Corregido |
| `controllers/users.js`      | `update()` usaba `JSON.parse()` en errores Zod           | ✅ Corregido |
| `models/UserModel.js`       | `update()` y `delete()` tenían `catch {}` vacío          | ✅ Corregido |
| `models/InvitacionModel.js` | `findByToken()` no incluía el `area_id` del creador      | ✅ Corregido |
| `services/users.js`         | Import roto `TokenModel.js` → ahora `InvitacionModel.js` | ✅ Corregido |

## Issues pendientes (no críticos)

| Archivo               | Problema                                                                   |
| --------------------- | -------------------------------------------------------------------------- |
| `config/auth.js`      | Código muerto de better-auth con queries mysql2 a tablas que ya no existen |
| `config/db.js`        | Pool mysql2 sin uso real tras la migración a Prisma                        |
| `services/users.js`   | URL de registro hardcodeada a `localhost:5173`                             |
| `models/UserModel.js` | `status.split(',')` sin límite de elementos — potencial abuso              |

---

## Qué NO cambiar

- **No instancies `PrismaClient` fuera de `src/config/prisma.js`**
- **No agregues `url` al datasource en el schema** — Prisma v7 no lo soporta
- **No uses `mysql2` para queries nuevas** — todo debe ir por Prisma
- **No uses el pool de `src/config/db.js`** en código nuevo — es legado de better-auth
