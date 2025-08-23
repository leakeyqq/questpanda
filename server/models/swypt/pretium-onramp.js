import mongoose from "mongoose";

const pretiumOnrampSchema = new mongoose.Schema({
    userAddress: {
        type: String,
        required: true
    },
    transactionCode: {
        type: String,
        required: true
    }
}, {timestamps: true})

const PretiumOnrampOrder = mongoose.model("pretiumOrders", pretiumOnrampSchema, 'pretiumOnramps')
export default PretiumOnrampOrder