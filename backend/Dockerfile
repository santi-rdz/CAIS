FROM node:20-alpine

WORKDIR /app

EXPOSE 8000

CMD ["sh", "-c", "npm install && npx prisma generate && node --watch src/app.js"]


#? prod
# FROM node:20-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 8000
# CMD ["npm", "run", "start"]
