# Autenticación con express-session — Guía para el equipo

## ¿Qué es express-session?

`express-session` es un middleware de Node.js que añade gestión de sesiones a
Express. Cuando un usuario hace login, el servidor crea una **sesión** — un objeto
que vive en la base de datos y que identifica a ese usuario en requests futuros.
El navegador recibe una **cookie httpOnly** con el ID de esa sesión. En cada
request siguiente, el navegador envía la cookie automáticamente y el servidor
la usa para recuperar los datos de la sesión.

---

## JWT vs cookie-session — por qué elegimos sesiones

Esta es la pregunta más común. Ambas funcionan, pero para un sistema interno como
CAIS las sesiones en DB son la mejor opción:

| | Cookie-session | JWT en localStorage |
|---|---|---|
| **Revocación** | Inmediata — borra la fila | Imposible hasta que expira |
| **Forzar logout** | Sí — eliminas la sesión | No |
| **Almacenamiento** | Cookie httpOnly (invisible para JS) | localStorage (vulnerable a XSS) |
| **Tamaño del payload** | Solo el session ID | Todo el token decodificable |
| **DB hit por request** | 1 SELECT a `sessions` | Ninguno |
| **Adecuado para sistema interno** | ✅ | ❌ |

El costo del SELECT extra por request es insignificante con pocos usuarios. A cambio
obtienes control total: si un usuario debe ser bloqueado, borras su fila de
`sessions` y queda desconectado en el siguiente request.

**JWT sí tiene sentido** en sistemas distribuidos o APIs públicas donde el servidor
no puede mantener estado. Para CAIS, no aplica.

---

## Cómo funciona en CAIS

### Flujo de login

```
1. POST /auth/login  { email, password }
2. Backend valida credenciales con bcrypt
3. req.session.regenerate() → nuevo session ID (previene session fixation)
4. Se guardan req.session.userId y req.session.role
5. express-session persiste la sesión en la tabla `sessions` (via PrismaSessionStore)
6. El navegador recibe: Set-Cookie: connect.sid=<token>; HttpOnly; SameSite=Lax
7. Respuesta: { ok: true }
```

### Flujo de request autenticado

```
1. GET /auth/me  (con cookie automática del navegador)
2. express-session lee la cookie, busca el sid en la tabla sessions
3. Si existe y no expiró → req.session = { userId, role, cookie }
4. requireAuth verifica req.session.userId → pasa al controlador
5. Controlador usa req.session.userId para consultar el usuario
```

### Flujo de logout

```
1. POST /auth/logout
2. req.session.destroy() → DELETE sessions WHERE sid = ?
3. res.clearCookie('connect.sid') → borra la cookie del navegador
```

---

## Estructura en el código

### Tabla `sessions` (DB)

```
sid     VARCHAR(255)  PK  — ID de sesión (generado por express-session)
data    TEXT              — Objeto de sesión serializado como JSON
expire  DATETIME(3)       — Cuándo expira (8 horas desde el login)
```

### `src/config/sessionStore.js`

Implementa la interfaz `Store` de express-session sobre Prisma. Tiene 4 métodos:

| Método | Cuándo se llama | Qué hace |
|---|---|---|
| `get(sid)` | Cada request con cookie | SELECT para recuperar la sesión |
| `set(sid, session)` | Al crear o modificar sesión | UPSERT en la tabla sessions |
| `destroy(sid)` | En logout | DELETE de la sesión |
| `touch(sid, session)` | Para extender la expiración | UPDATE del campo expire |

### `src/middleware/auth.js`

Dos middlewares que se usan en las rutas:

```js
// Rechaza con 401 si no hay sesión activa
requireAuth

// Rechaza con 403 si el rol del usuario no está en la lista
requireRole('COORDINADOR', 'ADMIN')
```

### `src/app.js`

```js
app.use(session({
  secret: process.env.SESSION_SECRET,  // firma la cookie
  resave: false,           // no re-guarda si no hubo cambios
  saveUninitialized: false, // no crea sesión hasta que se escriba algo
  cookie: {
    httpOnly: true,   // JS del navegador no puede leer la cookie
    secure: false,    // true en producción (requiere HTTPS)
    maxAge: 8h,       // expira en una jornada laboral
    sameSite: 'lax',  // protección básica contra CSRF
  },
  store: new PrismaSessionStore(),
}))
```

**Por qué `saveUninitialized: false`:** evita crear una fila en `sessions` por cada
visitante anónimo. Solo se crea sesión cuando el usuario hace login.

**Por qué `resave: false`:** evita re-guardar la sesión en cada request si no hubo
cambios. Mejora el rendimiento y evita race conditions.

---

## Protección de rutas

Las rutas se organizan en tres niveles:

```js
// Pública — sin sesión requerida
router.post('/registro', UserController.registro)
router.get('/:token', InvitationController.validateToken)

// Autenticado — cualquier usuario con sesión
router.use(requireAuth)          // aplica a todas las rutas definidas después
router.get('/:id', UserController.getById)
router.patch('/:id', UserController.update)

// Privilegiado — solo COORDINADOR o ADMIN
const privileged = requireRole('COORDINADOR', 'ADMIN')
router.get('/', privileged, UserController.getAll)
router.post('/', privileged, UserController.create)
router.delete('/:id', privileged, UserController.delete)
```

**Por qué `router.use(requireAuth)` y no `requireAuth` en cada ruta:**
`router.use()` registra el middleware en la pila del router. Express procesa la pila
en orden, así que las rutas definidas **antes** del `use()` (como `/registro`) son
públicas, y las definidas **después** requieren sesión. Es equivalente a poner
`requireAuth` en cada una, pero sin repetirlo.

---

## Frontend — cómo funciona con cookies

El navegador envía la cookie automáticamente en cada request al mismo origen. Solo
se necesita incluir `credentials: 'include'` en los `fetch`:

```js
// Todas las llamadas a la API llevan esto
fetch(`${BASE_URL}/usuarios`, { credentials: 'include' })
```

Sin `credentials: 'include'`, el navegador omite la cookie en requests cross-origin
(frontend en :5173, backend en :8000). También es necesario `credentials: true`
en la config de CORS del backend.

### `useUser` — cómo se verifica la sesión

```js
// Llama a GET /auth/me al montar la app
// Si hay sesión activa → retorna el usuario
// Si no hay sesión (401) → isAuthenticated: false → redirige a /login
const { user, isAuthenticated, logout } = useUser()
```

TanStack Query cachea el resultado en `['user']`. Mientras el cache esté activo,
no se vuelve a llamar a `/auth/me`. En logout se limpia el cache y el navegador
pierde la referencia al usuario.

---

## Variables de entorno

```env
SESSION_SECRET=una-cadena-larga-y-aleatoria   # requerida en producción
```

En desarrollo, si `SESSION_SECRET` no está definido, se usa `'dev-secret-change-in-prod'`.
En producción **siempre** debe estar definido con una cadena segura generada con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Notas de seguridad

- **`httpOnly: true`** — la cookie es invisible para JavaScript. Un ataque XSS no
  puede robar la sesión.
- **`secure: true` en producción** — la cookie solo se envía por HTTPS.
- **`req.session.regenerate()`** — se llama al hacer login para generar un nuevo
  session ID. Previene session fixation (ataque donde alguien inyecta un session ID
  conocido antes del login).
- **Logout sin `requireAuth`** — el endpoint de logout no requiere sesión válida.
  Si la sesión ya expiró, el usuario igual puede "cerrar sesión" y el frontend
  limpia su estado correctamente.
