# 02 · Entorno local

## Requisitos

| Herramienta             | Versión           | Nota                                         |
| ----------------------- | ----------------- | -------------------------------------------- |
| Node.js                 | LTS reciente      | Corre backend y frontend en el host          |
| pnpm                    | 11.5.1 (Corepack) | Obligatorio; `preinstall` falla con npm/yarn |
| Docker + Docker Compose | reciente          | Solo para la base de datos MySQL en dev      |

El flujo de desarrollo recomendado corre **backend y frontend nativos en tu
máquina** y **solo MySQL en Docker**. Producción sí usa Docker completo.

## Setup (primera vez)

```bash
pnpm run setup
```

Ese comando hace, en orden: `pnpm install` → levanta la DB en Docker → espera a
que esté lista → genera el cliente Prisma → aplica las migraciones
(`migrate deploy`) → siembra datos de prueba.

## Día a día

```bash
pnpm run dev          # levanta la DB (Docker) y corre backend + frontend en paralelo
```

- El backend arranca en watch y **aplica migraciones pendientes al iniciar**
  (`prisma generate && prisma migrate deploy`), así que no tienes que hacerlo a mano.
- Al actualizar `main`, corre `pnpm install` (por deps nuevas) y `pnpm run dev`:
  las migraciones se aplican solas.

## Puertos

| Servicio                           | Puerto |
| ---------------------------------- | ------ |
| Frontend (Vite)                    | `5173` |
| Backend (Express)                  | `8000` |
| MySQL (dev, mapea al 3306 interno) | `3307` |

El `BASE_URL` del frontend está hardcodeado a `http://localhost:8000` en
`frontend/src/lib/constants.js`.

## Comandos raíz

```bash
# Desarrollo
pnpm run dev          # DB + backend + frontend (host nativo)
pnpm run setup        # instalación y seed inicial

# Base de datos (dev, Docker)
pnpm run db:up        # levanta el contenedor de MySQL
pnpm run db:down      # baja el contenedor (conserva datos)
pnpm run db:fresh     # borra volumen + recrea + migra + siembra (RESET TOTAL)
pnpm run db:logs      # logs de MySQL
pnpm run db:sql       # consola MySQL (usuario: user / pwd: user)

# Prisma
pnpm run prisma:migrate    # migrate dev — crea una migración tras editar el schema
pnpm run prisma:deploy     # migrate deploy — aplica migraciones pendientes (sin borrar datos)
pnpm run prisma:generate   # regenera el cliente
pnpm run prisma:studio     # GUI de la DB
pnpm run seed              # re-siembra

# Calidad
pnpm run check        # eslint + prettier --check (todo el monorepo)
pnpm run format       # prettier --write

# Tests (backend)
pnpm run test         # suite completa (Jest + supertest)

# Producción (Docker completo)
pnpm run restart      # up --build
pnpm run up / down    # levantar / bajar
pnpm run fresh        # down -v + rebuild (reset total)
pnpm run logs
```

Para un archivo puntual: `pnpm exec eslint <ruta>`.

## Variables de entorno

Backend, en `.env` de la raíz (ver `.env.example`):

| Variable         | Uso                                                   |
| ---------------- | ----------------------------------------------------- |
| `DATABASE_URL`   | Cadena de conexión MySQL                              |
| `SESSION_SECRET` | Firma de la cookie de sesión                          |
| `FRONTEND_URL`   | Origen permitido por CORS y base para links de correo |
| `EMAIL_*`        | SMTP para invitaciones y reset de contraseña          |

## Errores comunes al levantar

- **Puerto 8000 ocupado por otro proyecto** → la app puede responder 404
  "foráneos". Verifica con `docker ps` que ningún otro contenedor tome el 8000.
- **Error de columnas/tipos al migrar** con datos viejos incompatibles →
  `pnpm run db:fresh` (borra datos de dev y recrea desde cero).
