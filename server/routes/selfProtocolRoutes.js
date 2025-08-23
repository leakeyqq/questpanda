import express from 'express'
const router = express.Router()

import {requireAuth} from "../middleware/auth.js"
import { verificationSuccessful, verificationStatus } from "../controllers/selfController.js"

router.post('/success', requireAuth, verificationSuccessful)
router.get('/verificationStatus', requireAuth, verificationStatus)

export default router