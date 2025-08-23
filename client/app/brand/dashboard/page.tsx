'use client'
import Link from "next/link"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { quests } from "@/lib/data"
import { useAccount } from "wagmi";
import { useWeb3 } from "@/contexts/useWeb3"
import type { Quest } from "@/lib/types"

import CurrencyDisplay from '@/components/CurrencyDisplay';

interface QuestCardProps {
  quest: Quest
}




let hasConnectedMiniPay = false;


export default function BrandDashboardPage() {
  
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { sendCUSD, checkCUSDBalance, getUserAddress, isWalletReady } = useWeb3();
  
  // Filter to only show this brand's quests (in a real app, this would be based on authentication)
  // const brandQuests = quests.filter((quest) => quest.brand === "FashionBrand" || quest.brand === "TechCorp")
  // const brandQuests = quests

  const [walletBalance, setWalletBalance] = useState(0)
  const [fundsSpent, setFundsSpent] = useState(0)

    useEffect(() => {

        if(isConnected && address && isWalletReady){
          setLoading(true);
          
          try{
            const getTotalFundsSpent = async() => {


              const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brand/getTotalFundsSpent`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include", 
              })
            const data = await res.json()
            setFundsSpent(data.totalSpent)
            setQuests(data.allMyCreatedQuests)
            
            let fake_amount = '1'
            const balanceCheck = await checkCUSDBalance(fake_amount);
            setWalletBalance(Number(balanceCheck.balance))
             

            };
            getTotalFundsSpent();
          }catch(e){
            console.error(e)
          }finally{
            setLoading(false);
          }
        }
      
    }, [isConnected, address, isWalletReady]);

  
  

  // const [loading, setLoading] = useState(true)



  return (
<div>
  {loading ? (
    <div>Loading your dashboard...</div>
  ): (
    <div className="min-h-screen bg-brand-light">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-  text-brand-dark">Brand Dashboard</h1>
            <p className="text-gray-600">Manage your quests and submissions</p>
          </div>
          <Button asChild className="bg-brand-purple hover:bg-brand-purple/90 text-white">
            <Link href="/brand/quests/create">Create New Quest</Link>
          </Button>
        </div>
{/* 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Active Quests</CardTitle>
              <CardDescription className="text-gray-600">Currently running</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-purple">{brandQuests.length}</div>
              <p className="text-gray-600 text-sm mt-1">2 ending this week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Total Submissions</CardTitle>
              <CardDescription className="text-gray-600">Across all quests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-dark">31</div>
              <p className="text-gray-600 text-sm mt-1">8 pending review</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Budget Spent</CardTitle>
              <CardDescription className="text-gray-600">This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-teal">$1,450</div>
              <p className="text-gray-600 text-sm mt-1">$3,550 remaining</p>
            </CardContent>
          </Card>
        </div> */}


        
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Wallet</CardTitle>
              <CardDescription className="text-gray-600">Balance remaining</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-purple">{walletBalance} <CurrencyDisplay/></div>
              {/* <p className="text-gray-600 text-sm mt-1">2 ending this week</p> */}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Spent</CardTitle>
              <CardDescription className="text-gray-600">Funds spent on creating quests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-dark">{fundsSpent} <CurrencyDisplay/></div>
              {/* <p className="text-gray-600 text-sm mt-1">8 pending review</p> */}
            </CardContent>
          </Card>

          {/* <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Budget Spent</CardTitle>
              <CardDescription className="text-gray-600">This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-teal">$1,450</div>
              <p className="text-gray-600 text-sm mt-1">$3,550 remaining</p>
            </CardContent>
          </Card> */}
        </div>














        {/* <Tabs defaultValue="active" className="mb-8"> */}
        <Tabs defaultValue="active" className="mb-12">

          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="active">My created quests</TabsTrigger>
            {/* <TabsTrigger value="pending">Pending Review</TabsTrigger> */}
            {/* <TabsTrigger value="completed">Completed</TabsTrigger> */}
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">My Quests ({quests.length})</h2>

                <div className="space-y-4">
                  {quests.map((quest: Quest) => (
                    <div key={quest._id} className="bg-brand-light rounded-lg p-4 flex flex-col md:flex-row gap-4">
                      <div
                        className="h-24 md:w-40 rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${quest.brandImageUrl})` }}
                      ></div>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-brand-purple text-white">Create Video</Badge>
                          <Badge variant="outline" className="border-brand-purple/30 text-brand-dark">
                            {Math.ceil(
                              (new Date(quest.endsOn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                            )}{" "}
                            days left
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold mb-1 text-brand-dark">{quest.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{quest.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="text-brand-purple font-bold">{quest.prizePoolUsd} <CurrencyDisplay/></div>
                          <div className="flex gap-2">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
                            >
                              <Link href={`/brand/quests/${quest._id}/submissions`}>
                                View Submissions ({quest.submissions.length})
                              </Link>
                            </Button>
                            <Button asChild size="sm" className="bg-brand-purple hover:bg-brand-purple/90 text-white">
                              <Link href={`/brand/quests/${quest._id}/edit`}>Edit</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* <TabsContent value="pending" className="mt-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Submissions Pending Review (8)</h2>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-brand-light rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge className="bg-brand-yellow text-brand-dark mb-2">Pending Review</Badge>
                          <h3 className="text-lg font-bold text-brand-dark">Summer Collection Showcase</h3>
                          <p className="text-sm text-gray-600">
                            Submitted by <span className="font-medium">creator{item}</span> • 2 days ago
                          </p>
                        </div>
                        <Link
                          href={`/brand/submissions/${item}`}
                          className="text-brand-purple hover:text-brand-pink text-sm"
                        >
                          View Quest Details
                        </Link>
                      </div>

                      <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                            C{item}
                          </div>
                          <div>
                            <p className="text-gray-700">
                              I created this video showcasing your summer collection at the beach. The lighting was
                              perfect!
                            </p>
                            <a
                              href="#"
                              className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center mt-1"
                            >
                              https://example.com/video{item}
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
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" className="border-red-400 text-red-500 hover:bg-red-50">
                          Reject
                        </Button>
                        <Button size="sm" className="bg-brand-teal hover:bg-brand-teal/90 text-white">
                          Approve & Award
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent> */}

          {/* <TabsContent value="completed" className="mt-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Completed Quests (5)</h2>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-brand-light rounded-lg p-4 flex flex-col md:flex-row gap-4">
                      <div
                        className="h-24 md:w-40 rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(/placeholder.svg?height=200&width=320)` }}
                      ></div>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-brand-teal text-white">Completed</Badge>
                          <Badge variant="outline" className="border-gray-400 text-gray-700">
                            Ended Apr {10 + item}, 2023
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold mb-1 text-brand-dark">Spring Collection {item}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          This quest received {5 + item} submissions and generated over 50k views
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-brand-teal font-bold">${item * 100} spent</div>
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
                          >
                            <Link href={`/brand/quests/completed-${item}`}>View Report</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent> */}
        </Tabs>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-brand-dark">Performance Overview</CardTitle>
              <CardDescription className="text-gray-600">Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-light p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-brand-dark">124.5K</p>
                </div>
                <div className="bg-brand-light p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Engagement Rate</p>
                  <p className="text-2xl font-bold text-brand-dark">4.8%</p>
                </div>
                <div className="bg-brand-light p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Avg. Submission Quality</p>
                  <p className="text-2xl font-bold text-brand-dark">8.7/10</p>
                </div>
                <div className="bg-brand-light p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Cost per View</p>
                  <p className="text-2xl font-bold text-brand-dark">$0.012</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 border-brand-purple text-brand-purple hover:bg-brand-purple/10"
              >
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-brand-dark">Top Creators</CardTitle>
              <CardDescription className="text-gray-600">Based on submission quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3 p-3 bg-brand-light rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple flex-shrink-0">
                      C{item}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-brand-dark">Creator{item}</h4>
                        <span className="text-sm text-gray-600">{10 - item}K followers</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">Completed {4 - item} quests with high engagement</p>
                      <div className="flex justify-between items-center">
                        <span className="text-brand-purple text-sm font-medium">9.{item}/10 avg. rating</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-brand-purple text-brand-purple hover:bg-brand-purple/10"
                        >
                          Invite to Quest
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full mt-4 bg-brand-purple hover:bg-brand-purple/90 text-white">
                <Link href="/brand/creators">View All Creators</Link>
              </Button>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )}
</div>

  )
}
