import express from "express"
const router = express.Router()

import {getSwyptExchangeRate, onRampUserWithMpesa, transferFundsAfterMpesaPayment} from "../controllers/swyptController.js"
import {requireAuth} from "../middleware/auth.js"

router.get('/exchangeRate', getSwyptExchangeRate)
router.post('/sendStkPush', requireAuth, onRampUserWithMpesa)
router.post('/completeMpesaPayment', requireAuth, transferFundsAfterMpesaPayment)

export default router;