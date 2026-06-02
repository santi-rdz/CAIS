# CAIS — Sistema de Administración

Sistema de administración interna para el Centro de Atención Integral para la Salud (CAIS) de la UABC. Gestiona usuarios (internos y coordinadores), pacientes, emergencias y expedientes clínicos con módulos de medicina y nutrición.

## Stack

| Capa          | Tecnología                        |
| ------------- | --------------------------------- |
| Frontend      | React 19 + Vite + Tailwind CSS v4 |
| Backend       | Node.js + Express 5               |
| ORM           | Prisma                            |
| Validación    | Zod 4 (esquemas compartidos)      |
| Base de datos | MySQL 8                           |
| Contenedores  | Docker + Docker Compose           |

## Requisitos

- Docker y Docker Compose instalados
- Node.js 22.13+ (solo para desarrollo local sin Docker; Node 24 recomendado)
- pnpm 11.5.1 (Corepack recomendado)

## Inicio rápido

```bash
git clone https://github.com/santi-rdz/CAIS.git
cd CAIS

# Primer arranque (construye imágenes y levanta todo)
pnpm run restart
```

Los servicios quedan expuestos en:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- MySQL: puerto 3307 (usuario: `user`, contraseña: `user`)

## Comandos disponibles

```bash
pnpm run up        # Levanta los containers (sin rebuild)
pnpm run stop      # Detiene los containers
pnpm run down      # Baja los containers (conserva la DB)
pnpm run restart   # Rebuild + up (usar al cambiar Dockerfile o dependencias)
pnpm run fresh     # Reset total: borra volúmenes y reconstruye desde cero
pnpm run rb        # Reinicia solo el backend
pnpm run logs      # Logs en tiempo real de todos los servicios
pnpm run ps        # Estado de los containers

# Calidad de código
pnpm run check     # Lint + formateo (sin modificar archivos)
pnpm run format    # Formatea el código con Prettier

# Acceso a shells
pnpm run fe        # Shell en el container del frontend
pnpm run be        # Shell en el container del backend
pnpm run sql       # Consola MySQL interactiva
```

## Desarrollo

El proyecto usa pnpm workspaces con tres paquetes: `frontend/`, `backend/` y `shared/`.

### Frontend

```bash
cd frontend
pnpm run dev     # Servidor de desarrollo (puerto 5173)
pnpm run test    # Tests con Vitest
```

### Backend

```bash
cd backend
pnpm run start           # Node con --watch (puerto 8000)
pnpm test                # Jest + supertest
pnpm run prisma:studio   # Prisma Studio (explorador visual de la DB)
```

## Estructura

```
CAIS/
├── frontend/
│   └── src/
│       ├── features/       # Módulos por dominio
│       │   ├── authenticaction/
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
    └── migrations/         # Migraciones SQL
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

El backend toma la conexión a la base de datos desde `DATABASE_URL`. En Docker Compose ya está configurada. Para desarrollo local, crea `backend/.env`:

```env
DATABASE_URL="mysql://user:user@localhost:3307/cais"
```
