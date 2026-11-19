import { Router } from 'express'
import rateLimit from 'express-rate-limit'

import * as progressController from '../controllers/progressController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

// Quiz submissions are writes — tighter than the global read limit
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
})

router.get('/', asyncHandler(progressController.getProgress))
router.post('/learn-quiz', submitLimiter, asyncHandler(progressController.submitLearnQuiz))
router.post('/practice', submitLimiter, asyncHandler(progressController.submitPractice))

export default router