/**
 * @file Jest globalTeardown — corre una vez al final del run completo.
 * Cierra la conexión de Prisma para que el proceso de jest pueda exit
 * limpio sin necesidad de --forceExit "duro" matando workers.
 *
 * No corre si jest es interrumpido con Ctrl-C; para ese caso queda como
 * fallback restart del backend container.
 */

import { prisma } from '#config/prisma.js'

export default async function teardown() {
  await prisma.$disconnect()
}
