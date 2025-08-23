"use client"

import type React from "react"

import {useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { useWeb3 } from "@/contexts/useWeb3"
import CurrencyDisplay from '@/components/CurrencyDisplay';
import {useAlert} from "@/components/custom-popup"
import {useConfirm} from '@/components/custom-confirm'
import { PaymentModal } from "@/components/payment-modal"
import { Users, UserCheck, TrendingUp, MessageCircle, Hash, AlertCircle } from "lucide-react"
import { FaTiktok, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useAccount, useConnect, useDisconnect } from "wagmi";
import AuthGuard from "@/components/AuthGuard";

interface PlatformRequirement {
  platform: string
  minFollowers: number
  enabled: boolean
  icon: React.ReactNode
  color: string
}


let hasConnectedMiniPay = false;

export default function CreateQuestPage() {
const router = useRouter()

const { showAlert, AlertComponent } = useAlert()
const { showConfirm, ConfirmComponent } = useConfirm()
const { address, isConnected } = useAccount();

    // 🚀 Auto-connect MiniPay if detected
    useEffect(() => {
      if (typeof window !== "undefined") {
        if (window.ethereum?.isMiniPay && !hasConnectedMiniPay) {
          hasConnectedMiniPay = true;
        }
      }
    }, []);
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Inside your CreateQuestPage component
const { sendCUSD, checkCUSDBalance, getUserAddress, approveSpending, createQuest, checkTokenBalances, checkCombinedTokenBalances, depositToEscrowOnSolana } = useWeb3();
const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Form state
  const [title, setTitle] = useState("")
  const [brand, setBrandName] = useState("")
  // const [rewardCriteria, setRewardCriteria] = useState("")
  const [category, setCategory] = useState("Create video")
  // const [description, setDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [prizePool, setPrizePool] = useState("")
  const [deadline, setDeadline] = useState("")
  const [minFollowers, setMinFollowers] = useState("")
  // const [requirements, setRequirements] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  // const [videosToReward, setVideosToReward] = useState("10")
  const [requirements, setRequirements] = useState("")
  const [participationType, setParticipationType] = useState("open") // "open" or "approval"

  // Approval-based reward state
  const [maxCreators, setMaxCreators] = useState("")
  const [paymentPerCreator, setPaymentPerCreator] = useState("")


    // Reward distribution state
  const [videosToReward, setVideosToReward] = useState("")
  const [rewardPerVideo, setRewardPerVideo] = useState("")

  // Final submissions
  const[_numberOfCreators, setFinalNumberOfCreators] = useState("")
  const[_rewardPerCreator, setFinalRewardPerCreator] = useState("")

  // Platform requirements state
  const [platformRequirements, setPlatformRequirements] = useState<PlatformRequirement[]>([
    {
      platform: "TikTok",
      minFollowers: 50,
      enabled: false,
      icon: <FaTiktok className="h-4 w-4 text-gray-900" />,
      color: "text-pink-600",
    },
    {
      platform: "Instagram",
      minFollowers: 50,
      enabled: false,
      icon: <FaInstagram className="h-4 w-4 text-gray-900" />,
      color: "text-purple-600",
    },
    {
      platform: "X (Twitter)",
      minFollowers: 50,
      enabled: false,
      icon: <FaTwitter className="h-4 w-4 text-gray-900" />,
      color: "text-blue-600",
    },
  ])

  
  const enabledPlatformsCount = platformRequirements.filter((p) => p.enabled).length


  const [uploading, setUploading] = useState(false);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [balanceError, setBalanceError] = useState<{ hasError: boolean;message: string; balance: string; required: string;}>({hasError: false, message: "", balance: "", required: ""});

  const [showPaymentModal, setShowPaymentModal] = useState(false)
const [paymentAddress, setPaymentAddress] = useState<`0x${string}` | null>(null);


  // Calculate total prize pool based on participation type
    useEffect(() => {
    if (participationType === "approval") {
      // For approval required, calculate based on max creators and payment per creator
      if (maxCreators && paymentPerCreator) {
        const numCreators = Number.parseInt(maxCreators)
        const paymentAmount = Number.parseFloat(paymentPerCreator.replace(/[^0-9.]/g, ""))
        if (!isNaN(numCreators) && !isNaN(paymentAmount)) {
          setPrizePool((numCreators * paymentAmount).toString())
          setShowBudgetInput(true)
        }
        } else {
        setPrizePool("")
        setShowBudgetInput(false)
        }
      setVideosToReward("")
      setRewardPerVideo("")
    } else {
      // For open quests, calculate based on videos to reward and reward per video
      if (videosToReward && rewardPerVideo) {
        const numVideos = Number.parseInt(videosToReward)
        const rewardAmount = Number.parseFloat(rewardPerVideo.replace(/[^0-9.]/g, ""))
        if (!isNaN(numVideos) && !isNaN(rewardAmount)) {
          setPrizePool((numVideos * rewardAmount).toString())
          setShowBudgetInput(true)
        }else{
          setShowBudgetInput(false)
        }
      }
      setMaxCreators("")
      setPaymentPerCreator("")
    }
  }, [participationType, videosToReward, rewardPerVideo, maxCreators, paymentPerCreator])

    const handlePlatformToggle = (index: number) => {
    const updated = [...platformRequirements]
    updated[index].enabled = !updated[index].enabled
    setPlatformRequirements(updated)
  }

  const handleMinFollowersChange = (index: number, value: string) => {
    const updated = [...platformRequirements]
    // updated[index].minFollowers = Number.parseInt(value) || 0
    updated[index].minFollowers = Number.parseInt(value)

    setPlatformRequirements(updated)
  }

  // string; required: string;}>({hasError: false, message: "", balance: "", required: ""});

const handleVideosToRewardChange = (value: string) => {
  setVideosToReward(value);

    // Hide budget if value is empty, zero, or invalid
  if (!value || parseFloat(value) <= 0 || !rewardPerVideo) {
    setShowBudgetInput(false);
    setPrizePool(""); // Clear the prize pool value
    return;
  }
  
  if (value && rewardPerVideo) {
    const budget = parseFloat(value) * parseFloat(rewardPerVideo);
    setPrizePool(budget.toString());
    setShowBudgetInput(true);
  }
};

const handleRewardPerVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

    // Allow only numbers and an optional single dot for decimals
  if (/^\d*\.?\d*$/.test(value)) {
    setRewardPerVideo(value);
  }else{
    return;
  }

    // Hide budget if value is empty, zero, or invalid
  if (!value || parseFloat(value) <= 0 || !videosToReward) {
    setShowBudgetInput(false);
    setPrizePool(""); // Clear the prize pool value
    return;
  }

  if (value && videosToReward) {
    const budget = parseFloat(videosToReward) * parseFloat(value);
    setPrizePool(budget.toString());
    setShowBudgetInput(true);
  }
};
const handlePaymentPerCreatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

    // Allow only numbers and an optional single dot for decimals
  if (/^\d*\.?\d*$/.test(value)) {
    setPaymentPerCreator(value);
  }else{
    return;
  }
};

  const handleParticipationTypeChange = (value: string) => {
    setParticipationType(value)
  }

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // setShowPaymentModal(true);

  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  try {
    const url = await uploadToCloudinary(file);
    setImageUrl(url);
    console.log("Uploaded image URL:", url);
  } catch (err) {
    await showAlert(`Upload failed : ${err}`)
    // console.error("Upload failed", err);
  }
  setUploading(false);
};

