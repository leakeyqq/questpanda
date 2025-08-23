import mongoose from "mongoose"

const creatorSchema = new mongoose.Schema({
    creatorAddress: {
        type: String,
        required: false
    },
    totalEarnings: {
        type: String,
        default: '0'
    },
    totalWithdrawn: {
        type: String,
        default: '0'
    },
    earningsBalance: {
        type: String,
        default: '0'
    },
    questsDone: [{
        _id: false,
        questID: {
            type: String,
            required: false
        },
        submissionRewarded: {
            type: Boolean,
            default: false
        },
        submissionRejected: {
            type: Boolean,
            default: false
        },
        rewardedAmount: {
            type: String,
            default: '0'
        },
        platformPosted: {
            type: String,
            required: false
        },
        videoUrl: {
            type: String,
            required: false
        },
        submittedOn: {
            type: Date,
            required: true
        },
        rewardedOn: {
            type: Date,
            required: false
        }
    }],
    myApplications: [{
        _id: false,
        questId: {type: String, required: false},
        approved: {type: Boolean, default: false},
        submittedOn: {type: Date, required: false},
        approvedOn: {type: Date, required: false}
    }],

    twitterData: {
        id: {type: String,required: false},
        name: {type: String,required: false},
        userName: {type: String,required: false},
        location: {type: String, required: false},
        url: {type: String, required: false},
        description: {type: String, required: false},
        protected: {type: Boolean, required: false},
        isVerified: {type: Boolean, required: false},
        isBlueVerified: {type: Boolean, required: false},
        followers: {type: Number, required: false},
        following: {type: Number, required: false},
        favouritesCount: {type: Number, required: false},
        statusesCount: {type: Number, required: false},
        mediaCount: {type: Number, required: false},
        createdAt: {type: Date, required: false},
        coverPicture: {type: String, required: false},
        profilePicture: {type: String, required: false},
        cloudinary_profilePicture: {type: String, required: false},
        canDm: {type: Boolean, required: false},
        isAutomated: {type: Boolean, required: false},
    },
    tiktokData: {
        id: {type: String, required: false},
        name: {type: String, required: false},
        userName: {type: String, required: false},
        profilePicture: {type: String, required: false},
        cloudinary_profilePicture: {type: String, required: false},
        createTime: {type: Date, required: false},
        verified: {type: Boolean, required: false},
        followers: {type: Number, required: false},
        following: {type: Number, required: false},
        heartCount: {type: Number, required: false},
        videoCount: {type: Number, required: false},
        diggCount: {type: Number, required: false},
        friendCount: {type: Number, required: false}
    },
    instagramData: {
        name: {type: String, required: false},
        userName: {type: String, required: false},
        profilePicture: {type: String, required: false},
        cloudinary_profilePicture: {type: String, required: false},
        createTime: {type: Date, required: false},
        followers: {type: Number, required: false},
        following: {type: Number, required: false},
    }
}, {timestamps: true})

const Creator = mongoose.model("creators", creatorSchema, 'creators')
export default Creator