# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24-alpine
ARG PNPM_VERSION=11.5.1

# =========================================================
# base — node + pnpm habilitado vía corepack
# =========================================================
FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
# Desactiva hooks de git que no aplican dentro del build (.git no se copia).
ENV HUSKY=0

# =========================================================
# deps — solo las del backend y su workspace tree
# Cachea el pnpm store con BuildKit para builds incrementales.
# =========================================================
FROM base AS deps
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY scripts ./scripts
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile --filter "backend..."

# =========================================================
# build — código + Prisma client + pnpm deploy --prod
# =========================================================
FROM deps AS build
COPY shared ./shared
COPY backend ./backend
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm --filter backend deploy --prod --legacy /out
# prisma está en dependencies → disponible en /out/node_modules.
# DATABASE_URL placeholder solo para generate (no conecta a la DB).
RUN cd /out && \
    DATABASE_URL='mysql://placeholder:placeholder@localhost:3306/placeholder' \
    node node_modules/prisma/build/index.js generate

# =========================================================
# prod — imagen final mínima, non-root, healthcheck real
# =========================================================
FROM node:${NODE_VERSION} AS prod
RUN apk add --no-cache wget tini && \
    addgroup -g 1001 -S app && \
    adduser -S app -u 1001 -G app
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000
COPY --from=build --chown=app:app /out ./
USER app
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8000/health >/dev/null 2>&1 || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
# migrate deploy aplica migraciones pendientes; exec reemplaza el shell con node
# para que tini gestione las señales correctamente.
CMD ["sh", "-c", "node node_modules/.bin/prisma migrate deploy && exec node src/server.js"]
