"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/AuthGuard";


export default function BrandLandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-brand-light to-white overflow-hidden">
        
          {/* Quick Action Shortcuts */}
          <section className="mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                <Button
                  asChild
                  className="bg-gradient-to-r from-brand-purple to-brand-pink hover:from-brand-purple/90 hover:to-brand-pink/90 text-white shadow-md transition-all duration-300 hover:shadow-lg h-12 text-sm font-semibold rounded-lg"
                >
                  <Link href="/brand/quests/create" className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Create Quest</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white bg-white shadow-md transition-all duration-300 hover:shadow-lg h-12 text-sm font-semibold rounded-lg"
                >
                  <Link href="/brand/dashboard" className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>My Quests</span>
                  </Link>
                </Button>
              </div>
            </div>
          </section>


        {/* Decorative elements */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-purple/10 blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-brand-pink/10 blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-brand-teal/10 blur-3xl"></div>
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-brand-yellow/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <header className="mb-24">
            <div
              className="max-w-4xl mx-auto opacity-0 translate-y-4 animate-fade-in"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            >
              <div className="text-center mb-12">
                <div className="inline-block mb-6 relative">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal">
                    Create contests that go viral
                  </h1>
                  <div className="absolute -top-6 -right-6 md:-top-8 md:-right-8 w-12 h-12 md:w-16 md:h-16 bg-brand-teal rounded-full opacity-70 blur-sm animate-pulse"></div>
                  <div
                    className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-10 h-10 md:w-12 md:h-12 bg-brand-yellow rounded-full opacity-70 blur-sm animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
                <p className="text-xl md:text-2xl text-gray-700 mb-8 font-light">
                  Get content creators to make videos about your product. The best ones win prizes.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {/* Simple Contest Box */}
                <div
                  className="opacity-0 translate-y-4 animate-fade-in bg-gradient-to-br from-white to-brand-purple/5 p-6 rounded-lg shadow-sm border border-gray-300 text-center group hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="relative h-20 w-20">
                      <svg viewBox="0 0 100 100" className="h-full w-full text-brand-purple">
                        <circle cx="50" cy="35" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path d="M35 50 L50 35 L65 50" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="40" y="50" width="20" height="30" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path d="M30 80 L70 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-purple/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-purple transition-colors duration-300">
                    It's just a contest
                  </h3>
                  <p className="text-gray-600">
                    You set a challenge, creators compete to make the best content, winners get paid
                  </p>
                </div>

                {/* Social Media Box */}
                <div
                  className="opacity-0 translate-y-4 animate-fade-in bg-gradient-to-br from-white to-brand-pink/5 p-6 rounded-lg shadow-sm border border-gray-300 text-center group hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="relative h-20 w-20">
                      <svg viewBox="0 0 100 100" className="h-full w-full text-brand-pink">
                        <rect
                          x="20"
                          y="25"
                          width="60"
                          height="40"
                          rx="8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <circle cx="35" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path d="M50 35 L70 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <path d="M50 45 L65 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="25" cy="75" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
                        <circle cx="50" cy="75" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
                        <circle cx="75" cy="75" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
                      </svg>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-pink/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-pink transition-colors duration-300">
                    They post everywhere
                  </h3>
                  <p className="text-gray-600">TikTok, Instagram, X - your brand gets seen by thousands of people</p>
                </div>
              </div>

              <div
                className="opacity-0 scale-95 animate-fade-in text-center"
                style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
              >
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
                  <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                    Think of it like a talent show, but for your brand. Creators compete, audiences watch, everyone wins.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 text-white shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                      <Link href="/brand/dashboard">Go to dashboard</Link>
                    </Button>

                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-brand-purple hover:text-brand-purple/95 bg-dark text-brand-purple bg-brand-purple/10 shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                      <Link href="/brand/quests/create">Start your first contest</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Floating Call-to-Action */}
          <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
            <div className="bg-gradient-to-r from-brand-purple to-brand-pink rounded-full p-1 shadow-2xl animate-pulse">
              <Button
                asChild
                size="lg"
                className="bg-white text-brand-purple hover:bg-gray-50 rounded-full px-6 py-3 font-bold shadow-lg"
              >
                <Link href="/brand/quests/create">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Start Contest
                </Link>
              </Button>
            </div>
          </div>

          {/* How It Works - Simple Version */}
          <section className="mb-24">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-brand-purple/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-brand-teal/20 to-transparent"></div>

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-dark">Here's how it works</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Super simple. Like running any contest, but online and way more fun.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Left side - Process Steps */}
                  <div
                    className="opacity-0 -translate-x-4 animate-fade-in"
                    style={{
                      animationDelay: "0.2s",
                      animationFillMode: "forwards",
                      transform: `translateY(${scrollY * 0.05}px) translateX(0px)`,
                    }}
                  >
                    <ul className="space-y-8">
                      <li className="flex gap-4">
                        <span className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white flex items-center justify-center shadow-md text-lg font-bold">
                          1
                        </span>
                        <div>
                          <h3 className="font-semibold text-xl text-brand-dark mb-2">You create a contest</h3>
                          <p className="text-gray-600 text-base sm:text-lg">
                            "Make a 45-second video showing off our new payment app" - that's it. Keep it simple.
                          </p>
                        </div>
                      </li>

                      <li className="flex gap-4">
                        <span className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white flex items-center justify-center shadow-md text-lg font-bold">
                          2
                        </span>
                        <div>
                          <h3 className="font-semibold text-xl text-brand-dark mb-2">Set the prize money</h3>
                          <p className="text-gray-600 text-base sm:text-lg">
                            Decide how much you want to give away. Could be $20, could be $200. Your call.
                          </p>
                        </div>
                      </li>

                      <li className="flex gap-4">
                        <span className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue text-white flex items-center justify-center shadow-md text-lg font-bold">
                          3
                        </span>
                        <div>
                          <h3 className="font-semibold text-xl text-brand-dark mb-2">Creators compete</h3>
                          <p className="text-gray-600 text-base sm:text-lg">
                            They make videos, post them on TikTok/Instagram/X, and try to win your contest.
                          </p>
                        </div>
                      </li>

                      <li className="flex gap-4">
                        <span className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-brand-yellow to-brand-coral text-white flex items-center justify-center shadow-md text-lg font-bold">
                          4
                        </span>
                        <div>
                          <h3 className="font-semibold text-xl text-brand-dark mb-2">You pick the winners</h3>
                          <p className="text-gray-600 text-base sm:text-lg">
                            Review all the videos, choose your favorites, and boom - they get paid automatically.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Right side - Benefits */}
                  <div
                    className="opacity-0 translate-x-4 animate-fade-in space-y-8"
                    style={{
                      animationDelay: "0.4s",
                      animationFillMode: "forwards",
                      transform: `translateY(${scrollY * -0.05}px) translateX(0px)`,
                    }}
                  >
                    {/* Why This Works */}
                    <div className="bg-gradient-to-br from-white to-brand-light rounded-xl p-8 shadow-lg border border-gray-100">
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold text-brand-dark">Why this actually works</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">📱</div>
                          <div>
                            <h4 className="font-bold text-brand-dark">People love contests</h4>
                            <p className="text-gray-600">Everyone wants to win money. It's that simple.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🔥</div>
                          <div>
                            <h4 className="font-bold text-brand-dark">Content feels real</h4>
                            <p className="text-gray-600">Not like ads. Just real people talking about your stuff.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🚀</div>
                          <div>
                            <h4 className="font-bold text-brand-dark">Goes everywhere</h4>
                            <p className="text-gray-600">One contest = hundreds of posts across all platforms.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Safe & Secure */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                      <div className="text-center">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold text-green-800 mb-4">Your money is safe</h3>
                        <p className="text-green-700 mb-4">
                          We hold your prize money until you approve the winners. No sketchy stuff.
                        </p>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="text-sm text-gray-600 mb-2">You only pay when:</div>
                          <div className="text-green-600 font-bold">
                            ✓ Content is posted ✓ You approve it ✓ Winners are chosen
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

    

          {/* FAQ */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-dark">Quick questions</h2>
              <p className="text-gray-600">The stuff people usually ask</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-brand-dark mb-3">How much should I spend?</h3>
                <p className="text-gray-600">
                  Most brands start with $20-$200. You can always do bigger contests later if it works well.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-brand-dark mb-3">What if nobody enters?</h3>
                <p className="text-gray-600">
                  Hasn't happened yet. We have thousands of creators waiting for new contests. But if it did, you'd get
                  your money back.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-brand-dark mb-3">Can I control what they post?</h3>
                <p className="text-gray-600">
                  Yep. You approve every single video before winners get paid. Don't like it? Don't approve it.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-brand-dark mb-3">How long does it take?</h3>
                <p className="text-gray-600">
                  Most contests run for 1-2 weeks. You'll start seeing videos within 24 hours of launching.
                </p>
              </div>
            </div>
          </section>

          {/* Final Simple CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-br from-brand-dark via-brand-purple to-brand-dark rounded-3xl p-16 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 via-brand-pink/20 to-brand-teal/20 opacity-50"></div>
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div
                className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>

              <div className="relative z-10">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">Stop overthinking it</h2>
                  <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
                    It's just a contest. Set it up, watch the videos roll in, pick your favorites. That's it.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-8 mb-12">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-110 text-lg md:text-2xl px-8 md:px-16 py-6 md:py-8 h-auto rounded-2xl"
                  >
                    <Link href="/brand/quests/create">
                      <span className="block sm:hidden">🏆 START CONTEST</span>
                      <span className="hidden sm:block">🏆 START YOUR CONTEST</span>
                    </Link>
                  </Button>
                </div>

                <div className="text-center px-4">
                  <p className="text-gray-300 mb-4 text-sm md:text-base">Still not sure? That's cool.</p>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-white hover:text-gray-200 underline text-sm md:text-base"
                  >
                    <Link href="/brand/dashboard">
                      <span className="block sm:hidden">Check dashboard →</span>
                      <span className="hidden sm:block">Just check out the dashboard first →</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }

          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }

          .bg-gradient-radial {
            background: radial-gradient(circle, var(--tw-gradient-stops));
          }
        `}</style>
      </div>
    </AuthGuard>
  )
}
