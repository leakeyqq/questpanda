"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Instagram, Twitter, Music, Play } from "lucide-react"
import React from "react"

interface Creator {
  id: string;
  name: string;
  userName: string;
  cloudy_profilePicture?: string;
  followers: number;
  platform: string;
  questsCompleted?: number;
  cashEarned?: number;
  pandaCoins?: number;
  categories?: string[];
  location?: string;
}

// Mock creator data with the requested information
// const creators = [
//   {
//     id: 1,
//     name: "Sarah Johnson",
//     username: "@sarahjohnson",
//     avatar: "/placeholder.svg",
//     followers: 125000,
//     platforms: ["instagram", "tiktok"],
//     questsCompleted: 23,
//     cashEarned: 2850,
//     pandaCoins: 1420,
//     categories: ["Fashion", "Lifestyle"],
//     location: "Nairobi, Kenya",
//   },
//   {
//     id: 2,
//     name: "David Kimani",
//     username: "@davidkimani",
//     avatar: "/placeholder.svg",
//     followers: 89000,
//     platforms: ["youtube", "twitter"],
//     questsCompleted: 18,
//     cashEarned: 2100,
//     pandaCoins: 980,
//     categories: ["Technology", "Reviews"],
//     location: "Lagos, Nigeria",
//   },
//   {
//     id: 3,
//     name: "Amara Okafor",
//     username: "@amaraokafor",
//     avatar: "/placeholder.svg",
//     followers: 156000,
//     platforms: ["instagram", "tiktok", "youtube"],
//     questsCompleted: 31,
//     cashEarned: 4200,
//     pandaCoins: 2150,
//     categories: ["Fitness", "Health"],
//     location: "Accra, Ghana",
//   },
//   {
//     id: 4,
//     name: "James Mwangi",
//     username: "@jamesmwangi",
//     avatar: "/placeholder.svg",
//     followers: 67000,
//     platforms: ["youtube", "instagram"],
//     questsCompleted: 12,
//     cashEarned: 1450,
//     pandaCoins: 720,
//     categories: ["Food", "Cooking"],
//     location: "Kampala, Uganda",
//   },
//   {
//     id: 5,
//     name: "Zara Hassan",
//     username: "@zarahassan",
//     avatar: "/placeholder.svg",
//     followers: 198000,
//     platforms: ["instagram", "youtube", "tiktok"],
//     questsCompleted: 27,
//     cashEarned: 3650,
//     pandaCoins: 1890,
//     categories: ["Beauty", "Makeup"],
//     location: "Cairo, Egypt",
//   },
//   {
//     id: 6,
//     name: "Michael Osei",
//     username: "@michaelosei",
//     avatar: "/placeholder.svg",
//     followers: 143000,
//     platforms: ["youtube", "instagram"],
//     questsCompleted: 19,
//     cashEarned: 2750,
//     pandaCoins: 1340,
//     categories: ["Music", "Entertainment"],
//     location: "Kumasi, Ghana",
//   },
//   {
//     id: 7,
//     name: "Fatima Abdullahi",
//     username: "@fatimaabdullahi",
//     avatar: "/placeholder.svg",
//     followers: 92000,
//     platforms: ["tiktok", "instagram"],
//     questsCompleted: 15,
//     cashEarned: 1850,
//     pandaCoins: 920,
//     categories: ["Comedy", "Entertainment"],
//     location: "Kano, Nigeria",
//   },
//   {
//     id: 8,
//     name: "Kevin Mutua",
//     username: "@kevinmutua",
//     avatar: "/placeholder.svg",
//     followers: 78000,
//     platforms: ["youtube", "twitter"],
//     questsCompleted: 21,
//     cashEarned: 2950,
//     pandaCoins: 1560,
//     categories: ["Education", "Finance"],
//     location: "Nairobi, Kenya",
//   },
// ]

const platforms = ["All", "Instagram", "TikTok", "YouTube", "Twitter"]

