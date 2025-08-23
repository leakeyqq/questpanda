import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
    createdByAddress: {
        type: String,
        required: true
    },
    onchain_id: {
        type: String,
        required: false
    },
    brandName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    brandImageUrl: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    rewardCriteria: {
        type: String,
        required: false
    },
    prizePoolUsd: {
        type: String,
        required: String
    },
    rewardToken: {
        type: String,
        required: false
    },
    pricePerVideo: {
        type: String,
        required: false
    },
    videosToBeAwarded: {
        type: Number,
        required: false
    },
    approvalNeeded: {
        type: Boolean, 
        default: false
    },
    solanaNetwork: {
        usedSolana: {
            type: Boolean,
            required: false
        },
        txId: {
            type: String,
            required: false
        }
    },
    socialPlatformsAllowed:{
        twitter: {
            allowedOnCampaign: {type: Boolean, required: false},
            minFollowers: {type: Number, required: false}
        },
        tiktok: {
            allowedOnCampaign: {type: Boolean, required: false},
            minFollowers: {type: Number, required: false}
        },
        instagram: {
            allowedOnCampaign: {type: Boolean, required: false},
            minFollowers: {type: Number, required: false}
        }
    }, 
    applicants: [{
        _id: false,
        userWalletAddress: {
            type: String,
            required: false
        },
        platform: {
            type: String,
            required: false
        },
        approved: {
            type: Boolean,
            default: false
        },
        rejected: {
            type: Boolean,
            default: false
        },
        twitter: {
            userName: {type: String, required: false},
            name: {type: String, required: false},
            isVerified: {type: Boolean, required: false},
            isBlueVerified: {type: Boolean, required: false},
            profilePicture: {type: String, required: false},
            cloudinary_profilePicture: {type: String, required: false},
            location: {type: String, required: false},
            followers: {type: Number, required: false},
            following: {type: Number, required: false},
            description: {type: String, required: false},
            createdAt: {type: Date, required: false}
        },
        instagram: {
            userName: {type: String, required: false},
            name: {type: String, required: false},
            userId: {type: String, required: false},
            profilePicture: {type: String, required: false},
            cloudinary_profilePicture: {type: String, required: false},
            biography: {type: String, required: false},
            following: {type: Number, required: false},
            followers: {type: Number, required: false}
        },
        tiktok: {
            userId: {type: String, required: false},
            userName: {type: String, required: false},
            name: {type: String, required: false},
            profilePicture: {type: String, required: false},
            cloudinary_profilePicture: {type: String, required: false},
            following: {type: Number, required: false},
            followers: {type: Number, required: false},
            createdAt: {type: String, required: false}
        }
    }],
    submissions: [
        {
            submittedByAddress: {
                type: String,
                required: false
            },
            socialPlatformName: {
                type: String,
                required: false
            },
            videoLink: {
                type: String,
                required: false
            },
            comments: {
                type: String,
                required: false
            },
            rewarded: {
                type: Boolean,
                default: false
            },
            rewardAmountUsd: {
                type: String,
                default: '0'
            },
            submissionRead: {
                type: Boolean,
                default: false
            },
            submittedAtTime: {
                type: Date,
                required: false
            },
            rewardedAtTime:{
                type: Date,
                required: false
            },
            socialStatsLastUpdated: {
                type: Date,
                required: false
            },
            rejected: {
                type: Boolean,
                required: false
            },
            twitterData: {
                id: {type: String, required: false},
                text: {type: String, required: false},
                retweetCount: {type: Number, required: false},
                replyCount: {type: Number, required: false},
                likeCount: {type: Number, required: false},
                quoteCount: {type: Number, required: false},
                viewCount: {type: Number, required: false},
                createdAt: {type: Date, required: false},
                lang: {type: String, required: false},
                bookmarkCount: {type: Number, required: false},
                isReply: {type: Boolean, required: false},
                isPinned: {type: Boolean, required: false},
                isRetweet: {type: Boolean, required: false},
                isQuote: {type: Boolean, required: false},
                isConversationControlled: {type: Boolean, required: false},
                author: {
                    userName: {type: String, required: false},
                    id: {type: String, required: false},
                    name: {type: String, required: false},
                    isVerified: {type: Boolean, required: false},
                    isBlueVerified: {type: Boolean, required: false},
                    profilePicture: {type: String, required: false},
                    cloudinary_profilePicture: {type: String, required: false},
                    location: {type: String, required: false},
                    followers: {type: Number, required: false},
                    following: {type: Number, required: false}
                }
            },
            tiktokData: {
                id: {type: String, required: false},
                createdAt: {type: Date, required: false},
                author: {
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
                likeCount: {type: Number, required: false},
                shareCount: {type: Number, required: false},
                replyCount: {type: Number, required: false},
                viewCount: {type: Number, required: false},
                bookmarkCount: {type: Number, required: false},
                repostCount: {type: Number, required: false},
                locationCreated: {type: String, required: false}
            },
            instagramData: {
                createdAt: {type: Date, required: false},
                author: {
                    id: {type: String, required: false},
                    name: {type: String, required: false},
                    userName: {type: String, required: false},
                    profilePicture: {type: String, required: false},
                    cloudinary_profilePicture: {type: String, required: false},
                    createTime: {type: Date, required: false},
                    followers: {type: Number, required: false},
                    following: {type: Number, required: false},
                },
                likeCount: {type: Number, required: false},
                shareCount: {type: Number, required: false},
                replyCount: {type: Number, required: false},
                viewCount: {type: Number, required: false},
                locationCreated: {type: String, required: false}
            }
        }
    ],
    minFollowerCount: {
        type: Number,
        default: 0
    },
    visibleOnline: {
        type: Boolean,
        default: false
    },
    endsOn: {
        type: Date,
        required: true
    },
    network: {
        type: String,
        enum: ['celo', 'solana'],
        default: false
    }
}, {timestamps: true})

const Quest = mongoose.model("quests", questSchema, "quests")
export default Quest