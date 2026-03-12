# CAIS — Sistema de Administración

Sistema de administración interna para el Centro de Atención Integral para la Salud (CAIS) de la UABC. Gestiona usuarios (internos y coordinadores), pacientes, emergencias y expedientes clínicos.

## Stack

| Capa          | Tecnología                        |
| ------------- | --------------------------------- |
| Frontend      | React 19 + Vite + Tailwind CSS v4 |
| Backend       | Node.js + Express 5               |
| ORM           | Prisma                            |
| Base de datos | MySQL 8                           |
| Contenedores  | Docker + Docker Compose           |

## Requisitos

- Docker y Docker Compose instalados
- Node.js 20+ (solo para desarrollo local sin Docker)

## Inicio rápido

```bash
git clone https://github.com/santi-rdz/CAIS.git
cd CAIS

# Primer arranque (construye imágenes y levanta todo)
npm run restart
```

Los servicios quedan expuestos en:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- MySQL: puerto 3307 (usuario: `user`, contraseña: `user`)

## Comandos disponibles

```bash
npm run up        # Levanta los containers (sin rebuild)
npm run stop      # Detiene los containers
npm run down      # Baja los containers (conserva la DB)
npm run restart   # Rebuild + up (usar al cambiar Dockerfile o dependencias)
npm run fresh     # Reset total: borra volúmenes y reconstruye desde cero
npm run logs      # Logs en tiempo real de todos los servicios
npm run ps        # Estado de los containers

# Acceso a shells
npm run fe        # Shell en el container del frontend
npm run be        # Shell en el container del backend
npm run sql       # Consola MySQL interactiva
```

## Desarrollo

El proyecto usa npm workspaces. Los directorios `frontend/` y `backend/` son paquetes independientes con sus propias dependencias.

### Frontend

```bash
cd frontend
npm run dev     # Servidor de desarrollo (puerto 5173)
npm run test    # Tests con Vitest
npm run lint    # ESLint
```

### Backend

```bash
cd backend
npm run start           # Node con --watch (puerto 8000)
npm test                # Jest + supertest
npm run prisma:studio   # Prisma Studio (explorador visual de la DB)
```

## Estructura

```
CAIS/
├── frontend/
│   └── src/
│       ├── features/       # Módulos por dominio (users, emergencies, auth)
│       ├── pages/          # Componentes de ruta
│       ├── ui/             # Componentes reutilizables
│       ├── services/       # Llamadas a la API
│       └── hooks/          # Hooks compartidos
└── backend/
    └── src/
        ├── routes/         # Definición de rutas Express
        ├── controllers/    # Lógica de cada endpoint
        ├── services/       # Lógica de negocio
        ├── models/         # Modelos Prisma
        └── schemas/        # Validaciones Zod
```

## Variables de entorno

El backend toma la conexión a la base de datos desde `DATABASE_URL`. En Docker Compose ya está configurada. Para desarrollo local, crea `backend/.env`:

```env
DATABASE_URL="mysql://user:user@localhost:3307/cais"
```
