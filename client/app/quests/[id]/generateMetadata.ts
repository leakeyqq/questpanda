import { Metadata } from "next";
import { getSingleQuest } from "@/lib/quest";
import { notFound } from "next/navigation";

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const awaitedParams = await params; // Properly await params
  const quest = await getSingleQuest(awaitedParams.id);


  if (!quest) notFound();

    // Dynamic Frame metadata for Warpcast
    const frameEmbed = {
      version: "next",
      imageUrl: quest.brandImageUrl || "https://www.questpanda.xyz/icon.png", // Use quest image or fallback
      button: {
        // title: `🎯 Join Quest (${quest.prizePoolUsd})`, // Customize button text
        title: `🎯 Do quest -  ${quest.pricePerVideo} USD reward`, // Customize button text

        action: {
          type: "launch_frame",
          name: "Questpanda",
          url: `https://www.questpanda.xyz/quests/${awaitedParams.id}`, // Deep link to the quest
          splashImageUrl: "https://www.questpanda.xyz/icon.png",
          splashBackgroundColor: "#ffffff",
        },
      },
    };
  
  // console.log('file:generate metadata the found quest is ', quest)

  return {
    title: `${quest.title} - $${quest.pricePerVideo} reward`,
    description: quest.description,
    openGraph: {
      title: `${quest.title} - $${quest.pricePerVideo} reward`,
      description: quest.description,
      images: quest.brandImageUrl ? [quest.brandImageUrl] : [],
    },
    twitter: {
      title: `${quest.title} - $${quest.pricePerVideo} reward`,
      description: quest.description,
      images: quest.brandImageUrl ? [quest.brandImageUrl] : [],
      card: "summary_large_image",
    },
    other: {
      "fc:frame": JSON.stringify(frameEmbed), // Warpcast will parse this
    },
  };
}
