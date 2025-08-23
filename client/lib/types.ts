export interface Quest {
  _id: string
  id: string
  title: string
  brand: string
  brandName: string
  category: string
  description: string
  longDescription?: string
  imageUrl: string
  brandImageUrl: string
  prizePool: string
  deadline: string
  endsOn: string
  submissions: string[]
  maxParticipants: number
  minFollowers: number
  prizePoolUsd: number
  pricePerVideo: number
  videosToReward: number
  requirements: string[]
  rewardCriteria: string
  featured?: boolean
  approvalNeeded?: boolean
  recentSubmissions?: {
    username: string
    date: string
    comment: string
    link: string
  }[]
  socialPlatformsAllowed: {
    twitter?: {
      allowedOnCampaign: boolean
      minFollowers: number
    };
    tiktok?: {
      allowedOnCampaign: boolean
      minFollowers: number
    };
    instagram?: {
      allowedOnCampaign: boolean
      minFollowers: number
    }
  }
  applicants: {
    userWalletAddress: string
    platform: string
    approved: boolean
    twitter?: {
      userName?: string
      name?: string
      isVerified?: boolean
      isBlueVerified?: boolean
      profilePicture?: string
      location?: string
      followers?: number
      following?: number
      description?: string
      createdAt?: Date
    };
    instagram?: {
      userName?: string
      name?: string
      userId?: string
      profilePicture?: string
      biography?: string
      following?: number
      followers?: number
    };
    tiktok?: {
      userId?: string
      userName?: string
      name?: string
      profilePicture?: string
      following?: number
      followers?: number
      createdAt?: string
    };
  }[];

  minFollowerCount: number
}
