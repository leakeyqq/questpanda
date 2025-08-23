"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAlert } from "@/components/custom-popup"
import { useConfirm } from '@/components/custom-confirm'
import { useRouter } from 'next/navigation'
import { useWeb3 } from "@/contexts/useWeb3"
// import { sdk } from '@farcaster/frame-sdk'
import { Users, UserCheck, TrendingUp, MessageCircle, Hash, AlertCircle, CheckCircle, XCircle } from "lucide-react"


interface SubmissionFormProps {
  questId: string
  approvalNeeded?: boolean
  minFollowers?: number
  allowedPlatforms: Record<string, { allowedOnCampaign: boolean }>
  applicationStatus?: 'notLoggedIn' | 'approved' | 'pending' | 'rejected' | 'notApplied'
  appliedPlatform?: string
}

export default function SubmissionForm({ 
  questId, 
  approvalNeeded = false,
  minFollowers = 0,
  allowedPlatforms = {}, 
  applicationStatus = 'notApplied',
  appliedPlatform 
}: SubmissionFormProps) {
  const { showAlert, AlertComponent } = useAlert()
  const { showConfirm, ConfirmComponent } = useConfirm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [platform, setPlatform] = useState("")
  const [profilePlatform, setProfilePlatform] = useState("")
  const [profileUrl, setProfileUrl] = useState("")
  const [contentUrl, setContentUrl] = useState("")
  // const [isFarcaster, setIsFarcaster] = useState(false)
  const router = useRouter()
  
    useEffect(() => {
    if (applicationStatus === 'approved' && appliedPlatform) {
      setPlatform(appliedPlatform);
    }
  }, [applicationStatus, appliedPlatform]);


    // Determine button text and disabled state based on status
  const getProfileButtonState = () => {
    switch (applicationStatus) {
      case 'pending':
        return {
          text: "Waiting to be approved",
          disabled: true,
          className: "bg-gray-400 text-white cursor-not-allowed"
        };
      case 'rejected':
        return {
          text: "Approval denied",
          disabled: true,
          className: "bg-red-400 text-white cursor-not-allowed"
        };
      case 'approved':
        return {
          text: "You were approved",
          disabled: true,
          className: "bg-green-500 hover:bg-green-600 text-white"
        };
      case 'notLoggedIn':
        return {
          text: "Sign In first",
          disabled: true,
          className: "bg-gray-400 text-white cursor-not-allowed"
        };
      default: // notApplied
        return {
          text: "Submit Profile",
          disabled: false,
          className: "bg-brand-purple hover:bg-brand-purple/90 text-white"
        };
    }
  };

  console.log('')

  const profileButtonState = getProfileButtonState();

    // Get allowed platforms list
  const getAvailablePlatforms = () => {
    return Object.entries(allowedPlatforms || {})
      .filter(([_, config]) => config.allowedOnCampaign)
      .map(([platform]) => platform)
  }

  const availablePlatforms = getAvailablePlatforms()

  // useEffect(() => {
  //   const checkFarcaster = async () => {
  //     try {
  //       const farcasterStatus = await sdk.isInMiniApp()
  //       setIsFarcaster(farcasterStatus)
  //     } catch (error) {
  //       console.error("Error checking Farcaster status:", error)
  //       setIsFarcaster(false)
  //     }
  //   }
  //   checkFarcaster()
  // }, [])

  const { getUserAddress } = useWeb3()

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profilePlatform) {
      await showAlert("Please select your social media platform!")
      return
    }

    if (!profileUrl) {
      await showAlert("Please provide your profile URL!")
      return
    }

    setIsSubmitting(true)

    try {
      const userAddress = await getUserAddress()
      if (!userAddress) {
        await showAlert("Please sign in first! Then we can proceed..😀")
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/applyQuest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          platform: profilePlatform,
          profile: profileUrl,
          questId
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        await showAlert(`${data.error.msg || data.error || "Profile verification failed"}`)
        return
      }


      if(data.message == 'success'){
        await showAlert('Submitted! Once you are approved we shall send you an email.')
        
      }else{
        await showAlert(data.message)
      }

      setPlatform(profilePlatform) // Auto-set the platform for content submission
      // setCurrentStep(2)
    } catch (e: any) {
      await showAlert(`${e}`)
    } finally {
      setIsSubmitting(false)
      router.replace(`${location.pathname}?t=${Date.now()}`)
    }
  }

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!platform) {
      await showAlert("You did not select the social media platform where you posted the video!")
      return
    }

    if (!contentUrl) {
      await showAlert('Video URL of your post is missing!')
      return
    }

    setIsSubmitting(true)

    try {
      const userAddress = await getUserAddress()
      
      if (!userAddress) {
        await showAlert("Please sign in first! Then we can proceed..😀")
        return
      }

      const confirmSubmission = await showConfirm('Please be aware that you can only submit once for a single quest. Do you wish to proceed?🙂')
      if (!confirmSubmission) return 

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/submitQuest/${questId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          platform,
          contentUrl,
          ...(approvalNeeded && { profileUrl }) // Include profileUrl if approval is needed
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        await showAlert(`${data.error.msg || data.error.message ||  data.error || "Something went wrong"}`)
        return
      }

      await showAlert("Quest was submitted successfully! Best of luck in getting rewarded😎")

      setPlatform("")
      setProfilePlatform("")
      setContentUrl("")
      setProfileUrl("")
      setCurrentStep(1)
    } catch (e: any) {
      await showAlert(`${e}`)
    } finally {
      setIsSubmitting(false)
      router.replace(`${location.pathname}?t=${Date.now()}`)
    }
  }

  return (

    <div>
      
      <AlertComponent />
      <ConfirmComponent />

      {/* Two-step form for approval-needed quests */}
      {approvalNeeded ? (


        <div>
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-start space-x-2 hidden">
          </div>
      
        {applicationStatus === 'pending' || applicationStatus === 'notLoggedIn' || applicationStatus === 'notApplied' && (
            <div className="mt-2 p-2  bg-yellow-50 border border-yellow-200 rounded flex items-start space-x-2">
               <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800">

                 <strong>Appoval needed:</strong> The brand has limited this quest to only the content creators that will get approved.  </p>

            </div>
          )}

          {applicationStatus === 'approved' && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-800">
                <strong>Approved!</strong> You can now submit your video.
              </p>
            </div>
          )}

          {applicationStatus === 'rejected' && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-start space-x-2">
              <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800">
                <strong>Denied:</strong> This brand did not approve you. Please try other quests.
              </p>
            </div>
          )}

          <h3 className="font-bold mb-4 mt-3 text-brand-purple">Step 1: Get approved</h3>
          <h5 className="mb-4 text-brand-dark">Submit your social media profile</h5>
            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="profilePlatform" className="block text-sm text-gray-600 mb-1">
                    Social Platform
                  </label>
                  <Select value={profilePlatform} onValueChange={setProfilePlatform}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-800">
                    {availablePlatforms.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="profileUrl" className="block text-sm text-gray-600 mb-1">
                    Profile URL
                  </label>
                  <Input
                    id="profileUrl"
                    placeholder={`https://${profilePlatform || 'platform'}.com/yourusername`}
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    className="bg-white border-gray-300 text-gray-800" 
                    required
                  />
                </div>


              <Button
                type="submit"
                className={`w-full ${profileButtonState.className}`}
                disabled={profileButtonState.disabled || isSubmitting}
              >
                {isSubmitting ? "Sending profile..." : profileButtonState.text}
              </Button>
              </div>
            </form>

          <h3 className="font-bold mb-4 mt-6 text-brand-purple">Step 2: Submit video</h3>
          <h5 className="mb-4 text-brand-dark">Submit your short video</h5>
            <form onSubmit={handleContentSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="platform" className="block text-sm text-gray-600 mb-1">
                    Platform
                  </label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>


                      {applicationStatus !== 'approved' && (
                      <SelectContent className="bg-white border-gray-200 text-gray-800">
                        {availablePlatforms.map(platform => (
                          <SelectItem key={platform} value={platform}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}

                    {applicationStatus === 'approved' && appliedPlatform && (
                        <SelectContent className="bg-white border-gray-200 text-gray-800">
                            <SelectItem key={appliedPlatform} value={appliedPlatform}>
                              {appliedPlatform.charAt(0).toUpperCase() + appliedPlatform.slice(1)}
                            </SelectItem>
                        </SelectContent>
                    )}
                          
  </Select>
                </div>

                <div>
                  <label htmlFor="contentUrl" className="block text-sm text-gray-600 mb-1">
                    Video URL
                  </label>
                  <Input
                    id="contentUrl"
                    placeholder="https://"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="bg-white border-gray-300 text-gray-800" 
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white"
                    disabled={isSubmitting || applicationStatus !== 'approved'}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Video"}
                  </Button>
                </div>
              </div>
            </form>
           {/* )} */}
        </div>
      ) : (
        <form onSubmit={handleContentSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="platform" className="block text-sm text-gray-600 mb-1">
                Platform
              </label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-800">
                  {availablePlatforms.map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="contentUrl" className="block text-sm text-gray-600 mb-1">
                Content URL
              </label>
              <Input
                id="contentUrl"
                placeholder="https://"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                className="bg-white border-gray-300 text-gray-800" 
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Quest"}
            </Button>
          </div>
        </form>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        By submitting, you confirm that your content meets all quest requirements and you agree to our Terms of Service.
      </div>
    </div>
  )
}