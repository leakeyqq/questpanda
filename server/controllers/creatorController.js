import Quest from "./../models/quests/quest.js"
import Creator from "./../models/creators/creator.js"
import SimulatedCreator from "../models/creators/simulated-creator.js"
import { v2 as cloudinary } from 'cloudinary';
import axios from "axios"

export const creatorProfile = async(req, res)=>{
    try{
        let creator = await Creator.findOne({creatorAddress: req.userWalletAddress }).lean().exec()
        if(creator){
            // Get all unique quest IDs from questsDone
            const questIds = creator.questsDone.map(q => q.questID);

            // Fetch all quests in parallel
            const quests = await Quest.find({ _id: { $in: questIds } }).lean().exec();

            // Map quests with their reward status and amount
            const enrichedQuests = creator.questsDone.map(questDone => {
                const quest = quests.find(q => q._id.toString() === questDone.questID);
                return {
                    ...quest,
                    _submissionRewarded: questDone.submissionRewarded,
                    _submissionRejected: questDone.submissionRejected,
                    _rewardedAmount: questDone.rewardedAmount,
                    _platformPosted: questDone.platformPosted,
                    _videoUrl: questDone.videoUrl,
                    _submittedOn: questDone.submittedOn
                };
            });
            return res.status(200).json({creator, quests: enrichedQuests})
        }else{
            console.log('not found')
            return res.status(404)
        }
    }catch(e){
        console.log(e)
        return res.status(500).json({error: e})
    }

}


export const getSimulatedCreators = async(req, res)=>{
    try {
        const simulatedCreators = await SimulatedCreator.find().lean().exec()
        return res.status(200).json({simulatedCreators})
    } catch (error) {
        return res.status(500).json({error})
    }
}

export const linkProfile = async(req, res)=>{
    const {socialPlatform, profileUrl } = req.body

    try {
         if(!socialPlatform || !profileUrl){
              throw new Error('Missing fields!')
         }   

        const _platform = socialPlatform.toLowerCase()

        switch(_platform){
            case 'instagram':
                extractInstagramData(profileUrl, req, res);
                break;
            case 'twitter':
                extracTwitterData(profileUrl, req, res);
                break;
            case 'tiktok':
                extractTikTokData(profileUrl, req, res);
                break;
            default:
                return res.status(500).json({error: 'Unsupported platform'})
            
        }

   
    } catch (error) {
        console.log('an error was thrown')
        return res.status(500).json({error: error.message})
    }

}
async function extractTikTokData(profileUrl, req, res) {

    try {
            const username = extractTikTokUsername(profileUrl)
    const { data } = await axios.get(
        `https://api.scrapecreators.com/v1/tiktok/profile?handle=${username}`,
        {
            headers: {
                'x-api-key': 'fLfCQ5OSjRVM1CHju6VcsZat8Hv2'
            }
        }

    )

        const profilePhoto =  await processProfilePictureOnCloudy(data.user.avatarThumb)


    if (!data) {throw new Error('Could not fetch data')}

    const creatorData = {
        name: data.user.nickname,
        userName: data.user.uniqueId,
        url: `https://www.tiktok.com/@${data.user.uniqueId}`,
        followers: data.statsV2.followerCount,
        following: data.statsV2.followingCount,
        cloudinary_profilePicture: profilePhoto
    }

    console.log(creatorData)

    let updateCreator = await Creator.findOneAndUpdate(
        {creatorAddress:  req.userWalletAddress},
        {
            $unset: {tiktokData: ""}
        }
    )

    updateCreator = await Creator.findOneAndUpdate(
        {creatorAddress:  req.userWalletAddress},
        {
            $set: {tiktokData: creatorData}
        },
        {
            upsert: true,
            new: true
        }
    )

    return res.status(200).json({message: 'success', creator: updateCreator})

    } catch (error) {
        console.log(error)
        return res.status(200).json({ message: 'failed', error: error.message })

    }
}

