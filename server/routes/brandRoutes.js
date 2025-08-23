import express from "express"
const router = express.Router()

import {fetchMyCreatedQuests, fetchMySingleCreatedQuest, getTotalFundsSpent,
    validate_rewardCreator, rewardCreator

} from "../controllers/brandController.js"
import {requireAuth} from "../middleware/auth.js"

router.get('/myCreatedQuests', requireAuth, fetchMyCreatedQuests)
router.get('/mySingleCreatedQuest/:questID', requireAuth, fetchMySingleCreatedQuest )
router.get('/getTotalFundsSpent',requireAuth, getTotalFundsSpent)
router.post('/rewardCreator', requireAuth, validate_rewardCreator, rewardCreator )

export default router