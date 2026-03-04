FROM node:20-alpine

WORKDIR /app

EXPOSE 5173

CMD ["sh", "-c", "npm install && npm run dev"]

#! PROD
# FROM node:20-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 5173
# CMD ["npm", "run", "dev"]   

#? PROD
# FROM node:20-alpine AS builder

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]