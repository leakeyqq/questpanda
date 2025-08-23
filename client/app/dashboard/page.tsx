'use client'

import Link from "next/link"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAccount } from "wagmi";
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useWeb3 } from "@/contexts/useWeb3"
import { CopyButton } from "@/components/copyButton"
import { Gift, Trophy, Award, User } from 'lucide-react';
import { X, Instagram, Music, TrendingUp, DollarSign, Star, Zap, Target, Calendar, Clock, Eye, Wallet, ExternalLink, Users  } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// components/SocialPlatformIcon.tsx
import { FaYoutube, FaTwitter, FaInstagram, FaTiktok, FaTwitch, FaFacebook, FaGlobe } from 'react-icons/fa';
import { useAlert } from "@/components/custom-popup"
import AuthGuard from "@/components/AuthGuard";
import { useRouter } from 'next/navigation'



type PlatformIconProps = {
  platform?: string;
  className?: string;
};

export const SocialPlatformIcon = ({ platform, className }: PlatformIconProps) => {
  if (!platform) return <FaGlobe className={className} />;

  const platformLower = platform.toLowerCase();

  if (platformLower.includes('youtube')) return <FaYoutube className={className} />;
  if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <FaTwitter className={className} />;
  if (platformLower.includes('instagram')) return <FaInstagram className={className} />;
  if (platformLower.includes('tiktok')) return <FaTiktok className={className} />;

  return <FaGlobe className={className} />;
};


interface Quest {
  _id: string; // Can be string or ObjectId
  createdByAddress: string;
  brandName: string;
  title: string;
  brandImageUrl: string;
  description: string;
  rewardCriteria: string;
  prizePoolUsd: string;
  minFollowerCount: number;
  visibleOnline: boolean;
  endsOn: Date | string;
  submissions: Array<{
    submittedByAddress?: string;
    socialPlatformName?: string;
    videoLink?: string;
    comments?: string;
    rewarded?: boolean;
    rewardAmountUsd?: string;
    submissionRead?: boolean;
    submittedAtTime?: Date;
    rewardedAtTime?: Date;
  }>;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
  videosToBeAwarded?: number;
  pricePerVideo?: string | number;
  _submissionRewarded?: boolean;
  _submissionRejected?: boolean;
  _rewardedAmount?: string;
  _platformPosted?: string;
  _videoUrl?: string;
  _submittedOn: Date;
}
interface LinkedAccount {
  name: string;
  username: string;
  url: string;
  profilePicture?: string;
  followers: number;
}

interface LinkedAccounts {
  twitter: LinkedAccount | null;
  tiktok: LinkedAccount | null;
  instagram: LinkedAccount | null;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [totalEarnings, setTotalEarnings] = useState('0')
  const [totalWithdrawn, setTotalWithdrawn] = useState('0')
  const [totalBalance, setTotalBalance] = useState('0')
  const [walletBalance, setWalletBalance] = useState(0)
  const { showAlert, AlertComponent } = useAlert()
  const { checkCUSDBalance, isWalletReady } = useWeb3();
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccounts>({
      twitter: null,
      tiktok: null,
      instagram: null
      });

  // Add to your existing state declarations
  const [isVerified, setIsVerified] = useState(false);
  const [country, setCountry] = useState<string | null>(null);
  const router = useRouter()


