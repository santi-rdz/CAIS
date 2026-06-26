import app from '#app'
import { prisma } from '#config/prisma.js'
import { serverConfig } from '#config/env.js'

const server = app.listen(serverConfig.port, () => {
  console.log(`Server is running on http://localhost:${serverConfig.port}`)
})

// Sin $disconnect, cada restart deja conexiones zombies hasta saturar MySQL.
async function gracefulShutdown(signal) {
  console.log(`Received ${signal}, shutting down gracefully...`)
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  setTimeout(() => {
    console.warn('Forced exit after timeout')
    process.exit(1)
  }, 5000).unref()
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
