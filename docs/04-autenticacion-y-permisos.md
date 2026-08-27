# 04 · Autenticación y permisos

## Sesión con cookie (no JWT)

La autenticación usa `express-session` con un store propio sobre Prisma
(`PrismaSessionStore`). Al hacer login se emite una cookie `connect.sid`
`httpOnly`. El frontend la manda automáticamente (`fetchApi` usa
`credentials: 'include'`).

Configuración de la cookie (`app.js`):

| Opción     | Valor                               |
| ---------- | ----------------------------------- |
| `httpOnly` | `true`                              |
| `secure`   | solo en producción                  |
| `sameSite` | `lax`                               |
| `maxAge`   | 8 horas                             |
| `rolling`  | `true` (se renueva en cada request) |

Contenido de `req.session` tras login:

```js
req.session.userId // UUID string
req.session.role // 'ADMIN' | 'COORDINADOR' | 'PASANTE'
req.session.areaId // int | null
req.session.area // 'MEDICINA' | 'NUTRICION' | null
```

## Login y logout

```
POST /auth/login   { email, password }
```

1. Busca el usuario por correo. Si no existe o la contraseña (bcrypt) no coincide
   → `401` con mensaje único `"Correo o contraseña inválidos"` (evita enumerar cuentas).
2. Si la cuenta no está `ACTIVO` → `403 "Cuenta desactivada"`.
3. **Regenera la sesión** (`regenerateSession`, anti session-fixation) y la
   repuebla con `userId/role/areaId/area`.
4. Registra `INICIAR_SESION` en auditoría. Responde `{ ok: true }`.

- `GET /auth/me` → datos del usuario de la sesión.
- `POST /auth/logout` → `destroySession` + `clearCookie`.

> `express-session` usa callbacks, no promesas. Usa siempre
> `regenerateSession` / `destroySession` de `#lib/session.js` (están
> `await`-eados) para que sus errores lleguen al middleware.

## Roles, áreas y estados

```js
ROLES = { PASANTE, COORDINADOR, ADMIN }
AREAS = { MEDICINA, NUTRICION }
ESTADOS = { ACTIVO, INACTIVO, PENDIENTE }
```

- **Pasantes y coordinadores** quedan acotados a su `area_id`. **Admin ve todo**
  y no tiene área.
- Jerarquía de roles (`ROLE_RANK`): solo se puede **desactivar o eliminar**
  cuentas de rango **menor** al propio. No puedes gestionarte a ti mismo ni a
  alguien de rango igual o superior. La regla vive en `#lib/userAccess.js`
  (`canManageUserAccount`).

## Middleware de autorización

En `backend/src/middleware/auth.js`:

| Middleware              | Efecto                                | Falla con |
| ----------------------- | ------------------------------------- | --------- |
| `requireAuth`           | Exige sesión activa                   | `401`     |
| `requireRole(...roles)` | Exige uno de los roles                | `403`     |
| `requireArea(...areas)` | Exige el área; **admin siempre pasa** | `403`     |

Orden en una ruta: **permiso → validación → controller**.

```js
router.use(requireAuth)
router.route('/').get(privileged, C.getAll).post(privileged, validate(validateX), C.create)
```

Los routers de área ya montan el guard de área:

```js
// routes/medicine.js
medicineRouter.use(requireAuth)
medicineRouter.use(requireArea(AREAS.MEDICINA)) // admin pasa; pasante/coord de nutrición no
```

## Registro por invitación

No hay registro abierto. El flujo es:

```
1. Un COORDINADOR o ADMIN emite una invitación
      → crea `invitaciones_registro` con token UUID + correo + rol
      → se envía un correo con el link

2. El invitado completa su registro
      POST /usuarios/registro   { token, nombre, correo, password, ... }
      → se valida el token (no usado, no expirado)
      → el schema de validación depende del rol de la invitación (resuelto en runtime)
      → se crea el usuario con contraseña bcrypt
```

`POST /usuarios/registro` es **pública** (va antes de `requireAuth` en el router).

## Permisos en el frontend

La UI no compara roles inline. Todo pasa por tres piezas (ver
[07 · Frontend](./07-frontend.md)):

- `@lib/permissions.js` — reglas puras (`PERMISSIONS`, `can`, `canSeeRoute`).
- `@hooks/usePermissions.js` — hook React (`isAdmin`, `isMedicina`, `area`, `can`, ...).
- `@components/Can.jsx` — componente declarativo para bloques condicionales.
