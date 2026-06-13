# CAIS — Sistema de Administración

Sistema de administración interna para el Centro de Atención Integral para la Salud (CAIS) de la UABC. Gestiona usuarios (internos y coordinadores), pacientes, emergencias y expedientes clínicos con módulos de medicina y nutrición.

## Stack

| Capa          | Tecnología                        |
| ------------- | --------------------------------- |
| Frontend      | React 19 + Vite + Tailwind CSS v4 |
| Backend       | Node.js + Express 5               |
| ORM           | Prisma 7                          |
| Validación    | Zod 4 (esquemas compartidos)      |
| Base de datos | MySQL 8                           |
| Contenedores  | Docker (solo DB en desarrollo)    |

## Requisitos

- Docker (solo para la base de datos en desarrollo)
- Node.js 24+
- pnpm 11.5.1 (Corepack recomendado: `corepack enable`)

## Inicio rápido

```bash
git clone https://github.com/santi-rdz/CAIS.git
cd CAIS

# Instala dependencias, levanta la DB, genera el cliente Prisma y siembra datos
pnpm run setup

# Levanta frontend + backend en modo desarrollo (con HMR)
pnpm run dev
```

Los servicios quedan expuestos en:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- MySQL: puerto 3307 (usuario: `user`, contraseña: `user`)

## Comandos disponibles

### Desarrollo

```bash
pnpm run setup      # Primera vez: instala deps, levanta DB, genera Prisma y siembra
pnpm run dev        # Levanta DB en Docker + frontend y backend en local (HMR)
pnpm run seed       # Corre el seed de Prisma (la DB debe estar corriendo)
```

### Base de datos (Docker)

```bash
pnpm run db:up      # Levanta solo la DB en Docker
pnpm run db:down    # Detiene el container de la DB
pnpm run db:fresh   # Reset total: borra el volumen, recrea la DB y siembra
pnpm run db:logs    # Logs del container de la DB
pnpm run db:sql     # Consola MySQL interactiva
```

### Producción (Docker completo)

```bash
pnpm run up         # Levanta todos los containers (sin rebuild)
pnpm run restart    # Rebuild + up
pnpm run fresh      # Reset total: borra volúmenes, reconstruye y levanta
pnpm run down       # Baja los containers (conserva la DB)
pnpm run logs       # Logs en tiempo real de todos los containers
pnpm run ps         # Estado de los containers
```

### Calidad de código

```bash
pnpm run check      # Lint + formateo (sin modificar archivos)
pnpm run format     # Formatea el código con Prettier
pnpm run test       # Tests del backend (Jest + supertest)
```

## Desarrollo

El proyecto usa pnpm workspaces con tres paquetes: `frontend/`, `backend/` y `shared/`.

En desarrollo, **solo la base de datos corre en Docker**. El frontend y el backend se ejecutan nativamente en el host para obtener HMR instantáneo y reinicios rápidos al guardar.

### Frontend

```bash
cd frontend
pnpm run dev     # Servidor de desarrollo (puerto 5173, HMR)
pnpm run test    # Tests con Vitest
```

### Backend

```bash
cd backend
pnpm run dev             # Node con --watch (puerto 8000, reinicia al guardar)
pnpm test                # Jest + supertest
pnpm run prisma:studio   # Prisma Studio (explorador visual de la DB)
```

## Estructura

```
CAIS/
├── frontend/
│   └── src/
│       ├── features/       # Módulos por dominio
│       │   ├── authentication/
│       │   ├── users/
│       │   ├── patients/
│       │   └── emergencies/
│       ├── pages/          # Componentes de ruta
│       ├── ui/             # Componentes reutilizables
│       ├── services/       # Llamadas a la API
│       └── hooks/          # Hooks compartidos
├── backend/
│   └── src/
│       ├── routes/         # Definición de rutas Express
│       ├── controllers/    # Lógica de cada endpoint
│       ├── services/       # Lógica de negocio
│       ├── models/         # Modelos Prisma
│       └── middleware/     # Autenticación, etc.
├── shared/
│   ├── schemas/            # Validaciones Zod compartidas front/back
│   └── constants/          # Constantes compartidas
└── database/
    └── migrations/         # Migraciones SQL (ejecutadas al iniciar MySQL)
```

## Usuarios de prueba

Todos comparten la contraseña: `123`

| Correo                      | Rol         | Área      |
| --------------------------- | ----------- | --------- |
| `carlos.herrera@cais.com`   | Pasante     | Medicina  |
| `sofia.navarro@uabc.edu.mx` | Coordinador | Medicina  |
| `maria.lopez@uabc.edu.mx`   | Coordinador | Nutrición |
| `luis.mendoza@uabc.edu.mx`  | Pasante     | Nutrición |
| `admin@cais.com`            | Admin       | —         |

## Variables de entorno

El backend toma la conexión a la base de datos desde `DATABASE_URL`. Crea `backend/.env` para desarrollo local:

```env
DATABASE_URL="mysql://user:user@localhost:3307/cais"
```
