import mongoose from "mongoose"

const simulatedCreatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    cloudy_profilePicture: {
        type: String,
        required: false
    },
    platform: {
        type: String,
        required: true
    },
    followers: {
        type: Number,
        required: false
    }
})

const SimulatedCreator = mongoose.model("simulatedCreators", simulatedCreatorSchema, 'simulatedCreators')

export default SimulatedCreator