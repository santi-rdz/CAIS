import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// En dev nativo, .env vive en la raíz del monorepo (../../../).
// En prod (docker), las env vars vienen del runtime → este config() es no-op.
const here = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.resolve(here, '../../..')

dotenv.config({ path: path.join(monorepoRoot, '.env'), quiet: true })
