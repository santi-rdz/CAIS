// Espera a que la base de datos del contenedor responda. Multiplataforma:
// corre con Node (sin sintaxis de shell), así funciona igual en Windows, macOS
// y Linux. Reemplaza el `mysqladmin ... until ...` que dependía del shell.
import { spawnSync } from 'node:child_process'

const COMPOSE_FILE = 'docker-compose.dev.yml'
const MAX_TRIES = 60
const DELAY_MS = 1000
// En un volumen nuevo, MySQL levanta un mysqld temporal para inicializar y
// luego lo reinicia con el real; un solo ping exitoso puede caer en ese hueco
// justo antes del reinicio y dar un falso "listo". Exigimos varios seguidos.
const STABLE_PINGS_REQUIRED = 3

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
      '127.0.0.1',
      '--protocol=TCP',
      '-u',
      'user',
      '-puser',
      '--silent',
    ],
    { stdio: 'ignore' }
  )
  return res.status === 0
}

let consecutive = 0
for (let i = 1; i <= MAX_TRIES; i++) {
  if (dbResponds()) {
    consecutive++
    if (consecutive >= STABLE_PINGS_REQUIRED) {
      console.log('Base de datos lista.')
      process.exit(0)
    }
  } else {
    consecutive = 0
  }
  await sleep(DELAY_MS)
}

console.error(`La base de datos no respondió tras ${MAX_TRIES}s.`)
process.exit(1)