  useEffect(() => {
    if (isConnected && address && isWalletReady) {
      setLoading(true);
      try {
        const getCreatorDetails = async () => {
          let fake_amount = '1'
          const balanceCheck = await checkCUSDBalance(fake_amount);
          setWalletBalance(Number(balanceCheck.balance))

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/creator`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })

          if (res.ok) {
            const data = await res.json();
            console.log('Creator data:', data);

            setTotalEarnings(data.creator.totalEarnings)
            setTotalWithdrawn(data.creator.totalWithdrawn)
            setTotalBalance(data.creator.earningsBalance)

            // Filter out duplicate quests before setting state
            const uniqueQuests = data.quests.filter((quest: Quest, index: any, self: Quest[]) => 
              index === self.findIndex((q: Quest) => q._id === quest._id)
            );
            setQuests(uniqueQuests)

            // Update linked accounts based on what's in the creator data
            setLinkedAccounts({
              twitter: data.creator.twitterData ? {
                username: data.creator.twitterData.userName,
                url: `https://twitter.com/${data.creator.twitterData.userName}`,
                profilePicture: data.creator.twitterData.cloudinary_profilePicture,
                name: data.creator.twitterData.name,
                followers: data.creator.twitterData.followers
              } : null,
              tiktok: data.creator.tiktokData ? {
                username: data.creator.tiktokData.userName,
                url: `https://tiktok.com/@${data.creator.tiktokData.userName}`,
                profilePicture: data.creator.tiktokData.cloudinary_profilePicture,
                name: data.creator.tiktokData.name,
                followers: data.creator.tiktokData.followers
              } : null,
              instagram: data.creator.instagramData ? {
                username: data.creator.instagramData.userName,
                url: `https://instagram.com/${data.creator.instagramData.userName}`,
                profilePicture: data.creator.instagramData.cloudinary_profilePicture,
                name: data.creator.instagramData.name,
                followers: data.creator.instagramData.followers
              } : null
            });

          }

        }
        getCreatorDetails();
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false);
      }
    }
  }, [isConnected, address, isWalletReady])


  useEffect(() => {
  console.log('Linked accounts state:', linkedAccounts);
}, [linkedAccounts]);

  // Add this useEffect hook to check verification status
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!address) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verification/verificationStatus`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsVerified(data.user?.selfProtocol?.verified || false);
          setCountry(data.user?.selfProtocol?.countryOfUser || null);
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };

    checkVerificationStatus();
  }, [address]);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [currentPlatform, setCurrentPlatform] = useState("")
  const [profileUrl, setProfileUrl] = useState("")

  const handleLinkAccount = (platform: string) => {
    setCurrentPlatform(platform)
    // setProfileUrl(linkedAccounts[platform as keyof typeof linkedAccounts] || "")
    setIsLinkModalOpen(true)
  }

  const handleSaveLink = async () => {

    try {
      // Make API request to save the link
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/creator/linkProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", // send cookies for auth

        body: JSON.stringify({
          socialPlatform: currentPlatform,
          profileUrl: profileUrl
        })
      });

      const data = await response.json();

      console.log('data is ', data)


      if (data.message == 'failed') {
        setIsLinkModalOpen(false)
        setProfileUrl("")
        await showAlert(data.error || "An error occurred")
        return 
      }

    } catch (error) {
      // if (error instanceof Error) {
      //   await showAlert(error.message || "An error occurred");
      // } else {
      //   await showAlert("An unknown error occurred");
      // }

    }
    // setLinkedAccounts(prev => ({
    //   ...prev,
    //   [currentPlatform]: profileUrl
    // }))

    setIsLinkModalOpen(false)
    // setProfileUrl("")
    // setCurrentPlatform("")
    await showAlert("Profile was linked successfully😛");
    router.replace(`${location.pathname}?t=${Date.now()}`)


  }

  const handleUnlink = (platform: string) => {
    setLinkedAccounts(prev => ({
      ...prev,
      [platform]: ""
    }))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        // return <X className="w-5 h-5" />
        return <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-md shadow-gray-200 group transition-all duration-300">
          <svg className="transition-all duration-300 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 72 72" fill="none">
            <path d="M40.7568 32.1716L59.3704 11H54.9596L38.7974 29.383L25.8887 11H11L30.5205 38.7983L11 61H15.4111L32.4788 41.5869L46.1113 61H61L40.7557 32.1716H40.7568ZM34.7152 39.0433L32.7374 36.2752L17.0005 14.2492H23.7756L36.4755 32.0249L38.4533 34.7929L54.9617 57.8986H48.1865L34.7152 39.0443V39.0433Z" fill="black" />
          </svg>
        </button>

      case "tiktok":
        return <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-md shadow-gray-200 group transition-all duration-300">
          <svg className="transition-all duration-300 group-hover:scale-110" width="28" height="28" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M45.6721 29.4285C48.7387 31.6085 52.4112 32.7733 56.1737 32.7592V25.3024C55.434 25.3045 54.6963 25.2253 53.9739 25.0663V31.0068C50.203 31.0135 46.5252 29.8354 43.4599 27.6389V42.9749C43.4507 45.4914 42.7606 47.9585 41.4628 50.1146C40.165 52.2706 38.3079 54.0353 36.0885 55.2215C33.8691 56.4076 31.37 56.9711 28.8563 56.852C26.3426 56.733 23.9079 55.9359 21.8105 54.5453C23.7506 56.5082 26.2295 57.8513 28.9333 58.4044C31.6372 58.9576 34.4444 58.6959 36.9994 57.6526C39.5545 56.6093 41.7425 54.8312 43.2864 52.5436C44.8302 50.256 45.6605 47.5616 45.6721 44.8018V29.4285ZM48.3938 21.8226C46.8343 20.1323 45.8775 17.9739 45.6721 15.6832V14.7139H43.5842C43.8423 16.1699 44.4039 17.5553 45.2326 18.78C46.0612 20.0048 47.1383 21.0414 48.3938 21.8226ZM26.645 48.642C25.9213 47.6957 25.4779 46.5653 25.365 45.3793C25.2522 44.1934 25.4746 42.9996 26.0068 41.9338C26.5391 40.8681 27.3598 39.9731 28.3757 39.3508C29.3915 38.7285 30.5616 38.4039 31.7529 38.4139C32.4106 38.4137 33.0644 38.5143 33.6916 38.7121V31.0068C32.9584 30.9097 32.2189 30.8682 31.4794 30.8826V36.8728C29.9522 36.39 28.2992 36.4998 26.8492 37.1803C25.3992 37.8608 24.2585 39.0621 23.6539 40.5454C23.0494 42.0286 23.0252 43.6851 23.5864 45.1853C24.1475 46.6855 25.2527 47.9196 26.6823 48.642H26.645Z" fill="#EE1D52" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M43.4589 27.5892C46.5241 29.7857 50.2019 30.9638 53.9729 30.9571V25.0166C51.8243 24.5623 49.8726 23.4452 48.3927 21.8226C47.1372 21.0414 46.0601 20.0048 45.2315 18.78C44.4029 17.5553 43.8412 16.1699 43.5831 14.7139H38.09V44.8018C38.0849 46.1336 37.6629 47.4304 36.8831 48.51C36.1034 49.5897 35.0051 50.3981 33.7425 50.8217C32.4798 51.2453 31.1162 51.2629 29.8431 50.872C28.57 50.4811 27.4512 49.7012 26.6439 48.642C25.3645 47.9965 24.3399 46.9387 23.7354 45.6394C23.1309 44.3401 22.9818 42.875 23.3121 41.4805C23.6424 40.0861 24.4329 38.8435 25.556 37.9535C26.6791 37.0634 28.0693 36.5776 29.5023 36.5745C30.1599 36.5766 30.8134 36.6772 31.4411 36.8728V30.8826C28.7288 30.9477 26.0946 31.8033 23.8617 33.3444C21.6289 34.8855 19.8946 37.0451 18.8717 39.5579C17.8489 42.0708 17.5821 44.8276 18.1039 47.49C18.6258 50.1524 19.9137 52.6045 21.8095 54.5453C23.9073 55.9459 26.3458 56.7512 28.8651 56.8755C31.3845 56.9997 33.8904 56.4383 36.1158 55.2509C38.3413 54.0636 40.2031 52.2948 41.5027 50.133C42.8024 47.9712 43.4913 45.4973 43.4962 42.9749L43.4589 27.5892Z" fill="black" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M53.9736 25.0161V23.4129C52.0005 23.4213 50.0655 22.8696 48.3934 21.8221C49.8695 23.4493 51.8229 24.5674 53.9736 25.0161ZM43.5838 14.7134C43.5838 14.4275 43.4968 14.1292 43.4596 13.8434V12.874H35.8785V42.9744C35.872 44.6598 35.197 46.2738 34.0017 47.4621C32.8064 48.6504 31.1885 49.3159 29.503 49.3126C28.5106 49.3176 27.5311 49.0876 26.6446 48.6415C27.4519 49.7007 28.5707 50.4805 29.8438 50.8715C31.1169 51.2624 32.4805 51.2448 33.7432 50.8212C35.0058 50.3976 36.1041 49.5892 36.8838 48.5095C37.6636 47.4298 38.0856 46.1331 38.0907 44.8013V14.7134H43.5838ZM31.4418 30.8696V29.167C28.3222 28.7432 25.1511 29.3885 22.4453 30.9977C19.7394 32.6069 17.6584 35.0851 16.5413 38.0284C15.4242 40.9718 15.337 44.2067 16.2938 47.206C17.2506 50.2053 19.195 52.792 21.8102 54.5448C19.9287 52.5995 18.6545 50.1484 18.1433 47.4908C17.6321 44.8333 17.906 42.0844 18.9315 39.5799C19.957 37.0755 21.6897 34.924 23.918 33.3882C26.1463 31.8524 28.7736 30.9988 31.4791 30.9318L31.4418 30.8696Z" fill="#69C9D0" />
          </svg>

        </button>
      case "instagram":
        return <button className="w-10 h-10 flex items-center justify-center group rounded-lg bg-white shadow-md shadow-gray-200 group transition-all duration-300">
          <svg className="transition-all duration-300 group-hover:scale-110" width="28" height="28" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4456 35.7808C27.4456 31.1786 31.1776 27.4468 35.7826 27.4468C40.3875 27.4468 44.1216 31.1786 44.1216 35.7808C44.1216 40.383 40.3875 44.1148 35.7826 44.1148C31.1776 44.1148 27.4456 40.383 27.4456 35.7808ZM22.9377 35.7808C22.9377 42.8708 28.6883 48.618 35.7826 48.618C42.8768 48.618 48.6275 42.8708 48.6275 35.7808C48.6275 28.6908 42.8768 22.9436 35.7826 22.9436C28.6883 22.9436 22.9377 28.6908 22.9377 35.7808ZM46.1342 22.4346C46.1339 23.0279 46.3098 23.608 46.6394 24.1015C46.9691 24.595 47.4377 24.9797 47.9861 25.2069C48.5346 25.4342 49.1381 25.4939 49.7204 25.3784C50.3028 25.2628 50.8378 24.9773 51.2577 24.5579C51.6777 24.1385 51.9638 23.6041 52.0799 23.0222C52.1959 22.4403 52.1367 21.8371 51.9097 21.2888C51.6828 20.7406 51.2982 20.2719 50.8047 19.942C50.3112 19.6122 49.7309 19.436 49.1372 19.4358H49.136C48.3402 19.4361 47.5771 19.7522 47.0142 20.3144C46.4514 20.8767 46.1349 21.6392 46.1342 22.4346ZM25.6765 56.1302C23.2377 56.0192 21.9121 55.6132 21.0311 55.2702C19.8632 54.8158 19.0299 54.2746 18.1538 53.4002C17.2777 52.5258 16.7354 51.6938 16.2827 50.5266C15.9393 49.6466 15.533 48.3214 15.4222 45.884C15.3009 43.2488 15.2767 42.4572 15.2767 35.781C15.2767 29.1048 15.3029 28.3154 15.4222 25.678C15.5332 23.2406 15.9425 21.918 16.2827 21.0354C16.7374 19.8682 17.2789 19.0354 18.1538 18.1598C19.0287 17.2842 19.8612 16.7422 21.0311 16.2898C21.9117 15.9466 23.2377 15.5406 25.6765 15.4298C28.3133 15.3086 29.1054 15.2844 35.7826 15.2844C42.4598 15.2844 43.2527 15.3106 45.8916 15.4298C48.3305 15.5408 49.6539 15.9498 50.537 16.2898C51.7049 16.7422 52.5382 17.2854 53.4144 18.1598C54.2905 19.0342 54.8308 19.8682 55.2855 21.0354C55.6289 21.9154 56.0351 23.2406 56.146 25.678C56.2673 28.3154 56.2915 29.1048 56.2915 35.781C56.2915 42.4572 56.2673 43.2466 56.146 45.884C56.0349 48.3214 55.6267 49.6462 55.2855 50.5266C54.8308 51.6938 54.2893 52.5266 53.4144 53.4002C52.5394 54.2738 51.7049 54.8158 50.537 55.2702C49.6565 55.6134 48.3305 56.0194 45.8916 56.1302C43.2549 56.2514 42.4628 56.2756 35.7826 56.2756C29.1024 56.2756 28.3125 56.2514 25.6765 56.1302ZM25.4694 10.9322C22.8064 11.0534 20.9867 11.4754 19.3976 12.0934C17.7518 12.7316 16.3585 13.5878 14.9663 14.977C13.5741 16.3662 12.7195 17.7608 12.081 19.4056C11.4626 20.9948 11.0403 22.8124 10.9191 25.4738C10.7958 28.1394 10.7676 28.9916 10.7676 35.7808C10.7676 42.57 10.7958 43.4222 10.9191 46.0878C11.0403 48.7494 11.4626 50.5668 12.081 52.156C12.7195 53.7998 13.5743 55.196 14.9663 56.5846C16.3583 57.9732 17.7518 58.8282 19.3976 59.4682C20.9897 60.0862 22.8064 60.5082 25.4694 60.6294C28.138 60.7506 28.9893 60.7808 35.7826 60.7808C42.5759 60.7808 43.4286 60.7526 46.0958 60.6294C48.759 60.5082 50.5774 60.0862 52.1676 59.4682C53.8124 58.8282 55.2066 57.9738 56.5989 56.5846C57.9911 55.1954 58.8438 53.7998 59.4842 52.156C60.1026 50.5668 60.5268 48.7492 60.6461 46.0878C60.7674 43.4202 60.7956 42.57 60.7956 35.7808C60.7956 28.9916 60.7674 28.1394 60.6461 25.4738C60.5248 22.8122 60.1026 20.9938 59.4842 19.4056C58.8438 17.7618 57.9889 16.3684 56.5989 14.977C55.2088 13.5856 53.8124 12.7316 52.1696 12.0934C50.5775 11.4754 48.7588 11.0514 46.0978 10.9322C43.4306 10.811 42.5779 10.7808 35.7846 10.7808C28.9913 10.7808 28.138 10.809 25.4694 10.9322Z" fill="url(#paint0_radial_7092_54471)" />
            <path d="M27.4456 35.7808C27.4456 31.1786 31.1776 27.4468 35.7826 27.4468C40.3875 27.4468 44.1216 31.1786 44.1216 35.7808C44.1216 40.383 40.3875 44.1148 35.7826 44.1148C31.1776 44.1148 27.4456 40.383 27.4456 35.7808ZM22.9377 35.7808C22.9377 42.8708 28.6883 48.618 35.7826 48.618C42.8768 48.618 48.6275 42.8708 48.6275 35.7808C48.6275 28.6908 42.8768 22.9436 35.7826 22.9436C28.6883 22.9436 22.9377 28.6908 22.9377 35.7808ZM46.1342 22.4346C46.1339 23.0279 46.3098 23.608 46.6394 24.1015C46.9691 24.595 47.4377 24.9797 47.9861 25.2069C48.5346 25.4342 49.1381 25.4939 49.7204 25.3784C50.3028 25.2628 50.8378 24.9773 51.2577 24.5579C51.6777 24.1385 51.9638 23.6041 52.0799 23.0222C52.1959 22.4403 52.1367 21.8371 51.9097 21.2888C51.6828 20.7406 51.2982 20.2719 50.8047 19.942C50.3112 19.6122 49.7309 19.436 49.1372 19.4358H49.136C48.3402 19.4361 47.5771 19.7522 47.0142 20.3144C46.4514 20.8767 46.1349 21.6392 46.1342 22.4346ZM25.6765 56.1302C23.2377 56.0192 21.9121 55.6132 21.0311 55.2702C19.8632 54.8158 19.0299 54.2746 18.1538 53.4002C17.2777 52.5258 16.7354 51.6938 16.2827 50.5266C15.9393 49.6466 15.533 48.3214 15.4222 45.884C15.3009 43.2488 15.2767 42.4572 15.2767 35.781C15.2767 29.1048 15.3029 28.3154 15.4222 25.678C15.5332 23.2406 15.9425 21.918 16.2827 21.0354C16.7374 19.8682 17.2789 19.0354 18.1538 18.1598C19.0287 17.2842 19.8612 16.7422 21.0311 16.2898C21.9117 15.9466 23.2377 15.5406 25.6765 15.4298C28.3133 15.3086 29.1054 15.2844 35.7826 15.2844C42.4598 15.2844 43.2527 15.3106 45.8916 15.4298C48.3305 15.5408 49.6539 15.9498 50.537 16.2898C51.7049 16.7422 52.5382 17.2854 53.4144 18.1598C54.2905 19.0342 54.8308 19.8682 55.2855 21.0354C55.6289 21.9154 56.0351 23.2406 56.146 25.678C56.2673 28.3154 56.2915 29.1048 56.2915 35.781C56.2915 42.4572 56.2673 43.2466 56.146 45.884C56.0349 48.3214 55.6267 49.6462 55.2855 50.5266C54.8308 51.6938 54.2893 52.5266 53.4144 53.4002C52.5394 54.2738 51.7049 54.8158 50.537 55.2702C49.6565 55.6134 48.3305 56.0194 45.8916 56.1302C43.2549 56.2514 42.4628 56.2756 35.7826 56.2756C29.1024 56.2756 28.3125 56.2514 25.6765 56.1302ZM25.4694 10.9322C22.8064 11.0534 20.9867 11.4754 19.3976 12.0934C17.7518 12.7316 16.3585 13.5878 14.9663 14.977C13.5741 16.3662 12.7195 17.7608 12.081 19.4056C11.4626 20.9948 11.0403 22.8124 10.9191 25.4738C10.7958 28.1394 10.7676 28.9916 10.7676 35.7808C10.7676 42.57 10.7958 43.4222 10.9191 46.0878C11.0403 48.7494 11.4626 50.5668 12.081 52.156C12.7195 53.7998 13.5743 55.196 14.9663 56.5846C16.3583 57.9732 17.7518 58.8282 19.3976 59.4682C20.9897 60.0862 22.8064 60.5082 25.4694 60.6294C28.138 60.7506 28.9893 60.7808 35.7826 60.7808C42.5759 60.7808 43.4286 60.7526 46.0958 60.6294C48.759 60.5082 50.5774 60.0862 52.1676 59.4682C53.8124 58.8282 55.2066 57.9738 56.5989 56.5846C57.9911 55.1954 58.8438 53.7998 59.4842 52.156C60.1026 50.5668 60.5268 48.7492 60.6461 46.0878C60.7674 43.4202 60.7956 42.57 60.7956 35.7808C60.7956 28.9916 60.7674 28.1394 60.6461 25.4738C60.5248 22.8122 60.1026 20.9938 59.4842 19.4056C58.8438 17.7618 57.9889 16.3684 56.5989 14.977C55.2088 13.5856 53.8124 12.7316 52.1696 12.0934C50.5775 11.4754 48.7588 11.0514 46.0978 10.9322C43.4306 10.811 42.5779 10.7808 35.7846 10.7808C28.9913 10.7808 28.138 10.809 25.4694 10.9322Z" fill="url(#paint1_radial_7092_54471)" />
            <defs>
              <radialGradient id="paint0_radial_7092_54471" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.4144 61.017) scale(65.31 65.2708)">
                <stop offset="0.09" stop-color="#FA8F21" />
                <stop offset="0.78" stop-color="#D82D7E" />
              </radialGradient>
              <radialGradient id="paint1_radial_7092_54471" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41.1086 63.257) scale(51.4733 51.4424)">
                <stop offset="0.64" stop-color="#8C3AAA" stop-opacity="0" />
                <stop offset="1" stop-color="#8C3AAA" />
              </radialGradient>
            </defs>
          </svg>

        </button>
      default:
        return null
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "X (Twitter)"
      case "tiktok":
        return "TikTok"
      case "instagram":
        return "Instagram"
      default:
        return platform
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "text-black"
      case "tiktok":
        return "text-pink-600"
      case "instagram":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }



  return (
    <div>
      {loading ? (
        <div>Loading your dashboard...</div>
      ) : (

        <AuthGuard>

          <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light/50">
            <AlertComponent />

            {/* Hero Header */}
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 relative overflow-hidden border-b border-gray-100">
              <div className="absolute inset-0 bg-gray-50/30"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/5 rounded-full -translate-y-48 translate-x-48"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-pink/5 rounded-full translate-y-32 -translate-x-32"></div>

              <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="text-brand-dark">
                    <div className="flex items-center gap-3 mb-0">
                      <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Star className="w-6 h-6 text-brand-purple" />
                      </div>
                      <div>
                        <h1 className="text-xl sm:text-4xl font-bold text-brand-dark">Welcome back, Creator!</h1>
                        <p className="text-gray-600 text-lg">Track your earnings & quests done</p>
                      </div>
                    </div>
                  </div>
                  {/* <Button
              asChild
              className="bg-brand-purple text-white hover:bg-brand-purple/90 font-semibold px-8 py-3 text-lg shadow-lg"
            >
              <Link href="/quests">
                <Zap className="w-5 h-5 mr-2" />
                Find new quests
              </Link>
            </Button> */}
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-20">
              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-brand-purple to-brand-pink text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="text-3xl font-bold mb-1">${totalEarnings}</div>
                    <p className="text-white/90 text-sm mb-3">Total earnings from quests</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-white/80">
                        <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
                        ${walletBalance} balance
                      </div>
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                        <Wallet className="w-4 h-4 mr-1" />
                        Withdraw
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-brand-pink to-brand-purple text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Target className="w-6 h-6" />
                      </div>
                      <Trophy className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{quests.length}</div>
                    <p className="text-white/90 text-sm mb-2">Completed Quests</p>
                    <div className="flex items-center text-sm text-white/80">
                      <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
                      <p><span>{quests.filter(quest => quest._submissionRewarded).length}</span> rewarded</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-brand-purple/80 to-brand-pink/80 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Zap className="w-6 h-6" />
                      </div>
                      <Gift className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="text-3xl font-bold mb-1">50 points</div>
                    <p className="text-white/90 text-sm mb-3">Total extra points earned</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-white/80">
                        <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
                        50 points balance
                      </div>
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                        <Gift className="w-4 h-4 mr-1" />
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Social Media Accounts Section */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
                <CardHeader className="bg-gradient-to-r from-brand-purple/5 to-brand-pink/5 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-purple/10 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-brand-purple" />
                    </div>
                    <div>
                      <CardTitle className="text-brand-dark">My social accounts</CardTitle>
                      <CardDescription className="text-gray-600">
                        Link your profiles and earn rewards
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
<CardContent className="p-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {["twitter", "tiktok", "instagram"].map((platform) => {
      const account = linkedAccounts[platform as keyof typeof linkedAccounts];
      const isLinked = account !== null;
      
      return (
        <div 
          key={platform} 
          className="group relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-brand-purple/30 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 group-hover:to-brand-purple/5"></div>
          <div className="relative p-4">
            {isLinked ? (
              // Connected Account Display
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      platform === "twitter" ? "bg-black/10" :
                      platform === "tiktok" ? "bg-pink-100" : 
                      "bg-purple-100"
                    }`}>
                      <div className={getPlatformColor(platform)}>
                        {getPlatformIcon(platform)}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">{getPlatformName(platform)}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Connected</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlink(platform)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Profile Information */}
                <div className="bg-gradient-to-r from-brand-purple/5 to-brand-pink/5 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {account.profilePicture ? (
                      <img
                        src={account.profilePicture}
                        alt={account.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-brand-dark">
                          {account.name || account.username}
                        </h4>
                        {/* You can add verified badge logic here if needed */}
                      </div>
                      <p className="text-sm text-gray-600">@{account.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-brand-purple" />
                      <span className="font-bold text-brand-purple">
                        {account.followers?.toLocaleString() || '0'}
                      </span>
                      <span className="text-gray-600">followers</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLinkAccount(platform)}
                      className="text-brand-purple border-brand-purple/30 hover:bg-brand-purple/10"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Not Connected Display
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      platform === "twitter" ? "bg-black/10" :
                      platform === "tiktok" ? "bg-pink-100" : 
                      "bg-purple-100"
                    }`}>
                      <div className={getPlatformColor(platform)}>
                        {getPlatformIcon(platform)}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">{getPlatformName(platform)}</p>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-brand-purple/20 via-brand-pink/20 to-brand-purple/20 border border-brand-purple/30 rounded-full px-3 py-1.5 shadow-sm">
                    <div className="w-4 h-4 bg-gradient-to-r from-brand-purple to-brand-pink rounded-full flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-brand-purple">+100 XP</span>
                    <div className="w-1 h-1 bg-brand-purple/60 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleLinkAccount(platform)}
                  className="bg-brand-purple hover:bg-brand-purple/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full relative overflow-hidden group transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white animate-pulse" />
                    </div>
                    <span className="font-bold">Connect & Earn 100 points</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</CardContent>
              </Card>


              {/* Link Account Modal */}
              <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className={getPlatformColor(currentPlatform)}>
                        {getPlatformIcon(currentPlatform)}
                      </div>
                      Link {getPlatformName(currentPlatform)}
                    </DialogTitle>
                    <DialogDescription>
                      Paste your {getPlatformName(currentPlatform)} profile URL below and earn 100 points!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profileUrl">Profile URL</Label>
                      <Input
                        id="profileUrl"
                        placeholder={`https://${currentPlatform === 'twitter' ? 'x.com' : currentPlatform + '.com'}/@yourusername`}
                        value={profileUrl}
                        onChange={(e) => setProfileUrl(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="bg-brand-yellow/10 rounded-lg p-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-yellow/20 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-brand-yellow" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-dark">XP Reward</p>
                        <p className="text-xs text-gray-600">You'll earn 100 XP for connecting this account</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsLinkModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveLink}
                        disabled={!profileUrl.trim()}
                        className="bg-brand-purple hover:bg-brand-purple/90 text-white"
                      >
                        Link Account & Earn points
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>


              <Card className="bg-gradient-to-r from-brand-purple/5 to-brand-pink/5 border-brand-purple/20 shadow-sm mb-6">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {/* Icon Container */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-purple/10 rounded-full flex items-center justify-center">
                        {isVerified ? (
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
                            className="text-brand-teal"
                          >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        ) : (
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
                            className="text-brand-purple"
                          >
                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                            <circle cx="12" cy="10" r="2"></circle>
                            <line x1="8" y1="16" x2="16" y2="16"></line>
                            <line x1="12" y1="16" x2="12" y2="14"></line>
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 space-y-1 sm:space-y-1.5">
                      {isVerified ? (
                        <>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-brand-dark">Verified Creator</h3>
                            <Badge className="bg-brand-teal text-white text-xs sm:text-sm py-0.5 px-2">
                              Verified
                            </Badge>
                          </div>
                          {country && (
                            <p className="text-sm text-gray-600">
                              Verified in {country}. You have access to regional quests.
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-brand-dark">Get Verified</h3>
                            <Badge variant="outline" className="border-brand-purple/30 text-brand-purple bg-brand-purple/5 text-xs sm:text-sm py-0.5 px-2">
                              Optional
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Verify your country to access regional quests.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Button */}
                    {!isVerified && (
                      <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                        <Link href="/getVerified" passHref>
                          <Button size="sm" className="bg-brand-purple hover:bg-brand-purple/90 text-white w-full sm:w-auto">
                            Start
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="ml-1.5"
                            >
                              <path d="M7 7h10v10"></path>
                              <path d="M7 17 17 7"></path>
                            </svg>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>




              <Tabs defaultValue="completed" className="mb-8">
                <TabsList className="bg-white border border-gray-200">
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="completed" className="mt-4">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-4">
                      <h2 className="text-xl font-bold mb-4 text-brand-dark">Completed Quests ({quests.length})</h2>



                      <div className="space-y-6">
                        {quests && quests.length > 0 ? (
                          quests.map((quest) => (
                            <div key={quest._id} className="bg-brand-light rounded-xl p-5 transition-all hover:shadow-md">
                              <div className="flex flex-col md:flex-row gap-5">
                                {/* Image section with improved styling */}
                                <div className="h-32 md:h-auto md:w-48 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                  <img
                                    src={quest.brandImageUrl || "/default-quest-image.jpg"}
                                    alt={`${quest.brandName} thumbnail`}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                  />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                      {/* Brand name with icon */}
                                      <span className="text-sm text-gray-600 flex items-center">
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
                                          className="mr-1"
                                        >
                                          <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
                                          <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
                                          <line x1="12" y1="22" x2="12" y2="13"></line>
                                          <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
                                        </svg>
                                        {quest.brandName}
                                      </span>

                                      {/* Status badge with improved styling */}
                                      <Badge
                                        className={
                                          new Date(quest.endsOn) < new Date()
                                            ? "bg-brand-teal text-white"
                                            : "bg-brand-yellow text-brand-dark"
                                        }
                                      >
                                        {new Date(quest.endsOn) < new Date() ? "Quest ended" : "Quest in progress"}
                                      </Badge>

                                      {/* Date badge with cleaner format */}
                                      <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white">
                                        {new Date(quest._submittedOn).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </Badge>
                                    </div>

                                    {/* Quest title with larger font */}
                                    <h3 className="text-xl font-bold mb-2 text-brand-dark">{quest.title}</h3>

                                    {/* Payment amount with icon */}
                                    <div className="flex items-center text-brand-purple font-bold mb-3">
                                      <Gift className="w-4 h-4 mr-2" /> {quest.pricePerVideo} <CurrencyDisplay />
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                                    {/* Video link with platform icon */}
                                    <div className="relative inline-flex items-center">
                                      <a
                                        href={quest._videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-brand-purple hover:text-brand-pink transition-colors"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="mr-2"
                                        >
                                          <path d="m22 8-6 4 6 4V8Z"></path>
                                          <rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect>
                                        </svg>
                                        Watch on {quest._platformPosted}
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
                                          className="ml-1"
                                        >
                                          <path d="M7 7h10v10"></path>
                                          <path d="M7 17 17 7"></path>
                                        </svg>
                                      </a>

                                      <CopyButton text={quest._videoUrl || ''} />
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                      {/* Payment status with appropriate styling */}
                                      {quest._submissionRewarded ? (
                                        <div className="text-brand-teal font-bold flex items-center">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-1"
                                          >
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                          </svg>
                                          <span>{quest._rewardedAmount} <CurrencyDisplay /> earned</span>
                                        </div>
                                      ) : (
                                        <div className="text-dark flex items-center font-medium">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-1"
                                          >
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                          </svg>
                                          In review
                                        </div>
                                      )}

                                      {/* View quest button */}
                                      <Link href={`/quests/${quest._id}`} passHref>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-brand-purple text-brand-purple hover:bg-brand-purple/10 transition-colors"
                                        >
                                          View Quest
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 bg-brand-light/50 rounded-xl border border-dashed border-gray-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mx-auto text-gray-400 mb-4"
                            >
                              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                              <line x1="8" y1="21" x2="16" y2="21"></line>
                              <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                            <p className="text-gray-500 mb-2">No completed quests yet</p>
                            <p className="text-gray-400 text-sm mb-4">Complete your first quest to see it here</p>
                            <Button asChild size="sm" className="bg-brand-purple hover:bg-brand-purple/90 text-white">
                              <Link href="/quests">Browse Available Quests</Link>
                            </Button>
                          </div>
                        )}
                      </div>


                    </div>
                  </div>
                </TabsContent>
              </Tabs>


            </div>
          </div>
        </AuthGuard>

      )}
    </div>
  )
}
