import { Router } from 'express'
import { EvolutionNoteController } from '../../controllers/evolutionNotes.js'
import { requireAuth } from '../../middleware/auth.js'

export const evolutionNotesRouter = Router()

evolutionNotesRouter.use(requireAuth)

evolutionNotesRouter.post('/', EvolutionNoteController.create)
evolutionNotesRouter.get('/', EvolutionNoteController.getAll)
evolutionNotesRouter.get('/:id', EvolutionNoteController.getById)
evolutionNotesRouter.patch('/:id', EvolutionNoteController.update)
