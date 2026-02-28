# Registration Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the complete token-based user registration flow so invited users can click their email link and complete their profile.

**Architecture:** Admin pre-registers a user (PENDIENTE state + token stored in DB + email sent). User clicks `/register/:token` → frontend validates token via `GET /usuarios/register/:token` → shows pre-filled form → user submits via `POST /usuarios/register/:token` → backend validates token, marks it used, updates existing user to ACTIVO.

**Tech Stack:** Express 5, mysql2, Zod (backend) · React 19, react-hook-form, TanStack Query, Vitest (frontend)

---

## Task 1: Add `pre_register_token` table to schema

**Files:**
- Modify: `database/CAISchema.sql`

**Step 1: Add table definition after the `usuarios` table block**

Find the comment `-- PACIENTES` and insert above it:

```sql
-- ===============================
-- TOKENS DE REGISTRO
-- ===============================
CREATE TABLE IF NOT EXISTS pre_register_token (
    token VARCHAR(36) PRIMARY KEY,
    person_id BINARY(16) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_token_usuario FOREIGN KEY (person_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

**Step 2: Recreate the DB container to apply the schema**

```bash
npm run docker:down && npm run docker:up:b
```

Expected: containers start, no SQL errors in logs (`npm run docker:logs`).

**Step 3: Commit**

```bash
git add database/CAISchema.sql
git commit -m "feat: add pre_register_token table to schema"
```

---

## Task 2: Extend TokenModel with getByToken and markUsed

**Files:**
- Modify: `backend/src/models/TokenModel.js`

**Step 1: Replace file content with**

```js
import { pool } from '../config/db.js'

export class TokenModel {
  static async insertTokens(users, conn) {
    for (const u of users) {
      await conn.query(
        `INSERT INTO pre_register_token (token, person_id, expires_at)
         VALUES (?, UUID_TO_BIN(?), ?)`,
        [u.token, u.personId, u.expiresAt]
      )
    }
  }

  /** Returns the matching PENDIENTE usuario row or null if token is invalid/expired/used */
  static async getByToken(token) {
    const [rows] = await pool.query(
      `SELECT
         BIN_TO_UUID(u.id)  AS id,
         u.nombre,
         u.correo,
         u.telefono,
         u.fecha_nacimiento AS fechaNacimiento,
         u.matricula,
         r.codigo           AS rol,
         a.nombre           AS area
       FROM pre_register_token t
       JOIN usuarios u ON u.id = t.person_id
       JOIN roles    r ON r.id = u.rol_id
       LEFT JOIN areas a ON a.id = u.area_id
       WHERE t.token      = ?
         AND t.expires_at > NOW()
         AND t.used_at   IS NULL`,
      [token]
    )
    return rows[0] ?? null
  }

  static async markUsed(token, conn) {
    await conn.query(
      `UPDATE pre_register_token SET used_at = NOW() WHERE token = ?`,
      [token]
    )
  }
}
```

**Step 2: Commit**

```bash
git add backend/src/models/TokenModel.js
git commit -m "feat: add getByToken and markUsed to TokenModel"
```

---

## Task 3: Add completeRegistration to UserModel

**Files:**
- Modify: `backend/src/models/user.js`

**Step 1: Add method after the `update` method (around line 123)**

```js
  /** Updates an existing PENDIENTE user to ACTIVO after token-based registration */
  static async completeRegistration(userId, data, conn) {
    const [[estadoRow]] = await conn.query(
      `SELECT id FROM estados WHERE codigo = 'ACTIVO'`
    )

    await conn.query(
      `UPDATE usuarios
         SET nombre           = ?,
             fecha_nacimiento = ?,
             telefono         = ?,
             matricula        = ?,
             inicio_servicio  = ?,
             fin_servicio     = ?,
             password_hash    = ?,
             estado_id        = ?
       WHERE id = UUID_TO_BIN(?)`,
      [
        data.nombre,
        data.fechaNacimiento,
        data.telefono,
        data.matricula ?? null,
        data.inicio_servicio ?? null,
        data.fin_servicio    ?? null,
        data.password,
        estadoRow.id,
        userId,
      ]
    )

    return this.getById(userId)
  }
```

**Step 2: Commit**

```bash
git add backend/src/models/user.js
git commit -m "feat: add completeRegistration to UserModel"
```

---

## Task 4: Add Zod schema for registration completion

**Files:**
- Create: `backend/src/schemas/completarRegistro.js`

**Step 1: Create the file**

```js
import z from 'zod'

const completarRegistroSchema = z.object({
  nombre:          z.string().min(2),
  fechaNacimiento: z.string(),
  telefono:        z.string().regex(/^\d{8,15}$/),
  matricula:       z.string().optional(),
  inicio_servicio: z.string().optional(),
  fin_servicio:    z.string().optional(),
  password:        z.string().min(8),
})