const handlePaymentAndSubmit  = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !brand || !category || !longDescription || !prizePool || !deadline || !imageUrl || !((videosToReward && rewardPerVideo) || (maxCreators && paymentPerCreator))) {
    
    alert(`${videosToReward} ${rewardPerVideo} ${maxCreators} ${paymentPerCreator}`)
    await showAlert("Something is missing! Please fill out all fields!")
    return;
  }

      // Validate platform requirements
    const enabledPlatforms = platformRequirements.filter((p) => p.enabled)
    if (enabledPlatforms.length === 0) {
      await showAlert("Please select at least one platform for your quest")
      return;
    }

    
  const userAddress = await getUserAddress();
  if (!userAddress) {
    await showAlert("Please sign in first!");
    return;
  }

  
  setPaymentAddress(userAddress)

  // Show confirmation dialog for depositing funds
  const confirmDeposit = await showConfirm(`${prizePool} USD will be transfered from your wallet into the prize pool. Confirm to proceed!`);

  if(!confirmDeposit){
  return
  }


const {
  celo: { cUSDBalance, USDTBalance: celoUSDTBalance, USDCBalance: celoUSDCBalance },
  solana: { USDTBalance: solUSDTBalance, USDCBalance: solUSDCBalance },
} = await checkCombinedTokenBalances();

      // Check across all tokens (priority order)
