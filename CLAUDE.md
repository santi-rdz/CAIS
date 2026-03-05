# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Administration system for UABC "Centro de Atención Integral para la Salud" (CAIS). npm workspaces monorepo with a React frontend and Node/Express backend, both running in Docker.

## Commands

### Root (monorepo)

```bash
npm run lint           # ESLint across frontend + backend
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Prettier (write)
npm run format:check   # Prettier (check — used in CI)
```

### Docker Compose (preferred way to run the full stack)

```bash
npm run dc:up          # Start all containers detached
npm run dc:rebuild     # Rebuild images and start
npm run dc:down        # Stop containers
npm run dc:logs        # Follow logs
npm run dc:sql         # Open MySQL shell (password: user)
```

### Frontend (`cd frontend`)

```bash
npm run dev       # Vite dev server at :5173
npm run build     # Production build
npm run test      # Vitest (watch mode)

# Run a single test file
npx vitest run src/test/loginForm.test.jsx
```

### Backend (`cd backend`)

```bash
npm run start     # node --watch src/app.js (port 8000)
npm run test      # Jest + Supertest integration tests (requires live DB container)
```

## Architecture

### Services (Docker Compose)

| Service    | Port | Tech                |
|------------|------|---------------------|
| `frontend` | 5173 | React 19 + Vite 7   |
| `backend`  | 8000 | Node.js + Express 5 |
| `db`       | 3307 | MySQL 8.0           |

The frontend calls the backend at `http://localhost:8000`. The DB schema is seeded from `database/CAISchema.sql` on first container start.

### Frontend Stack

- **React 19 + Vite 7 + Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **TanStack Query v5** — all server state; no Redux/Context for data fetching
- **React Hook Form** — all form state and validation
- **React Router v7** — routing
- **Sonner** — toast notifications

Path aliases (defined in `vite.config.js`):

```
@ui        → src/ui
@features  → src/features
@hooks     → src/hooks
@services  → src/services
@lib       → src/lib
@assets    → src/assets
```

Feature code lives in `src/features/`. Each feature has co-located custom hooks wrapping TanStack Query (e.g., `useUsers`, `useCreatePreUser`, `useDeleteUser`). Shared components go in `src/ui/`.

### Backend Stack

- **Express 5** with ESM (`"type": "module"`)
- **mysql2/promise** connection pool (no ORM — raw SQL with parameterized queries)
- **Zod** schemas in `src/schemas/` — validate all incoming request bodies (returns 422 on failure)
- **bcryptjs** for password hashing

Backend structure:
```
backend/src/
  app.js          # Express app + middleware + listen
  routes/         # Router definitions
  controllers/    # Request/response handlers
  models/         # Static classes with raw SQL queries
  schemas/        # Zod validation schemas
  config/         # db.js (pool), mailer.js, auth.js
  lib/            # Shared utilities (email templates, error formatting)
  __tests__/      # Jest + Supertest integration tests
```

### API Routes

All routes are in Spanish:

- `GET /usuarios` — Paginated list with filters (`status`, `ordenarPor`, `buscar`, `page`)
- `POST /usuarios` — Create pre-user
- `POST /usuarios/registro` — Complete user registration
- `GET /usuarios/:id` — Get user by ID
- `DELETE /usuarios/:id` — Delete user
- `PATCH /usuarios/:id` — Partial update
- `POST /auth/login` — Login (email + password)
- `POST /invitaciones` — Create invitations

## Key Conventions

### UI Language
All user-facing text, route names, and many variable/field names are in **Spanish** (`nombre`, `correo`, `estado`, `/usuarios`, etc.). Keep new UI text in Spanish.

### Auth State
Auth lives **only in TanStack Query cache** (`queryKey: ['user']`). `useUser` reads `queryClient.getQueryData(['user'])` — unauthenticated if missing. Auth does not survive a page refresh by design.

### Database UUIDs
UUIDs stored as `BINARY(16)`. All queries use `BIN_TO_UUID()` / `UUID_TO_BIN()` for conversion.

### Zod Validation Pattern
Controllers call `validateUser(input)` / `validatePartialUser(input)`. Validation is role-aware: `pasante` requires `matricula`; `coordinador` requires `cedula`. On failure, respond `422` with `error.errors`.

### Compound Component Pattern
`Modal` and `Tab` use Context + compound components:

```jsx
<Modal>
  <Modal.Open opens="my-window"><Button>Open</Button></Modal.Open>
  <Modal.Content name="my-window"><MyForm onCloseModal={close} /></Modal.Content>
</Modal>
```

`Tab` `options` entries must have `{ title, desc, label, value, component: (onClose) => <JSX /> }`.

### Multi-Step Forms
`InternForm` uses `Stepper` + `FormProvider`. Validate per step via `trigger(stepsFields[currStep])` before advancing. `stepsFields` is an array of field-name arrays matching each step index.

### Typo in Folder Name
`src/features/authenticaction/` — the extra `c` is intentional. Do not rename it.

### Testing (Frontend)
Vitest + jsdom + `@testing-library/react`. Import `@testing-library/jest-dom` at the top of test files that use matchers like `toBeInTheDocument`.

### Testing (Backend)
Jest + Supertest integration tests. Tests hit a real database — ensure the DB container is running.

### Code Style
Prettier: no semicolons, single quotes, trailing commas (`es5`), 80-char line width. `prettier-plugin-tailwindcss` auto-sorts Tailwind classes. ESLint uses flat config format (v9).

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on PRs to `main`: `npm ci` → `npm run lint` → `npm run format:check`. No build or test steps run in CI yet.
