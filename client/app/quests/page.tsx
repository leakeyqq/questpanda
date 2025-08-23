"use client"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import QuestCard from "@/components/quest-card"
import QuestCardV2 from "@/components/quest-card-v2"
import { quests } from "@/lib/data"

// Skeleton Loader Component
const QuestCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  </div>
)

export default function QuestsPage() {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/allQuests/`, {
          method: 'GET',
          credentials: "include"
        })
        // const res = await fetch("http://localhost:5000/api/quest/allQuests")

        const data = await res.json()
        setQuests(data.allQuests)
      } catch (error) {
        console.error("Failed to fetch quests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuests()
  }, [])


  return (
    
    <div className="min-h-screen bg-brand-light">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-brand-dark">Discover quests</h1>

        {/* <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input placeholder="Search quests..." className="bg-white border-gray-300 text-gray-800" />
            </div>
            <div>
              <Select>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-800">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="prize">Highest reward</SelectItem>
                  <SelectItem value="deadline">Ending soon</SelectItem>
                  <SelectItem value="popular">Trending</SelectItem>
                  <SelectItem value="noncompetitive">Low competition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-brand-purple text-brand-purple hover:bg-brand-purple/10 hover:text-brand-purple"
            >
              Trending
            </Button>
            <Button variant="outline" size="sm" className="border-brand-pink text-brand-pink hover:bg-brand-pink/10 hover:text-brand-pink">
              Ending Soon
            </Button>
            <Button variant="outline" size="sm" className="border-brand-teal text-brand-teal hover:bg-brand-teal/10 hover:text-brand-teal">
              High Reward
            </Button>
            <Button variant="outline" size="sm" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue">
              Low Competition
            </Button>
          </div>

        </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // <p>Loading quests...</p>
                                <>
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                    </>
          ) : quests.length > 0 ? (
            quests.map((quest: any) => <QuestCardV2 key={quest._id} quest={quest} />)
          ) : (
            <p>No quests found.</p>
          )}
        </div>

      </div>
    </div>
  )
}
