import express from "express"
const router = express.Router()

import {validate_createQuest, handleQuestCreation, getAllQuests, getSingleQuest, get3questsOnly, validate_questSubmission, submitQuestByCreator} from "../controllers/questController.js"
import {requestApprovalToJoinQuest} from "../controllers/approvalController.js"
import {requireAuth} from "../middleware/auth.js"

router.post("/create", requireAuth, validate_createQuest, handleQuestCreation)
router.get("/allQuests", getAllQuests)
router.get("/getSingleQuest/:questID", getSingleQuest)
router.get("/get3QuestsOnly", get3questsOnly)
router.post("/submitQuest/:questID",requireAuth, validate_questSubmission, submitQuestByCreator)
router.post('/applyQuest', requireAuth, requestApprovalToJoinQuest)

export default router;