/**
 * @file Jest globalTeardown — corre una vez al final del run completo.
 * Cierra la conexión de Prisma para que el proceso de jest pueda exit
 * limpio sin necesidad de --forceExit "duro" matando workers.
 *
 * No corre si jest es interrumpido con Ctrl-C; para ese caso queda como
 * fallback restart del backend container.
 *
 * NOTA: globalTeardown corre como módulo separado y NO aplica el
 * setupFiles: ['dotenv/config'] del jest.config. Cargamos dotenv aquí
 * para que prisma.js encuentre DATABASE_URL.
 */

import 'dotenv/config'
import { prisma } from '#config/prisma.js'

export default async function teardown() {
  await prisma.$disconnect()
}
