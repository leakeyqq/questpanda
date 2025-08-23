import mongoose from 'mongoose'

const poolDepositReceiptSchema = new mongoose.Schema({
    depositedByAddress: {
        type: String,
        required: true
    },
    amountUsd: {
        type: String,
        required: true,
    },
    txHash: {
        type: String,
        required: true
    },
    redeemed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const PoolDepositReceipt = mongoose.model("poolDepositReceipt", poolDepositReceiptSchema, "poolDeposits")
export default PoolDepositReceipt