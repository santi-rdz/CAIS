# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (host 0.0.0.0, port 5173)
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Vitest (watch mode)
npm run preview    # Preview production build
npm run server     # json-server mock on port 3000 (rarely used; real API is at :8000)
```

Run a single test file:
```bash
npx vitest run src/test/loginForm.test.jsx
```

## Architecture

### Stack
- **React 19** + **Vite 7** + **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **TanStack Query v5** — all server state; no Redux/Context for data
- **React Hook Form** — all form state and validation
- **React Router v7** — routing
- **Sonner** — toast notifications

### Path Aliases
Defined in `vite.config.js`:
```
@ui        → src/ui
@features  → src/features
@hooks     → src/hooks
@services  → src/services
@lib       → src/lib
@assets    → src/assets
```

### Project Structure
```
src/
  features/
    authenticaction/   # Login flow (note: intentional typo in folder name)
    users/             # User management (table, forms, hooks)
  ui/                  # Shared reusable components
  services/            # API fetch functions (ApiUsers.js, apiAuth.js)
  lib/                 # constants.js (PAGE_SIZE=10), utils.js (isValidEmail)
  hooks/               # useClickOutside, useDropdownPosition
  pages/               # Route-level components (Auth, Dashboard, Users)
  test/                # Vitest + Testing Library tests
```

### Backend API
All API calls target `http://localhost:8000`. Routes are in Spanish:
- `GET/POST /usuarios` — user list and pre-registration
- `DELETE /usuarios/:id`
- `GET /usuarios/:id`
- `POST /api/auth/login`

### Auth Pattern
Auth state lives **only in TanStack Query cache** (`queryKey: ['user']`). There is no localStorage or cookie handling. `useUser` checks `queryClient.getQueryData(['user'])` — if missing, the user is unauthenticated and redirected to `/login`. This means auth does not survive page refresh by design (or it is still being built out).

### Compound Component Patterns
`Modal` and `Tab` both use the **Context + compound components** pattern:

```jsx
// Modal usage
<Modal>
  <Modal.Open opens="my-window">
    <Button>Open</Button>
  </Modal.Open>
  <Modal.Content name="my-window">
    <MyForm onCloseModal={close} />
  </Modal.Content>
</Modal>

// Tab usage — options array drives content
<Tab options={options} defaultTab="pre">
  <Tab.Header>...</Tab.Header>
  <Tab.Options />
  <Tab.Content onClose={onClose} />
</Tab>
```

`Tab` `options` entries must have `{ title, desc, label, value, component: (onClose) => <JSX /> }`.

### Multi-Step Forms
`InternForm` uses a `Stepper` + `FormProvider` pattern. Validation runs per-step via `trigger(stepsFields[currStep])` before advancing. Fields are grouped in the `stepsFields` array matching each step index.

### Feature Hooks
Each feature has co-located custom hooks that wrap TanStack Query:
- `useUsers` — paginated list, reads URL search params for filters (`status`, `ordenarPor`, `buscar`, `page`)
- `useUser` — current authenticated user
- `useCreatePreUser`, `useDeleteUser` — mutations with toast feedback

### UI Language
All user-facing text and route names are in **Spanish** (e.g., `/usuarios`, button labels, form field names, validation messages). Keep new UI text in Spanish.

### Testing
Tests use **Vitest** with **jsdom** (configured in `vite.config.js`) and `@testing-library/react`. Import `@testing-library/jest-dom` at the top of test files that use matchers like `toBeInTheDocument`.
