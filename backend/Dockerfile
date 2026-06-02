FROM node:24-alpine

WORKDIR /app

EXPOSE 8000

CMD ["sh", "-c", "corepack enable && CI=true pnpm install && pnpm exec prisma generate && node --watch src/app.js"]


#? prod
# FROM node:24-alpine
# WORKDIR /app
# COPY package.json pnpm-lock.yaml ./
# RUN corepack enable && pnpm install --frozen-lockfile
# COPY . .
# EXPOSE 8000
# CMD ["pnpm", "run", "start"]
