// Espera a que la base de datos del contenedor responda. Multiplataforma:
// corre con Node (sin sintaxis de shell), así funciona igual en Windows, macOS
// y Linux. Reemplaza el `mysqladmin ... until ...` que dependía del shell.
import { spawnSync } from 'node:child_process'

const COMPOSE_FILE = 'docker-compose.dev.yml'
const MAX_TRIES = 60
const DELAY_MS = 1000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function dbResponds() {
  const res = spawnSync(
    'docker',
    [
      'compose',
      '-f',
      COMPOSE_FILE,
      'exec',
      '-T',
      'db',
      'mysqladmin',
      'ping',
      '-h',
      'localhost',
      '-u',
      'user',
      '-puser',
      '--silent',
    ],
    { stdio: 'ignore' }
  )
  return res.status === 0
}

for (let i = 1; i <= MAX_TRIES; i++) {
  if (dbResponds()) {
    console.log('Base de datos lista.')
    process.exit(0)
  }
  await sleep(DELAY_MS)
}

console.error(`La base de datos no respondió tras ${MAX_TRIES}s.`)
process.exit(1)
