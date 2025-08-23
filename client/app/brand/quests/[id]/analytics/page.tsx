'use client'
import Link from "next/link"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { notFound } from "next/navigation"
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { PlatformDistributionChart } from "@/components/charts/platform-distribution-chart"
import { PlatformEngagementChart } from "@/components/charts/platform-engagement-chart"

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

export default function AnalyticsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [quest, setQuest] = useState<any>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAllSubmissions = async () => {
    setLoading(true)
    const awaitedParams = await params; // Properly await params first

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brand/mySingleCreatedQuest/${awaitedParams.id}`, {
          credentials: "include",
        });

        const data = await res.json();

        const fetchedQuest = data.quest;

        if (!fetchedQuest) {
            notFound()
        }

        setSubmissions(fetchedQuest.submissions)
        setQuest(fetchedQuest)

      } catch (error) {
        console.error("Error fetching submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllSubmissions()
  }, [])

  // Aggregation logic
  const totals = {
    twitter: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      submissions: 0,
      bookmarks: 0,
    },
    tiktok: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      submissions: 0,
      bookmarks: 0,
    },
  }

  submissions.forEach((s) => {
    if (s.twitterData) {
      totals.twitter.views += s.twitterData.viewCount || 0
      totals.twitter.likes += s.twitterData.likeCount || 0
      totals.twitter.comments += s.twitterData.replyCount || 0
      totals.twitter.shares += s.twitterData.retweetCount || 0
      totals.twitter.bookmarks += s.twitterData.bookmarkCount || 0
      totals.twitter.submissions += 1
    }

    if (s.tiktokData) {
      totals.tiktok.views += s.tiktokData.playCount || 0
      totals.tiktok.likes += s.tiktokData.diggCount || 0
      totals.tiktok.comments += s.tiktokData.commentCount || 0
      totals.tiktok.shares += s.tiktokData.shareCount || 0
      totals.tiktok.bookmarks += s.tiktokData.collectCount || 0
      totals.tiktok.submissions += 1
    }
  })

  const overallTotals = {
    views: totals.twitter.views + totals.tiktok.views,
    likes: totals.twitter.likes + totals.tiktok.likes,
    comments: totals.twitter.comments + totals.tiktok.comments,
    shares: totals.twitter.shares + totals.tiktok.shares,
    bookmarks: totals.twitter.bookmarks + totals.tiktok.bookmarks,
  }

    // Prepare data for charts
  const platformData = [
    {
      name: "Twitter",
      views: totals.twitter.views,
      likes: totals.twitter.likes,
      comments: totals.twitter.comments,
      shares: totals.twitter.shares,
      submissions: totals.twitter.submissions,
      bookmarks: totals.twitter.bookmarks,
      color: "bg-brand-blue",
    },
    {
      name: "TikTok",
      views: totals.tiktok.views,
      likes: totals.tiktok.likes,
      comments: totals.tiktok.comments,
      shares: totals.tiktok.shares,
      submissions: totals.tiktok.submissions,
      bookmarks: totals.tiktok.bookmarks,
      color: "bg-brand-purple",
    },
  ].filter((platform) => platform.submissions > 0)

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


  return (
    <div className="">
      {/* <h1 className="text-xl font-bold mb-4">Social media campaign report</h1> */}

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
            <div className="min-h-screen bg-brand-light">
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
                {quest && (
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                          <div>
                            <h1 className="text-3xl font-bold text-brand-dark">Analytics for {quest.title}</h1>
                            <p className="text-gray-600">View how the marketing campaign led by content creators performed</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              asChild
                              variant="outline"
                              className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
                            >
                              <Link href={`/brand/quests/${quest._id}/edit`}>Edit Quest</Link>
                            </Button>
                            <Button asChild className="bg-brand-purple hover:bg-brand-purple/90 text-white">
                              <Link href={`/brand/quests/${quest._id}/submissions`}>View submissions</Link>
                            </Button>
                          </div>
                        </div>
                )}

                        <Tabs defaultValue="platforms" className="mb-8">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="platforms">Live🔴 engagements</TabsTrigger>

          </TabsList>

            <TabsContent value="platforms" className="mt-4">



              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-dark flex items-center text-sm font-medium">
                    <div className="p-2 bg-brand-purple/10 rounded-lg mr-3">
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
                        className="text-brand-purple"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-purple mb-1">
                    {formatNumber(overallTotals.views)}
                  </div>
                  <p className="text-gray-500 text-xs">People reached</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-dark flex items-center text-sm font-medium">
                    <div className="p-2 bg-brand-pink/10 rounded-lg mr-3">
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
                        className="text-brand-pink"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </div>
                    Total Likes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-pink mb-1">
                    {formatNumber(overallTotals.likes)}
                  </div>
                  <p className="text-gray-500 text-xs">Positive feedback</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-dark flex items-center text-sm font-medium">
                    <div className="p-2 bg-brand-teal/10 rounded-lg mr-3">
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
                        className="text-brand-teal"
                      >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    Total Shares
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-teal mb-1">
                    {formatNumber(overallTotals.shares)}
                  </div>
                  <p className="text-gray-500 text-xs">Referred friends</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-dark flex items-center text-sm font-medium">
                    <div className="p-2 bg-brand-yellow/10 rounded-lg mr-3">
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
                        className="text-brand-yellow"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    Total Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-yellow mb-1">
                    {formatNumber(overallTotals.comments)}
                  </div>
                  <p className="text-gray-500 text-xs">Deeper interest</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-dark flex items-center text-sm font-medium">
                    <div className="p-2 bg-brand-blue/10 rounded-lg mr-3">
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
                        className="text-brand-blue"
                      >
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                      </svg>
                    </div>
                    Total Bookmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-blue mb-1">
                    {formatNumber(overallTotals.bookmarks)}
                  </div>
                  <p className="text-gray-500 text-xs">To use later</p>
                </CardContent>
              </Card>
            </div>




            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PlatformDistributionChart
                data={platformData}
                title="Platform View Distribution"
                subtitle="Percentage of views per platform"
              />

              <PlatformEngagementChart
                data={platformData}
                title="Platform Engagement"
                subtitle="Views and likes comparison"
              />
            </div>


          </TabsContent>
        </Tabs>


                </div>
              </div>
        

        </>
      )}
    </div>
  )
}