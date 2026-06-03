FROM node:24-alpine AS dev

RUN corepack enable && corepack prepare pnpm@11.5.1 --activate

WORKDIR /app

EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:5173 >/dev/null 2>&1 || exit 1

CMD ["sh", "-c", "pnpm install --frozen-lockfile && pnpm --filter frontend run dev"]


#? PROD (multi-stage, nginx)
# FROM node:24-alpine AS builder
# RUN corepack enable && corepack prepare pnpm@11.5.1 --activate
# WORKDIR /app
# COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# COPY frontend/package.json ./frontend/
# COPY shared/package.json ./shared/
# RUN pnpm install --frozen-lockfile --filter frontend...
# COPY . .
# RUN pnpm --filter frontend run build

# FROM nginx:alpine AS prod
# COPY --from=builder /app/frontend/dist /usr/share/nginx/html
# EXPOSE 80
# HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
#   CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
# CMD ["nginx", "-g", "daemon off;"]
