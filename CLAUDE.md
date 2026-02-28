# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CAIS (Centro de Atención Integral para la Salud) is a health center administration system for UABC. It manages staff users (pasantes/interns, coordinadores, super admins), patients, medical records, and clinical notes.

**Stack:** React 19 + Vite (frontend) · Node.js + Express 5 (backend) · MySQL 8 (database) · Docker Compose

## Development Commands

### Docker (primary workflow)
```bash
npm run docker:up:b      # Build and start all services
npm run docker:up        # Start (no rebuild)
npm run docker:up:d      # Start detached
npm run docker:down      # Stop and remove containers
npm run docker:logs      # Follow logs
npm run docker:restart   # Restart services
```

Services: frontend → http://localhost:5173 · backend → http://localhost:8000 · MySQL → localhost:3306

### Local frontend development (inside `frontend/`)
```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run lint     # ESLint
npm run test     # Vitest (watch mode)
```

### Running a single test
```bash
cd frontend && npx vitest run src/test/loginForm.test.jsx
```

### Backend (inside `backend/`)
```bash
npm run start    # node --watch src/app.js (hot reload)
```

## Architecture

### Monorepo structure
```
/
├── frontend/   React app (Vite)
├── backend/    Express API
├── database/   CAISchema.sql (auto-loaded by MySQL container on first run)
└── docker-compose.yml
```

### Frontend (`frontend/src/`)

Feature-based organization with path aliases configured in `vite.config.js`:
- `@ui` → `src/ui/` — shared UI primitives (Button, Modal, Table, Pagination, etc.)
- `@features` → `src/features/` — domain features (`users/`, `authenticaction/`)
- `@services` → `src/services/` — API client functions (`ApiUsers.js`, `ApiAuth.js`)
- `@lib` → `src/lib/` — constants, utilities
- `@hooks` → `src/hooks/`

**Data fetching pattern:** TanStack Query (`useQuery`/`useMutation`) wraps service functions. Each feature has co-located custom hooks (e.g., `useUsers`, `useDeleteUser`, `useCreatePreUser`). Query keys follow `['resource', ...filters]` pattern. Adjacent-page prefetching is used for paginated lists.

**State:** URL search params drive filtering/sorting/pagination (via `useSearchParams`). Zustand is available for client state.

**Forms:** `react-hook-form` with Zod-like validation. Role-specific sub-forms (`InternForm`, `CoordForm`) rendered via a `Tab` component switcher inside `UserForm`.

**Routing:** React Router v7. Protected routes wrapped in `ProtectedRoute`. Layout: `AppLayout` (sidebar + header) wraps authenticated pages; `Auth` wraps the login page.

### Backend (`backend/src/`)

Layered MVC:
- `routes/` → `controllers/` → `models/` (direct SQL via `mysql2`) + `services/` (business logic)
- Input validation via Zod schemas in `schemas/`
- Auth via `better-auth` library with custom MySQL adapter (`config/auth.js`)
- Email via `nodemailer` (`config/mailer.js`, `lib/sendEmail.js`)

**API base URLs:**
- `/usuarios` — user CRUD + registration flow
- `/api/auth` — better-auth endpoints

### Database

MySQL 8 with UUID primary keys stored as `BINARY(16)` using `UUID_TO_BIN()`/`BIN_TO_UUID()`. Always convert IDs at query boundaries.

**Core tables:** `usuarios`, `pacientes`, `historias_medicas`, `notas_evolucion`
**Lookup tables:** `estados` (ACTIVO/PENDIENTE/INACTIVO), `roles` (PASANTE/COORDINADOR/SUPER_ADMIN), `areas` (MEDICINA/NUTRICION/PSICOLOGIA/PSIQUIATRIA)
**Audit:** `registro_auditoria`, `bitacora_emergencias`

Schema is seeded automatically from `database/CAISchema.sql` on container first run.

### User Registration Flow

Two-step process:
1. **Pre-register** (`POST /usuarios/pre`): Admin creates user with basic info → generates UUID token → stores in `TokenModel` → sends email with registration link (`/register/:token`)
2. **Full register** (`POST /usuarios/complete`): User completes profile via token link

## Key Conventions

- **Language:** Code, DB schema, and API field names are in Spanish (e.g., `nombre`, `correo`, `estado`, `rol`). Frontend query params also in Spanish (`buscar`, `ordenarPor`).
- **DB queries:** Always use parameterized queries (never string interpolation). Map `BINARY(16)` UUIDs with helper functions in every query.
- **Backend env vars required:** `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, DB credentials (see docker-compose for dev values).
- **Pagination:** Default page size is `PAGE_SIZE = 10` (`frontend/src/lib/constants.js`).