export function validateCompletarRegistro(input) {
  return completarRegistroSchema.safeParse(input)
}
```

**Step 2: Commit**

```bash
git add backend/src/schemas/completarRegistro.js
git commit -m "feat: add completarRegistro Zod schema"
```

---

## Task 5: Add register-by-token endpoints to controller and router

**Files:**
- Modify: `backend/src/controllers/users.js`
- Modify: `backend/src/routes/users.js`

**Step 1: Add imports at top of `controllers/users.js`**

```js
import { validateCompletarRegistro } from '../schemas/completarRegistro.js'
import { TokenModel } from '../models/TokenModel.js'
import { pool } from '../config/db.js'
```

**Step 2: Add two new static methods to `UserController` (at the end of the class)**

```js
  /** GET /usuarios/register/:token — validate token, return pre-filled user data */
  static async getRegistrationData(req, res) {
    const { token } = req.params
    const user = await TokenModel.getByToken(token)
    if (!user) return res.status(410).json({ message: 'El enlace es inválido o ha expirado' })
    res.json(user)
  }

  /** POST /usuarios/register/:token — complete registration */
  static async completeRegistration(req, res) {
    const { token } = req.params

    const result = validateCompletarRegistro(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const tokenData = await TokenModel.getByToken(token)
      if (!tokenData) {
        await conn.rollback()
        return res.status(410).json({ message: 'El enlace es inválido o ha expirado' })
      }

      await TokenModel.markUsed(token, conn)
      const updatedUser = await UserModel.completeRegistration(tokenData.id, result.data, conn)
      await conn.commit()

      res.status(200).json(updatedUser)
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }
```

**Step 3: Replace `routes/users.js` with** (register routes BEFORE `/:id` to avoid collision)

```js
import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const userRouter = new Router()

userRouter.get('/',                 UserController.getAll)
userRouter.get('/register/:token',  UserController.getRegistrationData)
userRouter.post('/register/:token', UserController.completeRegistration)
userRouter.get('/:id',              UserController.getById)
userRouter.delete('/:id',           UserController.delete)
userRouter.patch('/:id',            UserController.update)
userRouter.post('/pre',             UserController.preRegister)
userRouter.post('/complete',        UserController.fullRegister)
```

**Step 4: Smoke test with curl**

```bash
curl -s http://localhost:8000/usuarios/register/invalid-token | jq
```

Expected: `{"message":"El enlace es inválido o ha expirado"}`

**Step 5: Commit**

```bash
git add backend/src/controllers/users.js backend/src/routes/users.js
git commit -m "feat: add GET/POST /usuarios/register/:token endpoints"
```

---

## Task 6: Fix email URL to use env var

**Files:**
- Modify: `backend/src/services/users.js`
- Modify: `docker-compose.yml`

**Step 1: Replace hardcoded URL in `services/users.js`**

Change:
```js
const url = `https://localhost:5173/register/${u.token}`
```

To:
```js
const url = `${process.env.FRONTEND_URL}/register/${u.token}`
```

**Step 2: Add `FRONTEND_URL` to backend env in `docker-compose.yml`**

Under the `backend` service `environment` block, add:
```yaml
FRONTEND_URL: http://localhost:5173
```

**Step 3: Commit**

```bash
git add backend/src/services/users.js docker-compose.yml
git commit -m "fix: use FRONTEND_URL env var for registration email link"
```

---

## Task 7: Add API service functions in frontend

**Files:**
- Modify: `frontend/src/services/ApiUsers.js`

**Step 1: Add two functions at the end of the file**

```js
export async function getRegistrationToken(token) {
  const res = await fetch(`${BASE_URL}/usuarios/register/${token}`)
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message ?? 'Enlace inválido o expirado')
  }
  return res.json()
}

export async function completeRegistration(token, userData) {
  const res = await fetch(`${BASE_URL}/usuarios/register/${token}`, {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message ?? 'Error al completar el registro')
  }
  return res.json()
}
```

**Step 2: Commit**

```bash
git add frontend/src/services/ApiUsers.js
git commit -m "feat: add getRegistrationToken and completeRegistration API functions"
```

---

## Task 8: Add useCompleteRegistration hook + test

**Files:**
- Create: `frontend/src/features/authenticaction/useCompleteRegistration.js`
- Create: `frontend/src/test/useCompleteRegistration.test.jsx`

**Step 1: Write the failing test first**

```jsx
// frontend/src/test/useCompleteRegistration.test.jsx
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createElement } from 'react'
import useCompleteRegistration from '@features/authenticaction/useCompleteRegistration'
import * as ApiUsers from '@services/ApiUsers'

vi.mock('@services/ApiUsers')
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))

function wrapper({ children }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return createElement(QueryClientProvider, { client }, children)
}