if (Number(cUSDBalance) >= Number(prizePool)) {
  await completeQuestCreation("cusd", 'celo');
} else if (Number(celoUSDTBalance) >= Number(prizePool)) {
  await completeQuestCreation("usdt", 'celo');
} else if (Number(celoUSDCBalance) >= Number(prizePool)) {
  await completeQuestCreation("usdc", 'celo');
} else if (Number(solUSDTBalance) >= Number(prizePool)) {
  await completeQuestCreation("usdt", 'solana');
} else if (Number(solUSDCBalance) >= Number(prizePool)) {
  await completeQuestCreation("usdc", 'solana');
      }else{
        // If user show them a warning and a deep link to go and deposit funds
        // If user in on a different wallet then pop up the deposit modal
        if (typeof window !== "undefined" && window.ethereum?.isMiniPay) {
            setBalanceError({
              hasError: true,
              message: "Insufficient balance to create this quest",
              balance: '0',
              required: '0',
            });
            setPaymentProcessing(false);
            return;
        }else{
            await showAlert("We have noticed you have insufficient balance. We are going to ask you to top up!");
            setShowPaymentModal(true);
        }

      }
};

const completeQuestCreation = async (tokenForPayment: string, network: string | null)=>{
  try{
    // First handle payment
    setPaymentProcessing(true);
    
  try {

    let onchainQuestId;
    let solanaTxId;
      // Test approval
      // let _tokenName = 'cUSD'
      if(network == 'celo'){
        await approveSpending(prizePool, tokenForPayment)
        onchainQuestId = await createQuest(prizePool, tokenForPayment)
      }else if(network == 'solana'){
        console.log('going to pay to solana escorow')
        solanaTxId = await depositToEscrowOnSolana(prizePool, tokenForPayment)
      }

        setIsSubmitting(true);

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // send cookies for auth
            body: JSON.stringify({
              title,
              brand,
              category,
              longDescription,
              prizePool,
              deadline,
              minFollowers,
              imageUrl,
              videosToReward: videosToReward || maxCreators,
              rewardPerVideo: rewardPerVideo || paymentPerCreator,
              onchainQuestId,
              rewardToken: tokenForPayment,
              platformRequirements: platformRequirements.map(({ icon, ...rest }) => rest),
              participationType,
              solanaTxId,
              network
            }),
          });
      
          const data = await res.json();
      
          if (!res.ok) {
            // alert('an error occured')
            throw new Error(data.error || "Something went wrong");
          }
  
      await showAlert('Your quest has been created successfully.')
  
      router.push("/brand/dashboard");
    } catch (paymentError: any) {
      // alert(paymentError)
      // Specific handling for insufficient funds
      if (paymentError.message.includes("insufficient funds") ){
      } else {
        throw paymentError; // Re-throw other errors
      }
    }
} catch (err: any) {
  console.log(err)
  alert(err)
  } finally {
    setPaymentProcessing(false);
    setIsSubmitting(false);
  }
}

  
  return (
       <AuthGuard>
    {/* <div className="min-h-screen bg-brand-light"> */}
    <div className="min-h-screen bg-brand-light overflow-x-hidden"> 
      <AlertComponent />
      <div className="container mx-auto px-4 py-12">
      <ConfirmComponent />
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
          <h1 className="text-3xl font-bold mb-8 text-brand-dark">Create new quest</h1>

          <form onSubmit={handlePaymentAndSubmit }>
            <div className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Basic information</CardTitle>
                  <CardDescription className="text-gray-600">
                    Provide the essential details about your quest
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                <div className="space-y-2">
                      <Label htmlFor="brand" className="text-brand-dark">
                        Brand name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="brand"
                        placeholder="e.g.,Name of your brand/product"
                        value={brand}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="bg-white border-gray-300 text-gray-800"
                        required
                      />
                    </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-brand-dark">
                        Quest title <span className="text-red-500">*</span>
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
                        Quest category <span className="text-red-500">*</span>
                      </Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-800">
                          <SelectItem value="Create video">Video Creation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription" className="text-brand-dark">
                      Detailed description - What you want the content creators to do.
                    </Label>
                    <Textarea
                      id="longDescription"
                      placeholder="Create a video showing your followers...."
                      value={longDescription}

                      onChange={(e) => setLongDescription(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 resize-none h-32"
                      required
                    />
                  </div>

                </CardContent>
              </Card>

              {/* Platform Requirements Card */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Social media requirements</CardTitle>
                  <CardDescription className="text-gray-600">
                    {/* Select platforms and set minimum follower requirements for each */}
                    You are looking for content creators from which platforms?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {platformRequirements.map((platform, index) => (
                      <div
                        key={platform.platform}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          platform.enabled ? "border-brand-purple bg-brand-purple/5" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`platform-${index}`}
                              checked={platform.enabled}
                              onCheckedChange={() => handlePlatformToggle(index)}
                              className="border-brand-purple data-[state=checked]:bg-brand-purple"
                            />
                            <div className="flex items-center space-x-2">
                              <span className={platform.color}>{platform.icon}</span>
                              <Label
                                htmlFor={`platform-${index}`}
                                className="text-brand-dark font-medium cursor-pointer"
                              >
                                {platform.platform}
                              </Label>
                            </div>
                          </div>
                        </div>

                        {platform.enabled && (
                          <div className="ml-6 space-y-2">
                            <Label className="text-sm text-gray-600">Minimum Followers for {platform.platform}</Label>
                            <Input
                              type="number"
                              placeholder="e.g., 1000"
                              value={platform.minFollowers}
                              onChange={(e) => handleMinFollowersChange(index, e.target.value)}
                              className="bg-white border-gray-300 text-gray-800 max-w-xs"
                              min="0"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {enabledPlatformsCount > 0 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Selected {enabledPlatformsCount} platform{enabledPlatformsCount > 1 ? "s" : ""} for your quest
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Participation Type Card */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Quest participation</CardTitle>
                  <CardDescription className="text-gray-600">
                    Choose how creators can participate in your quest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={participationType} 
                    onValueChange={(value) => setParticipationType(value)}
                  >
                    <div className="space-y-4">
                      {/* Open Participation */}
                      <label htmlFor="open" className="block cursor-pointer">
                        <div
                          className={`p-4 rounded-lg border-2 transition-all ${
                            participationType === "open"
                              ? "border-brand-purple bg-brand-purple/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem 
                              value="open" 
                              id="open" 
                              className="mt-1" 
                              // Remove onClick handler here
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Users className="h-5 w-5 text-brand-purple" />
                                <div className="text-brand-dark font-medium">
                                  Open to all creators (Recommended)
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                Any creator meeting your requirements can participate immediately. 
                                You'll reward the best submissions based on your criteria.
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>

                      {/* Approval Required */}
                      <label htmlFor="approval" className="block cursor-pointer">
                        <div
                          className={`p-4 rounded-lg border-2 transition-all ${
                            participationType === "approval"
                              ? "border-brand-purple bg-brand-purple/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem 
                              value="approval" 
                              id="approval" 
                              className="mt-1" 
                              // Remove onClick handler here
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <UserCheck className="h-5 w-5 text-brand-purple" />
                                <div className="text-brand-dark font-medium">
                                  Approval required
                                </div>
                              </div>

                            <p className="text-sm text-gray-600">
                                Creators must submit their profile for approval first. All approved creators will be rewarded
                                after they submit content.

                              </p>
                              {/* <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-yellow-800">
                                  <strong>Note:</strong> If the approved creator submits content that you are not happy with, you can ask them to redo and pay after.
                                </p>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>

                  {/* Summary */}
                  {/* <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Your quest will be:</strong>{" "}
                      {participationType === "open"
                        ? "Open to all creators meeting your requirements"
                        : "Require approval before creators can participate"}
                    </p>
                  </div> */}
                </CardContent>
              </Card>


                <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Reward structure</CardTitle>
                  <CardDescription className="text-gray-600">
                    {/* Set how many content creators will be rewarded and the amount */}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {participationType === "open" ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="videosToReward" className="text-brand-dark">
                            How many content creators will you reward? <span className="text-red-500">*</span>
                          </Label>
                          <Select value={videosToReward} onValueChange={handleVideosToRewardChange} required>
                            <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 text-gray-800">
                              <SelectItem value="3">The best 3 creators</SelectItem>
                              <SelectItem value="5">The best 5 creators</SelectItem>
                              <SelectItem value="10">The best 10 creators</SelectItem>
                              <SelectItem value="20">The best 20 creators</SelectItem>
                              {/* <SelectItem value="30">The best 30 creators</SelectItem>
                              <SelectItem value="50">The best 50 creators</SelectItem> */}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rewardPerVideo" className="text-brand-dark">
                            How much reward per creator? <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="rewardPerVideo"
                            placeholder="e.g., 5 USD"
                            value={rewardPerVideo}
                            onChange={handleRewardPerVideoChange}
                            className="bg-white border-gray-300 text-gray-800"
                            type="text"
                            required
                          />
                        </div>
                      </div>

                      {showBudgetInput && rewardPerVideo && videosToReward !== "" &&  (
                        <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg 
                                className="h-5 w-5 text-pink-400" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-pink-800">
                                Budget
                              </h3>
                              <div className="mt-2 text-sm text-pink-700">
                                <p>
                                  You'll need <span className="font-bold">{prizePool}<CurrencyDisplay/></span> to reward {videosToReward} creators at {rewardPerVideo}<CurrencyDisplay/> each
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="maxCreators" className="text-brand-dark">
                            How many creators are you looking for? <span className="text-red-500">*</span>
                          </Label>
                          <Select value={maxCreators} onValueChange={setMaxCreators} required>
                            <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                              <SelectValue placeholder="Select number of creators" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 text-gray-800">
                              <SelectItem value="3">3 creators</SelectItem>
                              <SelectItem value="5">5 creators</SelectItem>
                              <SelectItem value="10">10 creators</SelectItem>
                              <SelectItem value="15">15 creators</SelectItem>
                              {/* <SelectItem value="20">20 creators</SelectItem>
                              <SelectItem value="30">30 creators</SelectItem> */}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="paymentPerCreator" className="text-brand-dark">
                            How much will you reward each creator? <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="paymentPerCreator"
                            placeholder="e.g., 20 USD"
                            value={paymentPerCreator}
                            onChange={handlePaymentPerCreatorChange}
                            className="bg-white border-gray-300 text-gray-800"
                            type="text"
                            required
                          />
                        </div>
                      </div>

                      {showBudgetInput && maxCreators && paymentPerCreator && (
                        <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg 
                                className="h-5 w-5 text-pink-400" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-pink-800">
                                Budget
                              </h3>
                              <div className="mt-2 text-sm text-pink-700">
                                <p>
                                  You'll need <span className="font-bold">{prizePool}<CurrencyDisplay/></span> to reward {maxCreators} creators at {paymentPerCreator}<CurrencyDisplay/> each
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}


                      {/* <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-orange-800">
                            <strong>Important:</strong> You'll review and approve up to {maxCreators || "X"} creators.
                            Each approved creator who submits content will receive $
                            {paymentPerCreator.replace(/[^0-9.]/g, "") || "X"}.
                          </p>
                        </div>
                      </div> */}
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-brand-dark">
                      Deadline - Quest ends on.<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800"
                      min={new Date().toISOString().split("T")[0]}
                      max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </CardContent>
              </Card>




              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Media</CardTitle>
                  <CardDescription className="text-gray-600">Add visual elements to your quest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-brand-dark">
                      Brand logo/Image
                    </Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 hidden"
                      
                    />
                  </div>


                  <div className="bg-brand-light p-4 rounded-lg border border-dashed border-gray-300 text-center">

        <input type="file" required accept="image/*" onChange={handleImageUpload} />
        {uploading && <p className="text-lg text-gray-500">Uploading...wait patiently!</p>}

        {imageUrl && (
        <div className="mt-2 space-y-2">
            <img src={imageUrl} alt="Preview" className="w-40 rounded shadow" />
        </div>
        )}


                    <p className="text-xs text-gray-500 mt-2">Recommended size: 1200 x 800px, Max 5MB</p>
                  </div>


                </CardContent>
              </Card>

              {balanceError.hasError && (
                <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {/* {balanceError.message} You have {balanceError.balance} cUSD but need {balanceError.required} cUSD. */}
                        Insufficient funds.
                        {hasConnectedMiniPay && (
                          <Link 
                          href="https://minipay.opera.com/add_cash" 
                          className="ml-2 font-medium text-red-700 underline hover:text-red-600"
                        >
                          Click here to top up
                        </Link>
                      )}
                        
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                  disabled={isSubmitting || paymentProcessing}
                >
                      {paymentProcessing ? "Processing payment..." : 
                       isSubmitting ? "Creating..." : "Create Quest"}
                </Button>

                <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onPaymentComplete={(tokenSymbol, network) => completeQuestCreation(tokenSymbol, network)} prizePool={prizePool} paymentAddress={paymentAddress} isConnected={isConnected} />

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
