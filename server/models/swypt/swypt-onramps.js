import mongoose from "mongoose";

const swyptOnrampSchema = new mongoose.Schema({
    userAddress: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['initiated', 'success', 'pending', 'failed', 'cancelled'],
        default: 'initiated'
    },
    cryptoTransferred: {
        type: Boolean,
        default: false
    },
    MpesaReceiptNumber: {
        type: String,
        required: false
    },
    hash: {
        type: String,
        required: false
    },
    cryptoAmount: {
        type: String,
        required: false
    }
}, {timestamps: true})

const SwyptOnrampOrder = mongoose.model("swyptOrders", swyptOnrampSchema, "swyptOnrampOrders")
export default SwyptOnrampOrder