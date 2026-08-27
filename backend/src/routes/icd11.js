import { Router } from 'express'
import { requireAuth } from '#middleware/auth.js'
import { validateQuery } from '#middleware/validate.js'
import { validateIcd11Search } from '@cais/shared/schemas/icd11'
import { Icd11Controller } from '#controllers/icd11.js'

export const icd11Router = new Router()

icd11Router.use(requireAuth)

// GET /icd11/search?q=... → [{ codigo, descripcion }]
icd11Router.get('/search', validateQuery(validateIcd11Search), Icd11Controller.search)
