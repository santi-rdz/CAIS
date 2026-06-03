FROM node:24-alpine AS dev

RUN corepack enable && corepack prepare pnpm@11.5.1 --activate

WORKDIR /app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:8000/health >/dev/null 2>&1 || exit 1

CMD ["sh", "-c", "pnpm install --frozen-lockfile && pnpm --filter backend exec prisma generate && pnpm --filter backend run start"]


#? PROD (multi-stage)
# FROM node:24-alpine AS builder
# RUN corepack enable && corepack prepare pnpm@11.5.1 --activate
# WORKDIR /app
# COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# COPY backend/package.json ./backend/
# COPY shared/package.json ./shared/
# RUN pnpm install --frozen-lockfile --filter backend...
# COPY . .
# RUN pnpm --filter backend exec prisma generate

# FROM node:24-alpine AS prod
# RUN corepack enable
# WORKDIR /app
# COPY --from=builder /app /app
# USER node
# EXPOSE 8000
# HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
#   CMD wget -qO- http://localhost:8000/health >/dev/null 2>&1 || exit 1
# CMD ["node", "backend/src/app.js"]
