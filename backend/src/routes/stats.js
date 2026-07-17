import { Router } from 'express'
import { StatsController } from '#controllers/stats.js'
import { requireAuth } from '#middleware/auth.js'

export const statsRouter = Router()

statsRouter.use(requireAuth)

statsRouter.get('/', StatsController.getStats)
