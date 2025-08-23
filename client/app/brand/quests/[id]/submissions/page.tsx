'use client'
import Link from "next/link"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"
import { CopyButton } from "@/components/copyButton"
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useWeb3 } from "@/contexts/useWeb3"
import {useAlert} from "@/components/custom-popup"
import { useRouter } from 'next/navigation';
import {useConfirm} from '@/components/custom-confirm'


import { 
  FaYoutube, 
  FaTwitter, 
  FaInstagram, 
  FaTiktok,
  FaTwitch,
  FaFacebook,
  FaGlobe 
} from 'react-icons/fa';

type PlatformIconProps = {
  platform?: string;
  className?: string;
};

export const SocialPlatformIcon = ({ platform, className }: PlatformIconProps) => {
  if (!platform) return <FaGlobe className={className} />;
  
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('youtube')) return <FaYoutube className={className} />;
  if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <FaTwitter className={className} />;
  if (platformLower.includes('instagram')) return <FaInstagram className={className} />;
  if (platformLower.includes('tiktok')) return <FaTiktok className={className} />;
  
  return <FaGlobe className={className} />;
};

export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return 'Anonymous';
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};
export const formatDateString = (dateString?: string) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString; // fallback to raw string if parsing fails
  }
};
export const formatLastUpdated = (date: Date) => {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const day = days[date.getDay()];
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert 0 to 12
  return `${day} ${hours}.${minutes}${ampm}`;
};

interface SubmissionsPageProps {
  params: {
    id: string
  }
}

interface Submission {
  _id?: string
  submittedByAddress: string
  socialPlatformName?: string
  videoLink?: string
  submittedAtTime?: string
  comments?: string
  rewarded?: boolean
  rewardAmountUsd?: string
  submissionRead?: boolean
  rewardedAtTime?: Date,
  twitterData?: {
    id?: string
    text?: string
    retweetCount?: number
    replyCount?: number
    likeCount?: number
    quoteCount?: number
    viewCount?: number
    createdAt?: Date
    lang?: string
    bookmarkCount?: number
    statsLastUpdated?: Date,
    author?: {
      userName?: string
      id?: string
      name?: string
      isVerified?: boolean
      isBlueVerified?: boolean
      profilePicture?: string
      location?: string
      followers?: number
      following?: number
    }
  }
  tiktokData?: {
    id?: string
    createTime?: Date
    author?: {
      id?: string
      uniqueId?: string
      nickname?: string
      avatarThumb?: string
      createTime?: Date
      verified?: boolean
      followerCount?: number
      followingCount?: number
      heartCount?: number
      videoCount?: number
      diggCount?: number
      friendCount?: number
    }
    diggCount?: number
    shareCount?: number
    commentCount?: number
    playCount?: number
    collectCount?: number
    repostCount?: number
    locationCreated?: string
    statsLastUpdated?: Date
  }
}



