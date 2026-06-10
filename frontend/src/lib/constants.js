export { PAGE_SIZE } from '@cais/shared/constants/pagination'

// Dev nativo: el backend corre en localhost:8000.
// Prod: nginx proxea /api → backend; mismo origen, sin CORS.
export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
