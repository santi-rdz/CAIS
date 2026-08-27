# 07 · Frontend

React 19 + Vite + Tailwind v4 + TanStack Query v5. React Router v7. Formularios
con `react-hook-form` + `zod`. Toasts con `sonner`. Íconos `react-icons/hi2`.

> **Desktop-first.** El layout base es de escritorio; las variantes chicas se
> escriben con `max-sm:` / `max-md:` / `max-lg:`. Nunca `sm:`/`md:`/`lg:` para
> escalar desde móvil.

## Aliases de import

Siempre absolutos con alias, incluso dentro del mismo folder. Nada de `./X` ni `../X`.

```
@ui/*  @components/*  @features/*  @pages/*  @hooks/*
@schemas/*  @lib/*  @services/*  @assets/*  @cais/shared/*
```

## Capa REST · `services/`

Wrappers finos sobre `fetchApi` (en `@lib/`), siempre en **camelCase**
(`apiUsers.js`, `apiPatient.js`).

```js
import { fetchApi } from '@lib/fetchApi'

export async function getUsers({ status, search, page }) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (search) params.append('search', search)
  if (page) params.append('page', page)
  const query = params.toString() ? `?${params}` : ''
  return fetchApi(`/usuarios${query}`, { errorMsg: 'Error al obtener los usuarios' })
}

export async function createUser(data) {
  return fetchApi('/usuarios', { method: 'POST', body: data, errorMsg: 'Error al crear usuario' })
}
```

`fetchApi` ya: adjunta la cookie (`credentials: 'include'`), serializa el body a
JSON, pone `Content-Type`, y **lanza `ApiError`** con `{ message, fields }`
extraídos del backend. No parsees errores a mano; propaga y usa
`toastApiError(error)` en el caller (ya lista los `fields` como bullets).

## Server state · TanStack Query

`staleTime: 5min`, `gcTime: 10min` (en `main.jsx`). Nunca uses `useEffect` +
`fetch` para pedir datos.

- **Query keys consistentes**: `['users']`, `['user', id]`, `['patients']`, ...
  Con filtros, inclúyelos en la key: `['users', status, rol, search, page]`.
- **Mutaciones invalidan o setean cache**:

```js
const { mutate } = useMutation({
  mutationFn: (data) => apiCreateUser(data),
  onSuccess: () => {
    toast.success('Usuario creado exitosamente')
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
  onError: toastApiError,
})
```

- **Paginación infinita** con piezas reutilizables: `useInfiniteList` (hook),
  `LoadMore` (componente "Cargar más" / scroll infinito), `useDebounce`.
- Ya hay >30 hooks en `features/<dominio>/hooks/`. Revisa antes de crear uno.

## Formularios · dos capas de schema

1. **`@cais/shared/schemas/*`** — la validación real del backend. **Nunca** la
   dupliques ni redefinas en el frontend.
2. **`@schemas/*`** (`frontend/src/schemas/`) — _form-schemas_ que componen los
   de shared y los adaptan al shape del form: campos `dayjs` en vez de ISO,
   `refine` de "confirmar contraseña", `omit` de campos que el form no captura, etc.

```js
// frontend/src/schemas/medicalPatient.js
import { z } from 'zod'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import { dayjsDateSchema } from '@cais/shared/schemas/fields'

export const medicalPatientFormSchema = z.object({
  ...patientSchema.shape,
  fecha_nacimiento: dayjsDateSchema,
})
```

Reglas:

- Nunca declares `z.object(...)` ni importes `zod` dentro de un componente/hook.
  Si el schema depende de algo runtime, exporta una _factory_ desde `@schemas/`.
- Formularios multi-paso: usa `useStepForm` (`@hooks/`). Ver
  `features/patients/medicina/forms/MedicalPatientForm/`.
- Errores de campo del backend (`error.fields`) se mapean con `setError(field, { message })`.

## Fechas en el frontend

El backend ya distingue el tipo por el formato (ver
[03 · Base de datos](./03-base-de-datos-y-prisma.md)). En `@lib/dateHelpers`:

| Helper                                             | Para                                                                  |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| `parseDate(value)`                                 | Cargar una **fecha-sola** (`'YYYY-MM-DD'`) en un dayjs (date pickers) |
| `parseDateTime(value)`                             | Cargar una **fecha con hora** (ISO) en un dayjs                       |
| `formatFecha`, `formatFechaLong`, `formatRelativo` | Mostrar fechas-sola                                                   |
| `formatHora`, `formatFechaHora`                    | Mostrar datetimes                                                     |

Como las fechas-sola llegan como `'YYYY-MM-DD'`, `dayjs(value)` las lee como día
local sin desfase. Usa siempre estos helpers en vez de `dayjs()` crudo.

## Permisos de UI

Tres piezas; nunca compares `user.rol` / `user.area` inline en un componente.

- **`@lib/permissions.js`** — reglas puras. `PERMISSIONS` (enum), `can(user, perm)`,
  `canSeeRoute(user, route)`. Para agregar un permiso: añade la clave y su regla en `RULES`.
- **`@hooks/usePermissions.js`** — hook React:
  ```js
  const { can, isAdmin, isCoordinador, isPasante, isMedicina, isNutricion, area, user } =
    usePermissions()
  ```
  `area` viene normalizado en mayúsculas (matchea `AREAS`). Úsalo como llave de
  dispatch cuando hay un mapa por área.
- **`@components/Can.jsx`** — para JSX condicional:
  ```jsx
  <Can permission={PERMISSIONS.SEE_USER_AREA_COLUMN}>...</Can>
  ```

## Componentes y toasts

- Primitivos reutilizables en `@components/` (Button, Input, Modal, Table, Tag,
  FormRow, Stepper, EmptyState, ...). Reutiliza antes de crear.
- Variantes con `cva` + helper `cn`. Modales con API composable
  (`<Modal>` + `<Modal.Open>` + `<Modal.Content>`).
- Toasts: `sonner`. Para errores de API, `toastApiError(error)` de `@lib/ApiError`.