async function extracTwitterData(profileUrl, req, res){

    
    try {
    const userName = extractTwitterUsername(profileUrl)

    const { data } = await axios.get(
    `https://api.scrapecreators.com/v1/twitter/profile?handle=${userName}`,
    {
        headers: {
        'x-api-key': 'fLfCQ5OSjRVM1CHju6VcsZat8Hv2'
        }
    }
    );

    if(!data){throw new Error('Could not fetch twitter data')}
    const profilePhoto =  await processProfilePictureOnCloudy(data.avatar.image_url)


    const creatorData = {
        name: data.core.name,
        userName: data.core.screen_name,
        url: `https://x.com/${data.core.screen_name}`,
        followers: data.legacy.followers_count,
        following: data.legacy.friends_count,
        cloudinary_profilePicture: profilePhoto
    }

    console.log(creatorData)

        let updateCreator = await Creator.findOneAndUpdate(
        {creatorAddress:  req.userWalletAddress},
        {
            $unset: {twitterData: ""}
        }
    )

    updateCreator = await Creator.findOneAndUpdate(
        {creatorAddress:  req.userWalletAddress},
        {
            $set: {twitterData: creatorData}
        },
        {
            upsert: true,
            new: true
        }
    )

    return res.status(200).json({message: 'success', creator: updateCreator})
    } catch (error) {
        console.log(error)
        return res.status(200).json({message: 'failed', error: error.message})
    }
   
}
async function extractInstagramData(profileUrl, req, res) {

    try {
        const userName = extractInstagramUsername(profileUrl)

        const { data } = await axios.get(
            `https://api.scrapecreators.com/v1/instagram/profile?handle=${userName}`,
            {
                headers: {
                    'x-api-key': 'fLfCQ5OSjRVM1CHju6VcsZat8Hv2'
                }
            }
        );
        if (!data) { throw new Error('Could not fetch twitter data') }


        const profilePhoto = await processProfilePictureOnCloudy(data.data.user.profile_pic_url)


        const creatorData = {
            name: data.data.user.full_name,
            userName: data.data.user.username,
            url: `https://www.instagram.com/${data.data.user.username}`,
            cloudinary_profilePicture: profilePhoto,
            followers: data.data.user.edge_followed_by.count,
            following: data.data.user.edge_follow.count,
            cloudinary_profilePicture: profilePhoto
        }
        console.log(creatorData)

        let updateCreator = await Creator.findOneAndUpdate(
            { creatorAddress: req.userWalletAddress },
            {
                $unset: { instagramData: "" }
            }
        )

        updateCreator = await Creator.findOneAndUpdate(
            { creatorAddress: req.userWalletAddress },
            {
                $set: { instagramData: creatorData }
            },
            {
                upsert: true,
                new: true
            }
        )

        return res.status(200).json({ message: 'success', creator: updateCreator })

    } catch (error) {
        console.log(error)
        return res.status(200).json({ message: 'failed', error: error.message })

    }
}

function extractTikTokUsername(url) {
    /**
     * Extracts the TikTok username from a given URL.
     * Throws an error if the URL doesn't contain a valid TikTok username.
     * 
     * @param {string} url - The TikTok URL containing the username
     * @return {string} The extracted username
     * @throws {Error} If no username is found in the URL
     */

    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    const pattern = /https?:\/\/(?:www\.)?tiktok\.com\/@([^\/?]+)/;
    const match = url.match(pattern);
    
    if (!match) {
        throw new Error('Invalid TikTok URL: no username found');
    }
    
    return match[1];
}
function extractTwitterUsername(url) {
    /**
     * Extracts the X (Twitter) username from a given URL.
     * Throws an error if the URL doesn't contain a valid X username.
     * 
     * @param {string} url - The X/Twitter URL containing the username
     * @return {string} The extracted username
     * @throws {Error} If no username is found in the URL
     */

    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    const pattern = /https?:\/\/(?:www\.)?x\.com\/([^\/?]+)(?:\/|$|\?)/i;
    const match = url.match(pattern);
    
    if (!match || !match[1]) {
        throw new Error('Invalid X URL: no username found');
    }
    
    return match[1];
}
function extractInstagramUsername(url) {
    /**
     * Extracts the Instagram username from a given URL.
     * Throws an error if the URL doesn't contain a valid Instagram username.
     * 
     * @param {string} url - The Instagram URL containing the username
     * @return {string} The extracted username
     * @throws {Error} If no username is found in the URL
     */
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    const pattern = /https?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)(?:\/|$|\?)/;
    const match = url.match(pattern);
    
    if (!match || !match[1]) {
        throw new Error('Invalid Instagram URL: no username found');
    }
    
    // Remove trailing slash if present
    const username = match[1].replace(/\/$/, '');
    
    return username;
}
async function processProfilePictureOnCloudy(imageUrl) {

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });

  if (!imageUrl) return null;

  try {
    // Download the image
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'arraybuffer'
    });

    // Convert to base64 for Cloudinary
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    const dataUri = `data:${response.headers['content-type']};base64,${imageBase64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'creator_profile_pictures',
      use_filename: true,
      unique_filename: true,
      quality: 'auto:good',
      width: 300,
      height: 300,
      crop: 'fill'
    });

    return result.secure_url;
  } catch (error) {
    console.error(`Failed to process image ${imageUrl}:`, error);
    return null;
  }
}