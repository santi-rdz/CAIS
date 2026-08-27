# 01 · Arquitectura

## El monorepo

CAIS es un monorepo **pnpm** con cuatro workspaces. Cualquier cambio cruza al
menos uno; entender la separación es lo primero.

```
CAIS/
├── shared/      @cais/shared — esquemas Zod y constantes compartidas (sin runtime)
├── backend/     Express 5 + Prisma 7 + MySQL (sesión con cookie)
├── frontend/    React 19 + Vite + Tailwind v4 + TanStack Query
└── database/    SQL crudo que MySQL ejecuta en el primer arranque
```

### Reglas duras

- **No duplicar schemas ni constantes** entre `backend/` y `frontend/`. Si algo lo
  necesitan los dos, vive en `shared/`. Si solo uno, vive en ese workspace.
- **`shared/` no tiene runtime propio.** No importa de `backend/` ni `frontend/`.
  Solo dependencias puras (Zod como peer). Se consume vía `"@cais/shared": "workspace:*"`.
- **JavaScript puro.** Cada workspace tiene `jsconfig.json` con paths para
  autocompletar. No se agrega TypeScript.
- **pnpm** obligatorio (el `preinstall` falla con npm/yarn).

## Qué vive en `shared/`

| Carpeta                                     | Contenido                                                             |
| ------------------------------------------- | --------------------------------------------------------------------- |
| `constants/users.js`                        | `ROLES`, `AREAS`, `ESTADOS`, `ACCIONES`, `ENTIDADES`, sort keys       |
| `constants/pagination.js`                   | `PAGE_SIZE`, `MAX_PAGE_SIZE`, `DEFAULT_PAGE`                          |
| `constants/patients.js`, `emergencies.js`   | Catálogos de dominio (selects, chips)                                 |
| `schemas/fields.js`                         | Validaciones de campo reutilizables (correo, teléfono, fechas, enums) |
| `schemas/*.js`                              | Schemas Zod por dominio (`users`, `password`, `invitations`, `audit`) |
| `schemas/medicina/*`, `schemas/nutricion/*` | Schemas segmentados por área                                          |

Se importan por el `exports` map del paquete, nunca por ruta relativa profunda:

```js
import { ROLES, AREAS } from '@cais/shared/constants/users'
import { validateEmergency } from '@cais/shared/schemas/medicina/emergency'
import { correoSchema } from '@cais/shared/schemas/fields'
```

> Si agregas un sub-namespace nuevo bajo `shared/schemas/`, actualiza
> `shared/package.json#exports` o nada podrá importarlo.

## Cómo viaja una request

```
Navegador (React)
   │  fetch con cookie de sesión (credentials: include)
   ▼
services/apiX.js  ──►  fetchApi()   (serializa body, adjunta cookie, lanza ApiError)
   │
   ▼
Express (backend :8000)
   │  middleware global: CORS · rate limit · JSON · sesión
   ▼
Router  ──►  middleware de ruta (requireAuth / requireRole / requireArea / validate)
   │
   ▼
Controller (static async)   arma la transacción, delega en el Model
   │
   ▼
Model (static async)   habla con Prisma, convierte UUIDs, aplana con formatX()
   │
   ▼
MySQL (:3306, mapeado a :3307 en dev)
```

La respuesta regresa como JSON. Los errores no se atrapan con `try/catch`: se
lanza un `AppError` y un middleware central en `app.js` arma el body de error.
Ver [05 · API del backend](./05-api-backend.md).

## Estructura de carpetas

### backend/

```
backend/src/
├── server.js       arranca app.listen(8000)
├── app.js          middleware global + montaje de routers + error middleware
├── config/         prisma, sessionStore, mailer, env
├── lib/            utilidades sin Express (uuid, dates, appError, paginate, ...)
├── middleware/     auth (requireAuth/Role/Area) + validate (body/params/query)
├── controllers/    clases static; subdirs medicina/ nutricion/
├── models/         clases static (Prisma + formatX); subdirs por área
├── routes/         wire-up router↔controller; subdirs por área
└── services/       lógica multi-paso (ej. UserService.preRegister, icd11)
```

### frontend/

```
frontend/src/
├── App.jsx / main.jsx   router + QueryClient + Toaster
├── pages/               componentes de ruta finos, delegan a features/
├── ui/                  layout global + primitivos (@components/*)
├── features/<dominio>/  lógica + UI por dominio (users, patients, emergencies, ...)
│   ├── components/  hooks/  forms/  pages/  sections/  tabs/
├── hooks/               hooks genéricos (useInfiniteList, useDebounce, ...)
├── schemas/             form-schemas: componen los de @cais/shared
├── lib/                 sin React (fetchApi, ApiError, dateHelpers, permissions)
└── services/            wrappers REST por dominio (apiUsers, apiPatient, ...)
```

## Idioma e identificadores

- Mensajes al usuario y de commit: **español**.
- Columnas de DB: **español** (el schema es en español) → `snake_case`.
- Helpers, funciones y clases: **inglés**.
- `camelCase` variables/funciones · `PascalCase` clases/componentes ·
  `SCREAMING_SNAKE_CASE` constantes · `snake_case` solo columnas de DB.
