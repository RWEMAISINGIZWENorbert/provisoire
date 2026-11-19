import { Router } from 'express'

import * as progressController from '../controllers/progressController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(progressController.getProgress))
router.post('/learn-quiz', asyncHandler(progressController.submitLearnQuiz))
router.post('/practice', asyncHandler(progressController.submitPractice))

export default router