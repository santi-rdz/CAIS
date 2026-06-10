# Entorno local

Backend y frontend corren **nativos** (Node + Vite). Solo MySQL queda en Docker.

## Requisitos

- Node `>=24` (usa el `.nvmrc`: `nvm use`)
- pnpm `11.5.1` (Corepack: `corepack enable`)
- Docker Desktop

## 1. Limpiar Docker viejo

Elimina contenedores, volúmenes e imágenes del setup anterior multi-container:

```bash
docker rm -f cais_db cais_backend cais_frontend cais_db_dev 2>/dev/null
docker volume rm cais_db_data cais_db_data_dev 2>/dev/null
docker rmi cais2-backend cais2-frontend cais-backend cais-frontend 2>/dev/null
docker network prune -f
```

> Si tienes otros nombres, lístalos con `docker ps -a`, `docker volume ls`, `docker images | grep cais`.

## 2. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` solo si necesitas SMTP real. Los defaults sirven para dev.

## 3. Instalar dependencias

```bash
pnpm install
```

## 4. Levantar el entorno

```bash
pnpm dev
```

Esto:

1. Levanta el contenedor de MySQL (`docker-compose.dev.yml`, puerto `3307`).
2. Inicia el backend (`localhost:8000`) y frontend (`localhost:5173`) en paralelo.

## Comandos útiles

| Comando         | Qué hace                               |
| --------------- | -------------------------------------- |
| `pnpm dev`      | DB + backend + frontend                |
| `pnpm db:up`    | Solo levanta la DB                     |
| `pnpm db:down`  | Detiene la DB (conserva volumen)       |
| `pnpm db:fresh` | Borra volumen + recrea DB + corre seed |
| `pnpm db:sql`   | Consola MySQL (`pwd: user`)            |
| `pnpm db:logs`  | Logs de la DB                          |
| `pnpm seed`     | Re-ejecuta `prisma/seed.js`            |
| `pnpm check`    | Lint + format check del monorepo       |

## Primer arranque

```bash
pnpm install
pnpm db:up
pnpm db:wait
pnpm seed
pnpm dev
```

Después de eso, solo `pnpm dev`.