export default function DiscoverCreators() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  function shuffleArray(array: any) {
  const arr = [...array]; // make a shallow copy to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
  return arr;
}

   // Fetch creators from API
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/creator/simulatedCreators`)


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Access the simulatedCreators array from the response
        if (result.simulatedCreators && Array.isArray(result.simulatedCreators)) {
          const shuffled = shuffleArray(result.simulatedCreators);
          setCreators(shuffled);
          // setCreators(result.simulatedCreators);
        } else {
          throw new Error('Invalid data format received from API');
        }


      } catch (err) {
        // Properly type the error
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
        console.error('Error fetching creators:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-3 h-3" />
      case "twitter":
        return <Twitter className="w-3 h-3" />
      case "youtube":
        return <Play className="w-3 h-3" />
      case "tiktok":
        return <Music className="w-3 h-3" />
      default:
        return null
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "twitter":
        return "bg-blue-500"
      case "youtube":
        return "bg-red-500"
      case "tiktok":
        return "bg-black"
      default:
        return "bg-gray-500"
    }
  }

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform =
      selectedPlatform === "All" || 
      creator.platform.toLowerCase() === selectedPlatform.toLowerCase()

    return matchesSearch && matchesPlatform
  })

  // Replace your current loading state return with this:
if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-pink text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Discover Creators</h1>
            <p className="text-sm opacity-90 mb-4">Find talented creators for your next campaign</p>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      <div className="container mx-auto px-4 py-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-white border border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar Skeleton */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                  
                  {/* Text Skeletons */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Compact Hero Section */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-pink text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Discover Creators</h1>
            <p className="text-sm opacity-90 mb-4">Find talented creators for your next campaign</p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                {/* <span className="font-bold">{creators.length * 10}+</span> Creators */}
                <span className="font-bold">3000+</span> Creators

              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="font-bold">20M+</span> Followers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Platform Filter */}
      <div className="container mx-auto px-4 py-4">
        {/* <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 mb-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-sm bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-brand-purple transition-colors"
              />
            </div>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white h-10 min-w-[120px] focus:border-brand-purple transition-colors"
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div> */}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {/* {filteredCreators.length * 10} creator{filteredCreators.length !== 1 ? "s" : ""} found */}
            3000+ creators found
          </p>
        </div>

        {/* Mobile-Optimized Creator Cards */}
        <div className="space-y-3">

{[...Array(10)].map((_, i) => (
  <React.Fragment key={i}>
          {filteredCreators.map((creator) => (
            <Card key={creator.id} className="bg-white border border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={ creator.cloudy_profilePicture || "/human-avatar.jpg"} alt={creator.name} />
                    <AvatarFallback className="bg-brand-purple/10 text-brand-purple text-sm">
                      {creator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">{creator.name}</h3>
                        <p className="text-xs text-brand-purple">{creator.userName}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-sm font-semibold text-gray-900">{formatNumber(creator.followers)}</div>
                        <div className="text-xs text-gray-500">followers</div>
                      </div>
                    </div>

                    {/* Platforms */}
                  <div className="flex items-center gap-1">
                    <div 
                      key={creator.platform} 
                      className="flex items-center gap-1 bg-gray-200 px-2 py-0.5 rounded-full"
                    >
                      {getPlatformIcon(creator.platform)}
                      <span className="text-xs capitalize text-gray-700 font-medium">
                        {creator.platform}
                      </span>
                    </div>
                  </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
            </React.Fragment>
))}

        </div>

        {/* Empty State */}
        {filteredCreators.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto shadow-lg border border-white/20">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No creators found</h3>
              <p className="text-gray-500 text-sm mb-6">
                Try adjusting your search or filters to discover more creators
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedPlatform("All")
                }}
                className="bg-gradient-to-r from-brand-purple to-brand-pink hover:from-brand-purple/90 hover:to-brand-pink/90 text-white"
                size="sm"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
