"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { quests } from "@/lib/data"
import { notFound } from "next/navigation"

interface EditQuestPageProps {
  params: {
    id: string
  }
}

export default function EditQuestPage({ params }: EditQuestPageProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quest, setQuest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [prizePool, setPrizePool] = useState("")
  const [deadline, setDeadline] = useState("")
  const [minFollowers, setMinFollowers] = useState("")
  const [requirements, setRequirements] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    // Find the quest
    const foundQuest = quests.find((q) => q.id === params.id)

    if (foundQuest) {
      setQuest(foundQuest)
      setTitle(foundQuest.title)
      setCategory(foundQuest.category)
      setDescription(foundQuest.description)
      setLongDescription(foundQuest.longDescription || "")
      setPrizePool(foundQuest.prizePool.replace(" USDC", ""))
      setDeadline(new Date(foundQuest.deadline).toISOString().split("T")[0])
      setMinFollowers(foundQuest.minFollowers.toString())
      setRequirements(foundQuest.requirements.join("\n"))
      setImageUrl(foundQuest.imageUrl)
    }

    setIsLoading(false)
  }, [params.id])

  if (!isLoading && !quest) {
    notFound()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!title || !category || !description || !prizePool || !deadline) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Quest updated!",
      description: "Your quest has been updated successfully.",
    })

    setIsSubmitting(false)
    router.push("/brand/dashboard")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-purple">Loading quest details...</p>
        </div>
      </div>
    )
  }

  return (
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-brand-dark">Edit Quest: {quest.title}</h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Basic Information</CardTitle>
                  <CardDescription className="text-gray-600">
                    Update the essential details about your quest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-brand-dark">
                        Quest Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., Summer Collection Showcase"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white border-gray-300 text-gray-800"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-brand-dark">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-800">
                          <SelectItem value="Create video">Video Creation</SelectItem>
                          <SelectItem value="Photo">Photo</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                          <SelectItem value="Unboxing">Unboxing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-brand-dark">
                      Short Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your quest (max 150 characters)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 resize-none h-20"
                      maxLength={150}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription" className="text-brand-dark">
                      Detailed Description
                    </Label>
                    <Textarea
                      id="longDescription"
                      placeholder="Provide detailed instructions and expectations for creators"
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 resize-none h-32"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Reward & Requirements</CardTitle>
                  <CardDescription className="text-gray-600">
                    Update the prize pool and participation requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prizePool" className="text-brand-dark">
                        Prize Pool (USDC) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="prizePool"
                        placeholder="e.g., 100"
                        value={prizePool}
                        onChange={(e) => setPrizePool(e.target.value)}
                        className="bg-white border-gray-300 text-gray-800"
                        type="number"
                        min="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-brand-dark">
                        Deadline <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="bg-white border-gray-300 text-gray-800"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minFollowers" className="text-brand-dark">
                      Minimum Followers
                    </Label>
                    <Input
                      id="minFollowers"
                      placeholder="e.g., 1000"
                      value={minFollowers}
                      onChange={(e) => setMinFollowers(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800"
                      type="number"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-brand-dark">
                      Requirements
                    </Label>
                    <Textarea
                      id="requirements"
                      placeholder="List specific requirements, one per line"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 resize-none h-32"
                    />
                    <p className="text-xs text-gray-500">Enter each requirement on a new line</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Media</CardTitle>
                  <CardDescription className="text-gray-600">Update visual elements for your quest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-brand-dark">
                      Cover Image URL
                    </Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800"
                    />
                  </div>

                  {imageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div
                        className="h-40 w-full rounded-lg bg-cover bg-center border border-gray-300"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      ></div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => router.push("/brand/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-purple hover:bg-brand-purple/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
