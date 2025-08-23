"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Quest } from "@/lib/types"

interface QuestCardProps {
  quest: Quest
}

export default function QuestCard({ quest }: QuestCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const percentComplete = Math.min(100, Math.round((quest.submissions / quest.maxParticipants) * 100))

  const daysLeft = Math.ceil((new Date(quest.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  // Assign a color based on the quest category
  const getCategoryColor = (category: string) => {
    const colors = {
      "Create video": "bg-brand-purple text-white hover:text-brand-purple",
      Photo: "bg-brand-pink text-white",
      Review: "bg-brand-teal text-white",
      Unboxing: "bg-brand-blue text-white",
    }
    return colors[category as keyof typeof colors] || "bg-brand-yellow text-brand-dark"
  }

return (
  <Link href={`/quests/${quest.id}`}>
    {/* Desktop/Large Screen Card (original) */}
    <div className="hidden md:block">
      <Card
        className="overflow-hidden bg-white border-gray-200 hover:border-brand-purple/50 hover:shadow-lg transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out"
            style={{
              backgroundImage: `url(${quest.imageUrl})`,
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={getCategoryColor(quest.category)}>{quest.category}</Badge>
            {quest.featured && <Badge className="bg-brand-yellow text-brand-dark">Featured</Badge>}
          </div>
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="border-white text-white bg-black/30 backdrop-blur-sm">
              {daysLeft} days left
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center text-brand-purple font-bold">{quest.prizePool}</div>
          </div>
          <p className="text-sm text-gray-600">by {quest.brand}</p>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-gray-700 line-clamp-2 mb-4">{quest.description}</p>
        </CardContent>
      </Card>
    </div>

    {/* Mobile Card (simplified) */}
    <div className="md:hidden">
      <Card className="overflow-hidden bg-white border-gray-200">
        <div className="relative h-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${quest.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge className={`text-xs ${getCategoryColor(quest.category)}`}>
              {quest.category}
            </Badge>
            {quest.featured && (
              <Badge className="text-xs bg-brand-yellow text-brand-dark">Featured</Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="p-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-bold text-brand-purple">{quest.prizePool}</div>
            <Badge variant="outline" className="text-xs border-brand-purple/30 bg-white/90 text-brand-dark">
              {daysLeft}d left
            </Badge>
          </div>
          <p className="text-xs text-gray-600">by {quest.brand}</p>
        </CardHeader>
        
        <CardContent className="p-3 pt-0">
          <p className="text-xs text-gray-700 line-clamp-2">{quest.description}</p>
        </CardContent>
      </Card>
    </div>
  </Link>
)
}
