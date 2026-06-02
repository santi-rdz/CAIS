FROM node:24-alpine

WORKDIR /app

EXPOSE 5173

CMD ["sh", "-c", "corepack enable && CI=true pnpm install && pnpm run dev"]

#! PROD
# FROM node:24-alpine
# WORKDIR /app
# COPY package.json pnpm-lock.yaml ./
# RUN corepack enable && pnpm install --frozen-lockfile
# COPY . .
# EXPOSE 5173
# CMD ["pnpm", "run", "dev"]   

#? PROD
# FROM node:24-alpine AS builder

# WORKDIR /app
# COPY package.json pnpm-lock.yaml ./
# RUN corepack enable && pnpm install --frozen-lockfile
# COPY . .
# RUN pnpm run build

# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
