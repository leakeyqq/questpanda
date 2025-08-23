import Link from "next/link"
import { Button } from "@/components/ui/button"
import QuestCard from "@/components/quest-card"
import { quests } from "@/lib/data"
import  ThreeQuests  from "@/components/three-display-quests"

import CurrencyDisplay from '@/components/CurrencyDisplay';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white bg-dotted-pattern">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-8 text-center">
          <div className="inline-block mb-4 relative">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
              Questpanda
            </h1>
            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-8 h-8 md:w-12 md:h-12 bg-brand-yellow rounded-full opacity-70 blur-sm"></div>
            <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-6 h-6 md:w-8 md:h-8 bg-brand-teal rounded-full opacity-70 blur-sm"></div>
          </div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
Are you a content creator? Create fun videos about products, share online and earn rewards
            {/* Are you a content creator? Create short promotional videos for brands, share on social media and earn */}
            {/* Are you a content creator? Join brand contests, make fun videos, share online, and earn rewards! */}

          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="sm" className="bg-brand-purple hover:bg-opacity-90 hover:bg-brand-purple text-white">
              <Link href="/quests">Browse Quests</Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="bg-brand-purple bg-opacity-10 border-brand-purple text-brand-purple hover:text-brand-purple"
            >
              <Link href="/brand">Create quest</Link>
            </Button>
          </div>

                    {/* Fancy Discover Creators Text */}
          <div className="mt-12 hidden">
            <Link href="/discover" className="group inline-block">
              <div className="relative">
                {/* Background glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                {/* Main content */}
                <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-200/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-center space-x-3">
                    {/* Animated icon */}
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      {/* Pulse animation */}
                      <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full animate-ping opacity-20"></div>
                    </div>

                    {/* Text content */}
                    <div className="text-left">
                      <div className="text-md sm:text-2xl font-bold bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal bg-clip-text text-transparent group-hover:from-brand-teal group-hover:via-brand-purple group-hover:to-brand-pink transition-all duration-500">
                        Discover 3,000+ Creators
                      </div>
                      <div className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                        Find the perfect creator for your brand
                      </div>
                    </div>

                    {/* Arrow icon */}
                    <div className="ml-4 group-hover:translate-x-1 transition-transform duration-300">
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
                        <path d="M7 7h10v10"></path>
                        <path d="M7 17 17 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>


<div className="mt-12 px-4 sm:px-0 hidden">
  <Link href="/discover" className="group inline-block w-full">
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

      {/* Main content */}
      <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-200/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between space-x-3">
          {/* Animated icon */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                className="text-white"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            {/* Pulse animation */}
            <div className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full animate-ping opacity-20"></div>
          </div>

          {/* Text content */}
          <div className="text-left flex-grow min-w-0">
            <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal bg-clip-text text-transparent group-hover:from-brand-teal group-hover:via-brand-purple group-hover:to-brand-pink transition-all duration-500 truncate">
              Discover 3,000+ Creators
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors truncate">
              Find the perfect creator for your brand
            </div>
          </div>

          {/* Arrow icon */}
          <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
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
              className="text-brand-purple"
            >
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Link>
</div>


        </header>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-brand-dark">Latest quests</h2>
            <Link href="/quests" className="text-brand-purple hover:text-brand-pink transition-colors">
              View all →
            </Link>
          </div>

          <ThreeQuests/>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.slice(0, 3).map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div> */}
        </section>

        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-brand-yellow/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-brand-teal/20 to-transparent"></div>

            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-brand-dark">How it works</h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-purple text-white flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-dark">Browse quests</h3>
                      <p className="text-gray-600">Find creative challenges from brands</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-pink text-white flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-dark">Create content</h3>
                      <p className="text-gray-600">
                        Make a video following quest guidelines and share the video on social media
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-teal text-white flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-dark">Submit proof</h3>
                      <p className="text-gray-600">Share your content link as proof</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-yellow text-brand-dark flex items-center justify-center">
                      4
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-dark">Earn <CurrencyDisplay/></h3>
                      <p className="text-gray-600">Get paid from the quest's prize pool</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="text-center mb-4">
                  <div className="inline-block p-3 bg-brand-purple/10 rounded-full mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-purple w-8 h-8"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark">124,500 <CurrencyDisplay/>+</h3>
                  <p className="text-gray-600">Paid to creators this month</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-brand-light p-4 rounded-lg">
                    <h4 className="text-xl font-bold text-brand-dark">250+</h4>
                    <p className="text-gray-600">Active Quests</p>
                  </div>
                  <div className="bg-brand-light p-4 rounded-lg">
                    <h4 className="text-xl font-bold text-brand-dark">12,400 <CurrencyDisplay/>+</h4>
                    <p className="text-gray-600">Content Creators</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