export default function SubmissionsPage({ 
  params 
}: { 
  params: { id: string } 
}){
  const [loading, setLoading] = useState(false)
  const [quest, setQuest] = useState<any>(null)
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([])
  const [approvedSubmissions, setApprovedSubmissions] = useState<Submission[]>([])
  const { showAlert, AlertComponent } = useAlert()
  const [rewarding, setRewarding] = useState(false);
  const { showConfirm, ConfirmComponent } = useConfirm()
  
  const router = useRouter();
    const { rewardCreator } = useWeb3();
    


  // const quest = quests.find((q) => q.id === params.id)

  useEffect(() => {
    const fetchSubmissions = async ()=>{
      try{
        setLoading(true)
        const awaitedParams = await params; // Properly await params first

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brand/mySingleCreatedQuest/${awaitedParams.id}`, {
          credentials: "include",
        });
        
        const data = await res.json();

        const fetchedQuest = data.quest;

        if (!fetchedQuest) {
          notFound()
        }
        setQuest(fetchedQuest)
        setPendingSubmissions(fetchedQuest.submissions.filter((s: Submission) => !s.rewarded))
        setApprovedSubmissions(fetchedQuest.submissions.filter((s: Submission) => s.rewarded))   
      }catch(e){
        console.log(e)
      }finally{
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [params])
  

          // Helper function to format numbers
        const formatNumber = (num?: number): string => {
          if (!num) return "0"
          if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M"
          }
          if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K"
          }
          return num.toString()
        }

          // Helper function to get creator data
        const getCreatorData = (submission: Submission) => {
          if (submission.twitterData?.author) {
            return {
              name: submission.twitterData.author.name || submission.twitterData.author.userName || "Unknown",
              username: submission.twitterData.author.userName || "",
              profilePic: submission.twitterData.author.profilePicture || "",
              followers: submission.twitterData.author.followers || 0,
              following: submission.twitterData.author.following || 0,
              verified: submission.twitterData.author.isVerified || submission.twitterData.author.isBlueVerified || false,
              platform: "Twitter",
            }
          }

        if (submission.tiktokData?.author) {
          return {
            name: submission.tiktokData.author.nickname || submission.tiktokData.author.uniqueId || "Unknown",
            username: submission.tiktokData.author.uniqueId || "",
            profilePic: submission.tiktokData.author.avatarThumb || "",
            followers: submission.tiktokData.author.followerCount || 0,
            following: submission.tiktokData.author.followingCount || 0,
            verified: submission.tiktokData.author.verified || false,
            platform: "TikTok",
          }
    }

    return null
        }

        // Helper function to get video metrics
      const getVideoMetrics = (submission: Submission) => {
        if (submission.twitterData) {
          return {
            views: submission.twitterData.viewCount || 0,
            likes: submission.twitterData.likeCount || 0,
            comments: submission.twitterData.replyCount || 0,
            platform: "Twitter",
            lastUpdated: submission.twitterData.statsLastUpdated || new Date()
          }
        }

        if (submission.tiktokData) {
          return {
            views: submission.tiktokData.playCount || 0,
            likes: submission.tiktokData.diggCount || 0,
            comments: submission.tiktokData.commentCount || 0,
            platform: "TikTok",
            lastUpdated: submission.tiktokData.statsLastUpdated || new Date()
          }
        }

        return null
      }
  if (loading) {
    return <div>Fetching quest submissions...</div>
  }

  if (!quest) {
    return <div>Quest not found</div>
  }
    const handleRewardCreator = async (e: React.FormEvent, creatorAddress: string, questOnChainId: string, pricePerVideo: string, questId: string) => {
     try {
      e.preventDefault();
      setRewarding(true)

      const confirmReward = await showConfirm(`Confirm that you are rewarding this creator ${pricePerVideo} USD?`)
      if(!confirmReward) return

      if(!creatorAddress){
          await showAlert("Missing creator Address!")
          return;
      }else if(!questOnChainId){
          await showAlert("Missing onchain id! This is an old version. Please contact support!")
          return;
      }


      // Send tx to db
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brand/rewardCreator`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // send cookies for auth
          body: JSON.stringify({
            questOnChainId,
            creatorAddress,
          }),
        });

        const data = await res.json();
        const tokenSymbol = data.tokenSymbol; // e.g., 'cUSD'

        await rewardCreator(questOnChainId, pricePerVideo, creatorAddress, tokenSymbol)

     } catch (error) {
      throw error
     }finally{
      setRewarding(false)
      router.replace(`${location.pathname}?t=${Date.now()}`)
     }
  }

  return (
    <div className="min-h-screen bg-brand-light">
        <ConfirmComponent />
        <AlertComponent/>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/brand/dashboard" className="text-brand-purple hover:text-brand-pink flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">Submissions for {quest.title}</h1>
            <p className="text-gray-600">Review and manage creator submissions</p>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
            >
              <Link href={`/brand/quests/${quest._id}/edit`}>Edit Quest</Link>
            </Button>
            {/* <Button asChild className="bg-brand-purple hover:bg-brand-purple/90 text-white">
              <Link href={`/brand/quests/${quest._id}/analytics`}>View Analytics</Link>
            </Button> */}
          </div>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-brand-dark">Quest Overview</CardTitle>
            {/* <CardDescription className="text-gray-600">{quest.description}</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Total prize Pool</p>
                <p className="text-xl font-bold text-brand-purple">{quest.prizePoolUsd} <CurrencyDisplay/></p>
              </div>
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Deadline</p>
                <p className="text-xl font-bold text-brand-dark">{new Date(quest.endsOn).toLocaleDateString()}</p>
              </div>
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Total Submissions</p>
                <p className="text-xl font-bold text-brand-dark">{quest.submissions.length}</p>
              </div>
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Winners</p>
                <p className="text-xl font-bold text-brand-dark">{quest.videosToBeAwarded}</p>
              </div>
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Reward per winner</p>
                <p className="text-xl font-bold text-brand-dark">{quest.pricePerVideo}<CurrencyDisplay/></p>
              </div>
              {/* <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Not rewarded</p>
                <p className="text-xl font-bold text-brand-yellow">{pendingSubmissions.length}</p>
              </div> */}
            </div>
          </CardContent>
        </Card>

<div
  className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400"
  role="alert">
  {/* <div className="font-medium mb-1">Engagement metrics🔐</div> */}

  <div className="flex items-center flex-wrap gap-2">
    <span>You can view the engagements for videos posted on X. We are working towards adding support for other platforms...</span>
  </div>
</div>



        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="pending">Not rewarded ({pendingSubmissions.length})</TabsTrigger>
            <TabsTrigger value="approved">Rewarded ({approvedSubmissions.length})</TabsTrigger>
            {/* <TabsTrigger value="rejected">Rejected (2)</TabsTrigger> */}
          </TabsList>



          <TabsContent value="pending" className="mt-4">
            <div className="space-y-4">
              {pendingSubmissions.map((submission: Submission) => {
                const creatorData = getCreatorData(submission)
                const videoMetrics = getVideoMetrics(submission)

                return (
                  <div key={submission._id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-4">
                        {/* Creator Profile Section */}
                        <div className="flex items-center gap-3">
                          {creatorData?.profilePic ? (
                            <img
                              src={creatorData.profilePic || "/placeholder.svg"}
                              alt={creatorData.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold">
                              {creatorData?.name?.charAt(0) || shortenAddress(submission.submittedByAddress).charAt(0)}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-brand-dark">
                                {creatorData?.name || shortenAddress(submission.submittedByAddress)}
                              </h3>
                              {creatorData?.verified && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-blue-500"
                                >
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              )}
                            </div>

                            {creatorData?.username && <p className="text-gray-600 text-sm">@{creatorData.username}</p>}

                            {/* Follower Stats */}
                            {creatorData && (
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-gray-600">
                                  <span className="font-medium text-brand-purple">
                                    {formatNumber(creatorData.followers)}
                                  </span>{" "}
                                  followers
                                </span>
                                {/* <span className="text-xs text-gray-600">
                                  <span className="font-medium text-brand-dark">
                                    {formatNumber(creatorData.following)}
                                  </span>{" "}
                                  following
                                </span> */}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/*<Badge className="bg-brand-yellow text-brand-dark">Not rewarded</Badge>*/}
                    {/* <div className="flex flex-col gap-2 items-end">
                      <Button size="sm" className="bg-brand-teal hover:bg-brand-teal/90 text-white">
                        Reward
                      </Button>
                      <Button size="sm" className="bg-brand-pink hover:bg-brand-pink/90 text-white">
                        Reject
                      </Button>
                    </div> */}

                    <div className="flex flex-col gap-2 items-end w-full max-w-[60px]">
                    {/* <Button
                      size="sm"
                      variant="outline"
                      className="w-full  border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
                    >
                      Reward
                    </Button> */}
                    <form onSubmit={(e) => handleRewardCreator(e, submission.submittedByAddress, quest.onchain_id, quest.pricePerVideo, quest._id)}>
                      <Button type="submit" size="sm" className="bg-brand-teal hover:bg-brand-teal/90 text-white" disabled={rewarding}>
                        {/* {rewarding ? "Rewarding creator..." :
                        "Reward"
                        } */}
                        Reward
                      </Button>
                    </form>
                    
                    {/* <Button
                      size="sm"
                      variant="outline"
                      className="w-full border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white"
                    >
                      Reject
                    </Button> */}
                  </div>


                    </div>

                    {/* Submission Details */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">

                    
                      <span>{creatorData?.platform}</span>
                      <SocialPlatformIcon platform={submission.socialPlatformName} className="w-4 h-4"/>
                      {/*<span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-1 rounded">
                        {submission.socialPlatformName}
                      </span>*/}


                      <span className="bg-brand-light  rounded-lg">
                      <a
                        href={submission.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center font-medium"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="m22 8-6 4 6 4V8Z"></path>
                          <rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect>
                        </svg>
                        Watch
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </a>
                    </span>







                      <span className="">
                        <button
                          onClick={() => {
                            if (submission.videoLink) {
                              navigator.clipboard.writeText(submission.videoLink)
                            }
                          }}
                          className="text-gray-500 hover:text-brand-purple transition-colors"
                          title="Copy video link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </span>
                    </div>

                    {/* Video Metrics */}
                    {videoMetrics && submission.socialPlatformName?.toLowerCase() == 'twitter' &&(
                      <div className="bg-brand-light p-3 rounded-lg mb-3">
                        {/* <h4 className="text-xs font-medium text-brand-dark mb-2">Last updated on {formatLastUpdated(new Date(videoMetrics.lastUpdated))}</h4> */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-brand-purple mr-1"
                              >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </div>
                            <p className="text-base font-bold text-dark">{formatNumber(videoMetrics.views)}</p>
                            <p className="text-xs text-gray-600">Views</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-brand-pink mr-1"
                              >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                            </div>
                            <p className="text-base font-bold text-brand-pink">{formatNumber(videoMetrics.likes)}</p>
                            <p className="text-xs text-gray-600">Likes</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-brand-teal mr-1"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                            </div>
                            <p className="text-base font-bold text-dark">{formatNumber(videoMetrics.comments)}</p>
                            <p className="text-xs text-gray-600">Comments</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* No Data Available Message */}
                    {!videoMetrics && !creatorData && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3 text-center">
                        <p className="text-gray-600 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="inline mr-2 text-gray-400"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          Social media metrics not available for this submission
                        </p>
                      </div>
                    )}

                  </div>
                )
              })}
            </div>
          </TabsContent>
          

          <TabsContent value="approved" className="mt-4">
            {/* <div className="space-y-4">
              {approvedSubmissions.map((submission: Submission) => (
                <div key={submission._id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge className="bg-brand-teal text-white mb-2">Approved</Badge>
                      <h3 className="text-lg font-bold text-brand-dark">{submission.submittedByAddress}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Submitted {submission.submittedAtTime}</span>
                        <span>•</span>
                        <span>via {submission.socialPlatformName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-brand-purple font-bold">{submission.rewardAmountUsd} USD awarded</div>
                    </div>
                  </div>

                  <div className="bg-brand-light p-3 rounded-lg mb-3">
                    <a
                      href={submission.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center mt-1"
                    >
                      {submission.videoLink}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <path d="M7 7h10v10"></path>
                        <path d="M7 17 17 7"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div> */}

              <div className="space-y-4">
              {approvedSubmissions.map((submission: Submission) => {
                const creatorData = getCreatorData(submission)
                const videoMetrics = getVideoMetrics(submission)

                return (
                  <div key={submission._id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-4">
                        {/* Creator Profile Section */}
                        <div className="flex items-center gap-3">
                          {creatorData?.profilePic ? (
                            <img
                              src={creatorData.profilePic || "/placeholder.svg"}
                              alt={creatorData.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold">
                              {creatorData?.name?.charAt(0) || shortenAddress(submission.submittedByAddress).charAt(0)}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-brand-dark">
                                {creatorData?.name || shortenAddress(submission.submittedByAddress)}
                              </h3>
                              {creatorData?.verified && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-blue-500"
                                >
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              )}
                            </div>

                            {creatorData?.username && <p className="text-gray-600 text-sm">@{creatorData.username}</p>}

                            {/* Follower Stats */}
                            {creatorData && (
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-gray-600">
                                  <span className="font-medium text-brand-purple">
                                    {formatNumber(creatorData.followers)}
                                  </span>{" "}
                                  followers
                                </span>
                                {/* <span className="text-xs text-gray-600">
                                  <span className="font-medium text-brand-dark">
                                    {formatNumber(creatorData.following)}
                                  </span>{" "}
                                  following
                                </span> */}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/*<Badge className="bg-brand-yellow text-brand-dark">Not rewarded</Badge>*/}
                    {/* <div className="flex flex-col gap-2 items-end">
                      <Button size="sm" className="bg-brand-teal hover:bg-brand-teal/90 text-white">
                        Reward
                      </Button>
                      <Button size="sm" className="bg-brand-pink hover:bg-brand-pink/90 text-white">
                        Reject
                      </Button>
                    </div> */}

                    <div className="flex flex-col gap-2 items-end w-full max-w-[60px]">
                    {/* <Button
                      size="sm"
                      variant="outline"
                      className="w-full  border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
                    >
                      Reward
                    </Button> */}
                    {quest.pricePerVideo} USD
                  </div>


                    </div>

                    {/* Submission Details */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">

                    
                      <span>{creatorData?.platform}</span>
                      <SocialPlatformIcon platform={submission.socialPlatformName} className="w-4 h-4"/>
                      {/*<span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-1 rounded">
                        {submission.socialPlatformName}
                      </span>*/}


                      <span className="bg-brand-light  rounded-lg">
                      <a
                        href={submission.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center font-medium"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="m22 8-6 4 6 4V8Z"></path>
                          <rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect>
                        </svg>
                        Watch
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </a>
                    </span>







                      <span className="">
                        <button
                          onClick={() => {
                            if (submission.videoLink) {
                              navigator.clipboard.writeText(submission.videoLink)
                            }
                          }}
                          className="text-gray-500 hover:text-brand-purple transition-colors"
                          title="Copy video link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </span>
                    </div>

                    {/* Video Metrics */}
                    {videoMetrics && submission.socialPlatformName?.toLowerCase() == 'twitter' &&(
                      <div className="bg-brand-light p-3 rounded-lg mb-3">
                        {/* <h4 className="text-xs font-medium text-brand-dark mb-2">Last updated on {formatLastUpdated(new Date(videoMetrics.lastUpdated))}</h4> */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-brand-purple mr-1"
                              >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </div>
                            <p className="text-base font-bold text-dark">{formatNumber(videoMetrics.views)}</p>
                            <p className="text-xs text-gray-600">Views</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-brand-pink mr-1"
                              >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                            </div>
                            <p className="text-base font-bold text-brand-pink">{formatNumber(videoMetrics.likes)}</p>
                            <p className="text-xs text-gray-600">Likes</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-brand-teal mr-1"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                            </div>
                            <p className="text-base font-bold text-dark">{formatNumber(videoMetrics.comments)}</p>
                            <p className="text-xs text-gray-600">Comments</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* No Data Available Message */}
                    {!videoMetrics && !creatorData && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3 text-center">
                        <p className="text-gray-600 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="inline mr-2 text-gray-400"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          Social media metrics not available for this submission
                        </p>
                      </div>
                    )}

                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* <TabsContent value="rejected" className="mt-4">
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge className="bg-red-500 text-white mb-2">Rejected</Badge>
                      <h3 className="text-lg font-bold text-brand-dark">rejected_user{item}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Submitted 1 week ago</span>
                        <span>•</span>
                        <span>via Instagram</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-light p-3 rounded-lg mb-3">
                    <p className="text-gray-700">This is my submission for your quest. Hope you like it!</p>
                    <a
                      href="#"
                      className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center mt-1"
                    >
                      https://example.com/rejected{item}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <path d="M7 7h10v10"></path>
                        <path d="M7 17 17 7"></path>
                      </svg>
                    </a>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <p className="text-sm font-medium text-red-600 mb-1">Rejection Reason:</p>
                    <p className="text-gray-700 text-sm">
                      {item === 1
                        ? "Content doesn't meet our brand guidelines. Please ensure you're following the quest requirements."
                        : "The submission doesn't feature our products as required in the quest description."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}
