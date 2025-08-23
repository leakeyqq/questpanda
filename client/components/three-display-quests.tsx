"use client"
import { useEffect, useState } from "react"
import QuestCardV2 from "@/components/quest-card-v2"
import { sdk } from '@farcaster/frame-sdk'// Update the path

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


export default function ThreeQuests(){
    const [quests, setQuests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQuests = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/get3QuestsOnly`, {
              credentials: "include"
            })
            // const res = await fetch("http://localhost:5000/api/quest/allQuests")
    
            const data = await res.json()
            setQuests(data._3quests)
            console.log('the fetched quests are ', data._3quests)
          } catch (error) {
            console.error("Failed to fetch quests:", error)
          } finally {
            setLoading(false)
          }
        }
    
        fetchQuests()
      }, [])

    useEffect(() => {
      if (quests.length === 0) return; // skip if no quests yet
      const init = async () => {
        try {
          await sdk.actions.ready();
          console.log("SDK ready")
        } catch (err) {
          console.error("Failed to initialize SDK:", err)
        }
      }
      init()
    }, [quests])
      
    
      
      
      return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    // <p>Loading quests...</p>
                    <>
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                      <QuestCardSkeleton />
                    </>
                  ) : quests.length > 0 ? (
                    quests.slice(0, 3).map((quest: any) => <QuestCardV2 key={quest._id} quest={quest} />)
                  ) : (
                    <p>No quests found.</p>
                  )}
                </div>
      )

}