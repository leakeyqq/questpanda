import mongoose from "mongoose";
import Quest from "../models/quests/quest.js"
import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';

export const requestApprovalToJoinQuest = async(req, res) => {

    try {
        const {questId, platform, profile } = req.body
        const userWalletAddress = req.userWalletAddress

        let quest = await Quest.findById(questId).lean().exec()
        if(!quest){
            throw new Error('Quest not found')
        }

        // Check if user has already applied
        const existingApplication = quest.applicants.find(
            applicant => applicant.userWalletAddress === userWalletAddress
        );

        if (existingApplication) {
            throw new Error('You cannot request to be approved more than once!')
        }

        if (platform === 'instagram') {
            const minFollowers = Number(quest.socialPlatformsAllowed.instagram.minFollowers)
            await applyAsInstagramCreator(questId, profile, res, minFollowers, userWalletAddress)
        } else if (platform === 'twitter') {
            const minFollowers = Number(quest.socialPlatformsAllowed.instagram.minFollowers)
            await applyAsTwitterCreator(questId, profile, res, minFollowers, userWalletAddress);
        } else if (platform === 'tiktok') {
            const minFollowers = Number(quest.socialPlatformsAllowed.instagram.minFollowers)
            await applyAsTikTokCreator(questId, profile, res, minFollowers, userWalletAddress);
        } else {
            return res.status(200).json({ message: "Unsupported platform" });
        }
    } catch (error) {
        return res.status(500).json({error: error.message})
    }

}

