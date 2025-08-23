import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        walletAddress: {
            type: String,
            // unique: true,
            lowercase: true,
            trim: true,
            required: true
        },
        selfProtocol: {
            verified: {
                type: Boolean,
                default: false
            },
            countryOfUser: {
                type: String,
                required: false
            }
        }
    },{timestamps: true}
)

const User = mongoose.model("users", userSchema, "users")
export default User

