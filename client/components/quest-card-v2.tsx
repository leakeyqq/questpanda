"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Quest } from "@/lib/types"
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Gift, Trophy, Award, Zap } from 'lucide-react';

interface QuestCardProps {
  quest: Quest
}

export default function QuestCardV2({ quest }: QuestCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // const percentComplete = Math.min(100, Math.round((quest.submissions / quest.maxParticipants) * 100))

  const daysLeft = Math.ceil((new Date(quest.endsOn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

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
    <Link href={`/quests/${quest._id}`}>
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
                backgroundImage: `url(${quest.brandImageUrl})`,
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-brand-purple text-white hover:text-brand-purple">Create video</Badge>
            </div>
            <div className="absolute bottom-3 left-3">
              {quest.approvalNeeded && (
                <Badge className="bg-brand-blue text-white hover:text-brand-blue">
                  Approval needed
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </span>
                </Badge>
              )}
            </div>
            <div className="absolute bottom-3 right-3">
              {/* <Badge variant="outline" className="border-white text-white bg-black/30 backdrop-blur-sm">
                {daysLeft >= 0 ? `${daysLeft} days left` : "Quest ended"}
            </Badge> */}
              <Badge
                variant="outline"
                className={`border-white text-white bg-black/30 backdrop-blur-sm ${daysLeft < 0 ? 'bg-white text-dark' : ''
                  }`}
              >
                {daysLeft >= 0 ? `${daysLeft} days left` : "Quest ended"}
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              {/* Updated mobile reward display */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {/* <div className="flex items-center text-brand-purple font-bold">
                    <Zap className="w-3 h-3 mr-1" />
                    100 XP
                  </div> */}

                  <div className="flex items-center gap-1 bg-gradient-to-r from-brand-purple/20 via-brand-pink/20 to-brand-purple/20 border border-brand-purple/30 rounded-full px-1 sm:px-3 py-1 shadow-sm">
                    <div className="w-4 h-4 bg-gradient-to-r from-brand-purple to-brand-pink rounded-full flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-brand-purple">100 points</span>
                    {/* <div className="w-1 h-1 bg-brand-purple/60 rounded-full animate-pulse"></div> */}
                  </div>

                  <span className="text-brand-purple text-lg">+</span>
                  <div className="flex items-center text-brand-purple font-bold">
                    <Gift className="w-4 h-4 mr-1" />
                    {quest.pricePerVideo}
                    <CurrencyDisplay />
                  </div>
                </div>
              </div>
              {/* <div className="flex items-center text-brand-purple font-bold">
              <Gift className="w-4 h-4 mr-2" /> {quest.pricePerVideo} <CurrencyDisplay/>
              </div> */}
            </div>
            <p className="text-sm text-gray-600">by {quest.brandName}</p>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-700 line-clamp-2 mb-4">{quest.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card (simplified) */}
      <div className="hidden">
        <Card className="overflow-hidden bg-white border-gray-200">
          <div className="relative h-32 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${quest.brandImageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-2 left-2 flex gap-1">
              <Badge className="text-xs bg-brand-purple text-white hover:text-brand-purple">
                Create video
              </Badge>
              {quest.approvalNeeded && (
                <Badge className="text-xs bg-brand-blue text-white">
                  Approval needed
                </Badge>
              )}
              {/* {quest.featured && (
              <Badge className="text-xs bg-brand-yellow text-brand-dark">Featured</Badge>
            )} */}
            </div>
          </div>

          <CardHeader className="p-3">

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm font-bold text-brand-purple">
                <Gift className="w-4 h-4" />
                <span>{quest.pricePerVideo}<CurrencyDisplay /></span>
              </div>
              {/* <Badge variant="outline" className="text-xs border-brand-purple/30 bg-white/90 text-brand-dark">
      {daysLeft > 0 ? `${daysLeft}d left` : "Quest ended"}
  </Badge> */}
              <Badge
                variant="outline"
                className={`text-xs bg-white/90 ${daysLeft >= 0
                    ? 'border-brand-purple/30 text-brand-dark'
                    : 'bg-white text-dark border-red-300'
                  }`}
              >
                {daysLeft >= 0 ? `${daysLeft}d left` : "Quest ended"}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">by {quest.brandName}</p>
          </CardHeader>

          <CardContent className="p-3 pt-0">
            <p className="text-xs text-gray-700 line-clamp-2">{quest.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card */}
      <div className="md:hidden">
        <Card className="overflow-hidden bg-white border-gray-200">
          <div className="relative h-32 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${quest.brandImageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-2 left-2">
              <Badge className="text-xs bg-brand-purple text-white hover:text-brand-purple">
                Create video
              </Badge>
            </div>
            {/* Approval badge - bottom right of image */}
            {quest.approvalNeeded && (
              <div className="absolute bottom-2 right-2">
                <Badge className="text-xs bg-brand-blue text-white">
                  Approval needed
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </span>
                </Badge>
              </div>
            )}
          </div>

          <CardHeader className="p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm font-bold text-brand-purple">

                <div className="flex items-center gap-1 bg-gradient-to-r from-brand-purple/20 via-brand-pink/20 to-brand-purple/20 border border-brand-purple/30 rounded-full px-1 sm:px-3 py-1 shadow-sm">
                  <div className="w-4 h-4 bg-gradient-to-r from-brand-purple to-brand-pink rounded-full flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-brand-purple">100 points</span>
                  {/* <div className="w-1 h-1 bg-brand-purple/60 rounded-full animate-pulse"></div> */}
                </div>

                <span className="text-brand-purple text-lg">+</span>

                <Gift className="w-4 h-4" />
                <span>{quest.pricePerVideo}<CurrencyDisplay /></span>
              </div>
              {/* Days left badge - kept in original position outside image */}
              <Badge
                variant="outline"
                className={`text-xs bg-white/90 ${daysLeft >= 0
                    ? 'border-brand-purple/30 text-brand-dark'
                    : 'bg-white text-dark border-red-300'
                  }`}
              >
                {daysLeft >= 0 ? `${daysLeft}d left` : "Quest ended"}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">by {quest.brandName}</p>
          </CardHeader>

          <CardContent className="p-3 pt-0">
            <p className="text-xs text-gray-700 line-clamp-2">{quest.description}</p>
          </CardContent>
        </Card>
      </div>

    </Link>
  )
}
