import { Router } from 'express'
import { DashboardController } from '#controllers/dashboard.js'
import { requireAuth } from '#middleware/auth.js'

export const dashboardRouter = Router()

dashboardRouter.use(requireAuth)

dashboardRouter.get('/stats', DashboardController.getStats)
