import express from 'express'
const router = express.Router()

import {requireAuth} from "../middleware/auth.js"
import {creatorProfile, getSimulatedCreators, linkProfile} from "../controllers/creatorController.js"

router.get('/', requireAuth, creatorProfile)
router.get('/simulatedCreators', getSimulatedCreators)
router.post('/linkProfile', requireAuth, linkProfile)
export default router