async function applyAsInstagramCreator(questId, profile, res, minFollowers, userWalletAddress){
    let userName = extractInstagramUsername(profile)
    const { data } = await axios.get(
        `https://api.scrapecreators.com/v1/instagram/profile?handle=${userName}`,
        {
        headers: {
            'x-api-key': process.env.SCRAPECREATOR_API_KEY
        }
        }
    );

     let userData = data.data.user

    let IG_User = {
        userName: userData.username,
        name: userData.full_name,
        userId: userData.id,
        profilePicture: userData.profile_pic_url,
        following: userData.edge_follow.count,
        followers: userData.edge_followed_by.count
    }

    if(Number(userData.edge_followed_by.count) < minFollowers){
            return res.status(200).json({message: 'You do not meet the minimum number of followers needed!'})

    }
        // Update the quest directly
    const updatedQuest = await Quest.findByIdAndUpdate(
        questId,
        {
            $push: {
                applicants: {
                    userWalletAddress,
                    platform: 'instagram',
                    approved: false,
                    instagram: IG_User
                }
            }
        },
        { new: true } // Return the updated document
    );

    if (!updatedQuest) {
        throw new Error('Quest not found or update failed');
    }

    return res.status(200).json({message: 'success'})


}
async function applyAsTwitterCreator(questId, profile, res, minFollowers, userWalletAddress){
    let userName = extractTwitterUsername(profile)
    const { data } = await axios.get(
        `https://api.scrapecreators.com/v1/twitter/profile?handle=${userName}`,
        {
            headers: {
                'x-api-key': process.env.SCRAPECREATOR_API_KEY
                // 'x-api-key': 'fLfCQ5OSjRVM1CHju6VcsZat8Hv2'
            }
        }
    );

        let twitterDate = data.legacy.created_at
            // Parse to JavaScript Date object
        const dateObj = new Date(twitterDate);

        // Convert to ISO string (UTC) - works with most databases
        const isoString = dateObj.toISOString(); 
        // "2021-12-13T20:52:38.000Z"
        let xProfile = {
            userName: data.legacy.screen_name,
            name: data.legacy.name,
            isVerified: data.verification.verified,
            isBlueVerified: data.is_blue_verified,
            profilePicture: data.avatar.image_url,
            location: data.location.location,
            followers: data.legacy.followers_count,
            following: data.legacy.friends_count,
            description: data.legacy.description,
            createdAt: isoString,
        }

        if(Number(data.legacy.followers_count) < minFollowers){
            return res.status(200).json({message: 'You do not meet the minimum number of followers needed!'})
        }
            // Update the quest directly
        const updatedQuest = await Quest.findByIdAndUpdate(
            questId,
            {
                $push: {
                    applicants: {
                        userWalletAddress,
                        platform: 'twitter',
                        approved: false,
                        twitter: xProfile
                    }
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedQuest) {
        
            throw new Error('Quest not found or update failed');
        }

        return res.status(200).json({message: 'success'})


}
async function applyAsTikTokCreator(questId, profile, res, minFollowers, userWalletAddress){
    let userName = extractTikTokUsername(profile)
    
    const { data } = await axios.get(
        `https://api.scrapecreators.com/v1/tiktok/profile?handle=${userName}`,
        {
            headers: {
            'x-api-key':  process.env.SCRAPECREATOR_API_KEY
            }
        }
    )
    let partialUserData = data.user
    let userStats = data.statsV2

      let tiktokDate = partialUserData.createTime
    // Parse to JavaScript Date object
    const dateObj = new Date(tiktokDate);

    // Convert to ISO string (UTC) - works with most databases
    const isoString = dateObj.toISOString();

    let tiktokUser = {
        userId: partialUserData.id,
        userName: partialUserData.uniqueId,
        name: partialUserData.nickname,
        profilePicture: partialUserData.avatarThumb,
        following: userStats.followingCount,
        followers: userStats.followerCount,
        createdAt: isoString
    }

    if(Number(userStats.followerCount) < minFollowers){
           return res.status(200).json({message: 'You do not meet the minimum number of followers needed!'})
    }
        // Update the quest directly
        const updatedQuest = await Quest.findByIdAndUpdate(
            questId,
            {
                $push: {
                    applicants: {
                        userWalletAddress,
                        platform: 'tiktok',
                        approved: false,
                        tiktok: tiktokUser
                    }
                }
            },
            { new: true } // Return the updated document
        );


        if (!updatedQuest) {
            throw new Error('Quest not found or update failed');
        }

    return res.status(200).json({message: 'success'})

}

function extractInstagramUsername(profile){
    // Handle various URL formats:
    // https://www.instagram.com/username/
    // http://instagram.com/username
    // www.instagram.com/username
    // instagram.com/username
    // @username
    // username
    let username = profile.trim();
    
    // Remove @ prefix if present
    if (username.startsWith('@')) {
        username = username.substring(1);
    }
    
    // Extract from URL
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^\/\?\s]+)/i;
    const match = username.match(urlPattern);
    
    if (match) {
        username = match[1];
    }else{
        throw new Error('Could not extract a valid username from: ' + profile);
    }
    
    // Remove any trailing slashes or query params
    username = username.split('/')[0];
    username = username.split('?')[0];
    
    return username;
}
function extractTikTokUsername(profile) {
    // Handle various URL formats:
    // https://www.tiktok.com/@username
    // tiktok.com/@username
    // @username
    // username
    
    let username = profile.trim();
    
    // Remove @ prefix if present
    if (username.startsWith('@')) {
        username = username.substring(1);
    }
    
    // Extract from URL
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([^\/\?\s]+)/i;
    const match = username.match(urlPattern);
    
    if (match) {
        username = match[1];
    }else{
        throw new Error('Could not extract a valid username from: ' + profile);
    }
    
    // Remove any trailing slashes or query params
    username = username.split('/')[0];
    username = username.split('?')[0];
    
    return username;
}
// Twitter Functions
function extractTwitterUsername(profile) {
    // Handle various URL formats:
    // https://twitter.com/username
    // https://x.com/username
    // twitter.com/username
    // x.com/username
    // @username
    // username
    
    let username = profile.trim();
    
    // Remove @ prefix if present
    if (username.startsWith('@')) {
        username = username.substring(1);
    }
    
    // Extract from URL
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([^\/\?\s]+)/i;
    const match = username.match(urlPattern);
    
    if (match) {
        username = match[1];
    }else{
        throw new Error('Could not extract a valid username from: ' + profile);
    }
    
    // Remove any trailing slashes or query params
    username = username.split('/')[0];
    username = username.split('?')[0];
    // Validate the final username
    if (!username || username.length === 0) {
        throw new Error('Could not extract a valid username from: ' + profile);
    }
    
    return username;
}