describe('useCompleteRegistration', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls completeRegistration with token and data', async () => {
    ApiUsers.completeRegistration.mockResolvedValue({ id: '1', nombre: 'Test' })
    const { result } = renderHook(() => useCompleteRegistration('my-token'), { wrapper })

    await act(async () => {
      result.current.completeReg({ nombre: 'Test', password: '12345678' })
    })

    expect(ApiUsers.completeRegistration).toHaveBeenCalledWith(
      'my-token',
      { nombre: 'Test', password: '12345678' }
    )
  })

  it('sets isCompleting true during mutation', () => {
    ApiUsers.completeRegistration.mockImplementation(() => new Promise(() => {}))
    const { result } = renderHook(() => useCompleteRegistration('tok'), { wrapper })

    act(() => {
      result.current.completeReg({ nombre: 'X', password: '12345678' })
    })

    expect(result.current.isCompleting).toBe(true)
  })
})
```

**Step 2: Run test to confirm it fails**

```bash
cd frontend && npx vitest run src/test/useCompleteRegistration.test.jsx
```

Expected: FAIL — `Cannot find module '@features/authenticaction/useCompleteRegistration'`

**Step 3: Create the hook**

```js
// frontend/src/features/authenticaction/useCompleteRegistration.js
import { completeRegistration } from '@services/ApiUsers'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function useCompleteRegistration(token) {
  const navigate = useNavigate()

  const { mutate: completeReg, isPending: isCompleting } = useMutation({
    mutationFn: (userData) => completeRegistration(token, userData),
    onSuccess: () => {
      toast.success('Registro completado. Ya puedes iniciar sesión.')
      navigate('/login')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { completeReg, isCompleting }
}
```

**Step 4: Run test to confirm it passes**

```bash
cd frontend && npx vitest run src/test/useCompleteRegistration.test.jsx
```

Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add frontend/src/features/authenticaction/useCompleteRegistration.js \
        frontend/src/test/useCompleteRegistration.test.jsx
git commit -m "feat: add useCompleteRegistration hook with tests"
```

---

## Task 9: Add RegisterForm component

**Files:**
- Create: `frontend/src/features/authenticaction/RegisterForm.jsx`

**Step 1: Create the component**

```jsx
// frontend/src/features/authenticaction/RegisterForm.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiEye, HiEyeSlash } from 'react-icons/hi2'
import FormRow from '@ui/FormRow'
import Input from '@ui/Input'
import Button from '@ui/Button'
import useCompleteRegistration from './useCompleteRegistration'

export default function RegisterForm({ token, prefill }) {
  const { completeReg, isCompleting } = useCompleteRegistration(token)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: prefill?.nombre ?? '',
      telefono: prefill?.telefono ?? '',
    },
  })

  const password = watch('password', '')

  function onSubmit(data) {
    const { confirmPassword, ...rest } = data
    completeReg(rest)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormRow htmlFor="nombre" label="Nombre completo">
        <Input
          {...register('nombre', { required: 'Ingresa tu nombre completo' })}
          id="nombre"
          type="text"
          placeholder="Ej. Raul Santiago Rodríguez Martínez"
          hasError={errors?.nombre?.message}
          variant="outline"
        />
      </FormRow>

      <FormRow htmlFor="correo" label="Correo registrado">
        <Input
          id="correo"
          type="email"
          value={prefill?.correo ?? ''}
          disabled
          variant="outline"
        />
      </FormRow>

      <FormRow htmlFor="fechaNacimiento" label="Fecha de nacimiento">
        <Input
          {...register('fechaNacimiento', { required: 'Ingresa tu fecha de nacimiento' })}
          id="fechaNacimiento"
          type="date"
          hasError={errors?.fechaNacimiento?.message}
          variant="outline"
        />
      </FormRow>

      <FormRow htmlFor="telefono" label="Teléfono">
        <Input
          {...register('telefono', {
            required: 'Ingresa tu teléfono',
            pattern: { value: /^\d{8,15}$/, message: '8–15 dígitos sin espacios' },
          })}
          id="telefono"
          type="tel"
          placeholder="Ej. 6861234567"
          hasError={errors?.telefono?.message}
          variant="outline"
        />
      </FormRow>

      <FormRow htmlFor="matricula" label="Matrícula (opcional)">
        <Input
          {...register('matricula')}
          id="matricula"
          type="text"
          placeholder="Ej. L21012345"
          variant="outline"
        />
      </FormRow>

      <FormRow htmlFor="password" label="Contraseña">
        <Input
          {...register('password', {
            required: 'Ingresa una contraseña',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
          })}
          id="password"
          type={showPass ? 'text' : 'password'}
          placeholder="Mínimo 8 caracteres"
          hasError={errors?.password?.message}
          variant="outline"
          suffix={
            <div>
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          }
        />
      </FormRow>

      <FormRow htmlFor="confirmPassword" label="Confirmar contraseña">
        <Input
          {...register('confirmPassword', {
            required: 'Confirma tu contraseña',
            validate: (v) => v === password || 'Las contraseñas no coinciden',
          })}
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repite la contraseña"
          hasError={errors?.confirmPassword?.message}
          variant="outline"
          suffix={
            <div>
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          }
        />
      </FormRow>

      <Button type="submit" variant="primary" disabled={isCompleting} className="w-full">
        {isCompleting ? 'Registrando...' : '✓ Registrarme'}
      </Button>
    </form>
  )
}
```

**Step 2: Commit**

```bash
git add frontend/src/features/authenticaction/RegisterForm.jsx
git commit -m "feat: add RegisterForm component"
```

---

## Task 10: Add Register page with token validation and error state

**Files:**
- Create: `frontend/src/pages/Register.jsx`

**Step 1: Create the page**

```jsx
// frontend/src/pages/Register.jsx
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRegistrationToken } from '@services/ApiUsers'
import RegisterForm from '@features/authenticaction/RegisterForm'
import Spinner from '@ui/Spinner'

export default function Register() {
  const { token } = useParams()

  const { data: prefill, isPending, isError } = useQuery({
    queryKey: ['registration-token', token],
    queryFn: () => getRegistrationToken(token),
    retry: false,
  })

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-4 font-medium text-red-600">Este enlace es inválido o ha expirado.</p>
        <p className="text-5 text-neutral-500">
          Solicita al administrador que te envíe un nuevo enlace de registro.
        </p>
        <Link to="/login" className="text-5 text-green-700 underline underline-offset-2">
          Ir al inicio de sesión
        </Link>
      </div>
    )
  }

  return <RegisterForm token={token} prefill={prefill} />
}
```

**Step 2: Commit**

```bash
git add frontend/src/pages/Register.jsx
git commit -m "feat: add Register page with token validation and error state"
```

---

## Task 11: Wire route in App.jsx + fix Auth subtitle

**Files:**
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/pages/Auth.jsx`

**Step 1: Update `App.jsx`**

```jsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import AppLayout from './ui/AppLayout'
import Dashboard from './pages/Dashboard'
import LoginForm from '@features/authenticaction/LoginForm'
import Register from './pages/Register'
import Users from './pages/Users'
import ProtectedRoute from '@ui/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="usuarios" element={<Users />} />
        </Route>
        <Route element={<Auth />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="register/:token" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
```

**Step 2: Update `Auth.jsx` Main to handle register subtitle**

```jsx
function Main() {
  const path = useLocation().pathname;
  const isRegister = path.startsWith('/register/')
  const title    = isRegister ? 'Registrarme' : 'Iniciar Sesión'
  const subtitle = isRegister
    ? '¡Bienvenido! Completa tu perfil para acceder.'
    : 'Bienvenido de vuelta!'
  return (
    <main className="space-y-10">
      <header>
        <h1 className="text-1">{title}</h1>
        <p className="text-5 text-neutral-400">{subtitle}</p>
      </header>
      <Outlet />
    </main>
  );
}
```

**Step 3: Manual smoke test**

1. `npm run docker:up`
2. Visitar `http://localhost:5173/register/token-invalido` → ver pantalla de error
3. Pre-registrar usuario desde el panel → revisar DB token:
   ```bash
   docker exec -it cais-db mysql -u root -proot cais \
     -e "SELECT token, expires_at, used_at FROM pre_register_token;"
   ```
4. Visitar `http://localhost:5173/register/<token>` → ver form pre-llenado con correo
5. Llenar form y enviar → toast de éxito + redirect a /login
6. Login con las credenciales nuevas → éxito

**Step 4: Commit**

```bash
git add frontend/src/App.jsx frontend/src/pages/Auth.jsx
git commit -m "feat: wire /register/:token route and fix Auth subtitle"
```

---

## Summary

| Layer | Files |
|---|---|
| DB schema | `database/CAISchema.sql` |
| Backend models | `backend/src/models/TokenModel.js`, `backend/src/models/user.js` |
| Backend schema | `backend/src/schemas/completarRegistro.js` |
| Backend controller/routes | `backend/src/controllers/users.js`, `backend/src/routes/users.js` |
| Backend service | `backend/src/services/users.js` |
| Docker | `docker-compose.yml` |
| Frontend services | `frontend/src/services/ApiUsers.js` |
| Frontend hook + test | `frontend/src/features/authenticaction/useCompleteRegistration.js`, `frontend/src/test/useCompleteRegistration.test.jsx` |
| Frontend components | `frontend/src/features/authenticaction/RegisterForm.jsx` |
| Frontend pages | `frontend/src/pages/Register.jsx`, `frontend/src/pages/Auth.jsx` |
| Frontend routing | `frontend/src/App.jsx` |
