# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24-alpine
ARG NGINX_VERSION=1.27-alpine
ARG PNPM_VERSION=11.5.1

# =========================================================
# base
# =========================================================
FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV HUSKY=0

# =========================================================
# deps — solo las del frontend y su workspace tree
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
    pnpm install --frozen-lockfile --filter "frontend..."

# =========================================================
# build — vite build → dist estático
# =========================================================
FROM deps AS build
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
COPY shared ./shared
COPY frontend ./frontend
RUN pnpm --filter frontend run build

# =========================================================
# prod — nginx unprivileged (corre como UID 101, no root)
# =========================================================
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS prod
USER root
RUN apk add --no-cache wget
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/frontend/dist /usr/share/nginx/html
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/healthz >/dev/null 2>&1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
