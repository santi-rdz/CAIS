# Profile Dropdown & Session Storage Design

**Date:** 2026-03-04
**Branch:** feat/userDropdown
**Scope:** ProfileCard dropdown menu + session storage refactor

---

## Overview

Two related changes:
1. Replace the ProfileCard expand/collapse with a floating dropdown panel showing user info and actions.
2. Refactor session storage to only persist the user ID in localStorage (not the full user object).

---

## 1. Session Storage Refactor

### Current behavior
- Login stores full user object in localStorage: `localStorage.setItem('user', JSON.stringify(data))`
- On refresh, hydrates Query cache from the stored object (stale data risk)

### New behavior
- Login stores only the user ID: `localStorage.setItem('userId', id)`
- On refresh, `useUser()` reads the ID and fetches fresh data from `GET /usuarios/:id`
- Query cache remains the single source of truth for runtime state

### Login flow (new)
```
POST /auth/login
  → response: { id, ... }
  → localStorage.setItem('userId', id)
  → queryClient.setQueryData(['user'], { id })  ← minimal hydration
  → redirect /dashboard
```

### useUser.js changes
```
1. Read localStorage.getItem('userId') on mount
2. Enable query only if userId exists
3. queryFn: fetch GET /usuarios/:id → returns full profile
4. logout(): localStorage.removeItem('userId') + removeQueries(['user'])
```

### User data shape (from GET /usuarios/:id)
```json
{
  "id": 1,
  "name": "Samantha Martínez",
  "email": "samantha.martinez@uabc.edu.mx",
  "picture": "https://...",
  "facultad": "Medicina",
  "rol": "COORDINADOR"
}
```

Backend already returns `facultad` and `rol` — no backend changes needed.

---

## 2. ProfileCard Dropdown

### Files affected / created

| File | Change |
|------|--------|
| `src/ui/ProfileCard.jsx` | Refactor: becomes the click trigger, manages `isOpen` state |
| `src/ui/ProfileDropdown.jsx` | New: floating panel component |
| `src/features/authenticaction/useLogin.js` | Update: store only userId |
| `src/features/users/useUser.js` | Refactor: read userId, update logout |

### ProfileCard.jsx (refactored)
- Always renders compact: avatar + name + chevron icon
- Local `isOpen` state toggles the dropdown
- Uses existing `useClickOutside` hook to close on outside click
- Removes dependency on `isExpanded` prop for dropdown logic (sidebar can still use it for text visibility)

### ProfileDropdown.jsx (new component)
- Positioned `absolute, bottom: 100%, left: 0` anchored to ProfileCard
- `z-index` above sidebar content
- Receives: `user` object, `onClose` callback
- Calls `logout()` from `useUser()` on "Cerrar Sesión"
- Navigates via `useNavigate()` for Mi Perfil / Configuración

### Visual structure
```
┌──────────────────────────────┐
│  [Avatar]  Nombre Completo   │
│            email@uabc.edu.mx │
│  [Medicina]  • COORDINADOR   │
├──────────────────────────────┤
│  👤  Mi Perfil            >  │
│  ⚙️  Configuración        >  │
├──────────────────────────────┤
│  ↪  Cerrar Sesión            │
├──────────────────────────────┤
│  🏛  CAIS - UABC             │
└──────────────────────────────┘
```

### Navigation targets
- Mi Perfil → existing route `/perfil` (or equivalent)
- Configuración → existing route `/configuracion` (or equivalent)
- Cerrar Sesión → `logout()` from useUser hook

---

## 3. Sidebar.jsx impact

The `isExpanded` prop to ProfileCard is retained for controlling whether the user's name text is visible in compact sidebar mode. The dropdown behavior is independent of sidebar expansion.

---

## Out of scope
- Mi Perfil and Configuración page content (pages already exist)
- Backend changes (facultad/rol already returned by API)
- Avatar upload / photo change (mentioned as future interest but not in this sprint)
